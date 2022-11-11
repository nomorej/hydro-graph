import { Scene } from './Scene'
import { Renderer } from './Renderer'
import { CanvasParameters } from '../tools/Canvas'
import { cursorPosition } from '../utils/coordinates'
import { clamp } from '../utils/math'
import { Timeline, TimelineMonthsData } from './Timeline'
import { Rows, RowsFactors } from './Rows'
import { Graph, GraphData, GraphParameters } from './Graph'
import { Constructor } from '../utils/ts'
import { Calculator } from './Calculator'
import { TimelineView } from './TimelineView'
import { GraphWithScale, GraphWithScaleParameters, ScalePosition } from './GraphWithScale'
import { Content } from './Content'
import { Scrollbar } from './Scrollbar'

export interface Parameters {
  container: CanvasParameters['container']
  months: TimelineMonthsData
  rows: RowsFactors
}

export class ComplexGraph {
  public static globals = {
    sizes: {
      font: 0.02,
    },
    colors: {
      timeline: {
        scale: 'black',
        font: 'black',
        month: '#dcdcdc',
        day: '#dcdcdc',
        hour: '#dcdcdc',
      },
      content: {
        background: '#f5fcff',
      },
    },
    font: 'sans-serif',
    zoomMouseButton: 0,
    wheelZoomAcceleration: 1,
    wheelTranlationSpeed: 1,
    smoothness: 7,
    maxZoom: 300,
    calculator: new Calculator(),
    timeline: new Timeline(),
    rows: new Rows(),
  }

  private readonly wrapper: HTMLElement
  private readonly container: HTMLElement
  private readonly scene: Scene
  private readonly renderer: Renderer

  private readonly statuses: {
    scaleButtonPressed: boolean
    fullView: boolean
  }

  private readonly toggleViewButton: HTMLElement

  constructor(parameters: Parameters) {
    this.wrapper = parameters.container

    this.container = document.createElement('div')
    this.container.style.cssText = `
      position: relative;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
    `
    this.wrapper.appendChild(this.container)

    this.toggleViewButton = document.createElement('div')
    this.toggleViewButton.style.cssText = `
      position: absolute;
      top: 0;
      right: 0;
      z-index: 2;
      width: 2vmin;
      height: 2vmin;
      cursor: pointer;
      background-color: black;
    `
    this.container.appendChild(this.toggleViewButton)

    this.scene = new Scene()

    this.renderer = new Renderer({
      container: this.container,
      scene: this.scene,
      clearColor: 'white',
    })

    ComplexGraph.globals.timeline.construct(parameters.months)
    ComplexGraph.globals.rows.construct(parameters.rows)

    this.scene.addObject(ComplexGraph.globals.calculator)
    this.scene.addObject(new Content())
    this.scene.addObject(new TimelineView())
    this.scene.addObject(new Scrollbar())

    this.statuses = {
      scaleButtonPressed: false,
      fullView: false,
    }

    this.container.addEventListener('wheel', this.handleWheel)
    this.container.addEventListener('pointerdown', this.handlePointerDown)
    this.container.addEventListener('pointerup', this.handleMouseUp)
    this.container.addEventListener('contextmenu', this.handleContextMenu)
    this.toggleViewButton.addEventListener('click', this.toggleView)
  }

  public destroy(): void {
    this.container.removeEventListener('wheel', this.handleWheel)
    this.container.removeEventListener('pointerdown', this.handlePointerDown)
    this.container.removeEventListener('pointerup', this.handleMouseUp)
    this.container.removeEventListener('contextmenu', this.handleContextMenu)
    this.toggleViewButton.removeEventListener('click', this.toggleView)

    this.renderer.destroy()

    this.wrapper.removeChild(this.container)
  }

