import { Scene } from './Scene'
import { Renderer } from './Renderer'
import { SceneObject } from './SceneObject'
import { Graph } from './Graph'
import { Primitive } from '../helpers/Primitive'
import { CanvasParameters } from '../tools/Canvas'
import { UtilsCoordinates } from '../utils/UtilsCoordinates'
import { UtilsMath } from '../utils/UtilsMath'
import { MonthsData } from '../utils/UtilsTS'
import { GraphData } from './GraphData'

export type AirTemperatureGraphsData = GraphData<{
  max: MonthsData
  middle: MonthsData
  min: MonthsData
}>

export type PrecipitationGraphsData = GraphData<{
  liquid: MonthsData
  solid: MonthsData
}>

export interface GraphsData {
  airTemperature: AirTemperatureGraphsData
  precipitation: PrecipitationGraphsData
}

export type GraphsNames = keyof GraphsData

export interface TimelineMonth {
  primitive: Primitive
  name: string
  days: number
  segments: Array<{
    position: number
    value: number | string
  }>
}

export interface Globals {
  colors: {
    clear?: string
    timeline: string
    timelineMonth: string
    content: string
    default: string
    graphs: {
      airTemperature: {
        scale: string
        min: string
        middle: string
        max: string
      }
      precipitation: {
        scale: string
        liquid: string
        solid: string
      }
      iceCover: {
        scale: string
      }
      iceRuler: {
        scale: string
      }
      snowAmount: {
        scale: string
      }
      waterConsumption: {
        scale: string
      }
      waterLevel: {
        scale: string
      }
      waterTemperature: {
        scale: string
      }
    }
  }
  font: string
  sizes: {
    font: number
    paddingX: number
    paddingTop: number
    contentPaddingX: number
    timelineOffsetY: number
    timelineHeight: number
    rowsFactors: { [key: number]: number }
    rowsGap: number
    scaleOffset: number
    scaleMarkSize: number
    scalePointerSize: number
    scaleThickness: number
  }
  calculations: {
    fontSize: number
    workspace: Primitive
    content: Primitive
    contentWrapper: Primitive
    timeline: {
      primitive: Primitive
      months: Array<TimelineMonth>
    }
    rowsPrimitives: { [key: number]: Primitive }
    scaleOffset: number
    scaleThickness: number
  }
  monthsData: Array<Pick<TimelineMonth, 'name' | 'days'>>
  graphsData: GraphsData
  rowsVisibility: { [key: number]: boolean }
}

export interface Settings {
  zoomMouseButton: 'left' | 'right'
  wheelZoomAcceleration: number
  wheelTranlationSpeed: number
  smoothness: number
  maxZoom: number
}

export interface Parameters extends Omit<Globals, 'calculations'> {
  container: CanvasParameters['container']
  settings?: Partial<Settings>
  graphsData: Globals['graphsData']
  objects: Array<SceneObject | Graph>
}

export let CGGlobals: Globals = null!

export class ComplexGraph {
  public readonly renderer: Renderer

  private readonly container: HTMLElement
  private readonly wrapper: HTMLElement

  private readonly settings: Pick<Settings, 'wheelZoomAcceleration' | 'wheelTranlationSpeed'> & {
    zoomMouseButton: 0 | 2
  }

  private readonly scene: Scene

  private readonly statuses: {
    scaleButtonPressed: boolean
    fullView: boolean
  }

  private readonly toggleViewButton: HTMLElement

