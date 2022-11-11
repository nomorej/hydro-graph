import { Scene } from './Scene'
import { Renderer } from './Renderer'
import { CanvasParameters } from '../tools/Canvas'
import { cursorPosition } from '../utils/coordinates'
import { clamp } from '../utils/math'
import { Timeline, TimelineMonthsData } from './Timeline'
import { Rows, RowsFactors } from './Rows'
import { Calculator } from './Calculator'
import { Object } from './Object'

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
        month: 'lightblue',
        day: 'lightblue',
        hour: 'lightblue',
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

  public destroy() {
    this.container.removeEventListener('wheel', this.handleWheel)
    this.container.removeEventListener('pointerdown', this.handlePointerDown)
    this.container.removeEventListener('pointerup', this.handleMouseUp)
    this.container.removeEventListener('contextmenu', this.handleContextMenu)
    this.toggleViewButton.removeEventListener('click', this.toggleView)

    this.renderer.destroy()

    this.wrapper.removeChild(this.container)
  }

  public add<T extends Object>(object: T) {
    this.scene.addObject(object)
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