  public add<K extends string, T extends Graph<K> | GraphWithScale<K>>(
    constructor: Constructor<T, GraphParameters<K> | GraphWithScaleParameters<K>>,
    parameters: {
      name?: string
      data: GraphData<
        K,
        Array<{ day: number; value: number | Array<{ hour: number; value: number }> }>
      >
      row: number
      scaleName?: string
      scaleStep?: number
      scalePositon?: ScalePosition
    }
  ) {
    if (!ComplexGraph.globals.rows.rows[parameters.row]) {
      throw new Error(`Ряд номер ${parameters.row} не существует`)
    }

    const name = parameters.name
    const row = ComplexGraph.globals.rows.rows[parameters.row]
    const data: GraphData<K> = {} as GraphData<K>

    for (const key in parameters.data) {
      const months = parameters.data[key]

      data[key] = []

      let index = 0

      months.forEach((month, monthIndex) => {
        if (!ComplexGraph.globals.timeline.months[monthIndex]) {
          throw new Error(`Месяц с индексом ${monthIndex} не существует`)
        }

        month.forEach((day) => {
          if (typeof day.value !== 'number') {
            const daySegment = ComplexGraph.globals.timeline.months[monthIndex].days[day.day - 1]

            const parent = {
              segment: daySegment,
              middleValue: 0,
            }

            day.value.forEach((hour, _index, arr) => {
              data[key][index] = {
                segment: daySegment.hours[hour.hour - 1],
                value: hour.value,
                parent: parent,
              }

              parent.middleValue = arr.reduce((p, c) => p + c.value, 0) / arr.length

              index++
            })
          } else {
            data[key][index] = {
              segment: ComplexGraph.globals.timeline.months[monthIndex].days[day.day - 1],
              value: day.value,
            }
            index++
          }
        })
      })
    }

    if (constructor.prototype instanceof GraphWithScale) {
      this.scene.addObject(
        new (constructor as Constructor<GraphWithScale<K>, GraphWithScaleParameters<K>>)({
          row,
          name,
          data,
          scaleName: parameters.scaleName,
          scaleStep: parameters.scaleStep || 5,
          scalePosition: parameters.scalePositon,
        })
      )
    } else {
      this.scene.addObject(
        new (constructor as Constructor<Graph<K>, GraphParameters<K>>)({
          row,
          name,
          data,
        })
      )
    }
  }

  private handleWheel = (event: WheelEvent) => {
    if (this.statuses.scaleButtonPressed) {
      this.scale(event)
    } else {
      this.translate(event)
    }
  }

  private handlePointerDown = (event: PointerEvent) => {
    if (event.button === ComplexGraph.globals.zoomMouseButton) {
      event.preventDefault()
      this.statuses.scaleButtonPressed = true
    }
  }

  private handleMouseUp = (event: PointerEvent) => {
    if (event.button === ComplexGraph.globals.zoomMouseButton) {
      event.preventDefault()
      this.statuses.scaleButtonPressed = false
    }
  }

  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
  }

  private scale = (event: WheelEvent) => {
    const mousePosition = cursorPosition(event, this.container, {
      x: ComplexGraph.globals.calculator.area.x1,
      y: 0,
    }).x
    console.log(mousePosition)
    const zoomSpeed =
      clamp(event.deltaY, -1, 1) *
      this.scene.zoom *
      ComplexGraph.globals.wheelZoomAcceleration *
      0.2
    this.renderer.withTicker(() => {
      this.scene.scale(mousePosition, zoomSpeed)
    })
  }

  private translate = (event: WheelEvent) => {
    this.renderer.withTicker(() => {
      this.scene.translate(event.deltaY * ComplexGraph.globals.wheelTranlationSpeed)
    })
  }

  private toggleView = () => {
    this.renderer.stopTick()

    if (this.statuses.fullView) {
      this.container.style.position = 'relative'
      this.toggleViewButton.style.backgroundColor = 'black'
    } else {
      this.container.style.position = 'fixed'
      this.toggleViewButton.style.backgroundColor = 'red'
    }

    this.statuses.fullView = !this.statuses.fullView
  }
}