  constructor(parameters: Parameters) {
    CGGlobals = {
      calculations: {
        fontSize: 0,
        timeline: {
          primitive: new Primitive(),
          months: [],
        },
        content: new Primitive(),
        contentWrapper: new Primitive(),
        workspace: new Primitive(),
        rowsPrimitives: {},
        scaleOffset: 0,
        scaleThickness: 0,
      },
      graphsData: parameters.graphsData,
      colors: parameters.colors,
      monthsData: parameters.monthsData,
      font: parameters.font,
      rowsVisibility: parameters.rowsVisibility,
      sizes: parameters.sizes,
    }

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

    this.settings = {
      zoomMouseButton: 0,
      wheelZoomAcceleration: 1,
      wheelTranlationSpeed: 1,
    }

    this.scene = new Scene({
      maxZoom: parameters.settings?.maxZoom,
      smoothness: parameters.settings?.smoothness,
    })

    this.renderer = new Renderer({
      container: this.container,
      scene: this.scene,
    })

    this.statuses = {
      scaleButtonPressed: false,
      fullView: false,
    }

    parameters.objects.forEach((object) => {
      this.scene.addObject(object)
      if (object instanceof Graph) {
        CGGlobals.rowsVisibility[object.row] = true
        if (!CGGlobals.sizes.rowsFactors[object.row]) {
          CGGlobals.sizes.rowsFactors[object.row] = 1
        }
        if (!CGGlobals.calculations.rowsPrimitives[object.row]) {
          CGGlobals.calculations.rowsPrimitives[object.row] = new Primitive()
        }
      }
    })

    this.updateSettings(parameters.settings || {})

    this.container.addEventListener('wheel', this.handleWheel)
    this.container.addEventListener('pointerdown', this.handlePointerDown)
    this.container.addEventListener('pointerup', this.handleMouseUp)
    this.container.addEventListener('contextmenu', this.handleContextMenu)
    this.toggleViewButton.addEventListener('click', this.toggleView)
  }

  public updateSettings(settings: Partial<Settings>) {
    this.scene.maxZoom = settings.maxZoom || 10
    this.scene.setSmoothness(settings.smoothness || 0)
    this.settings.zoomMouseButton =
      settings.zoomMouseButton === 'left' ? 0 : settings.zoomMouseButton === 'right' ? 2 : 0
    this.settings.wheelZoomAcceleration = settings.wheelZoomAcceleration ?? 1
    this.settings.wheelTranlationSpeed = settings.wheelTranlationSpeed ?? 1
  }

  public destroy(): void {
    this.container.removeEventListener('wheel', this.handleWheel)
    this.container.removeEventListener('pointerdown', this.handlePointerDown)
    this.container.removeEventListener('pointerup', this.handleMouseUp)
    this.container.removeEventListener('contextmenu', this.handleContextMenu)
    this.toggleViewButton.removeEventListener('click', this.toggleView)

    this.renderer.destroy()

    this.wrapper.removeChild(this.container)

    CGGlobals = null!
  }

  public hideObject(nameOrRowId: GraphsNames | number) {
    this.toggleVisibility(nameOrRowId, false)
  }

  public showObject(nameOrRowId: GraphsNames | number) {
    this.toggleVisibility(nameOrRowId, true)
  }

  private toggleVisibility(nameOrRowId: GraphsNames | number, visible: boolean) {
    if (typeof nameOrRowId === 'string') {
      this.scene.objects.forEach((object) => {
        if (object.name === nameOrRowId) {
          object.active = visible
        }
      })
    } else {
      const rowObjects = this.scene.objects.filter(
        (object) => object instanceof Graph
      ) as Array<Graph>
      CGGlobals.rowsVisibility[nameOrRowId] = visible
      rowObjects.forEach((o) => o.row === nameOrRowId && (o.active = visible))
    }
    this.renderer.redraw()
  }

  private handleWheel = (event: WheelEvent) => {
    if (this.statuses.scaleButtonPressed) {
      this.scale(event)
    } else {
      this.translate(event)
    }
  }

  private handlePointerDown = (event: PointerEvent) => {
    if (event.button === this.settings.zoomMouseButton) {
      event.preventDefault()
      this.statuses.scaleButtonPressed = true
    }
  }

  private handleMouseUp = (event: PointerEvent) => {
    if (event.button === this.settings.zoomMouseButton) {
      event.preventDefault()
      this.statuses.scaleButtonPressed = false
    }
  }

  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
  }

  private scale = (event: WheelEvent) => {
    const mousePosition = UtilsCoordinates.cursorPosition(event, this.container).x
    const zoomSpeed =
      UtilsMath.clamp(event.deltaY, -1, 1) *
      this.scene.zoom *
      this.settings.wheelZoomAcceleration *
      0.2
    this.renderer.withTicker(() => {
      this.scene.scale(mousePosition, zoomSpeed)
    })
  }

  private translate = (event: WheelEvent) => {
    this.renderer.withTicker(() => {
      this.scene.translate(event.deltaY * this.settings.wheelTranlationSpeed)
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
