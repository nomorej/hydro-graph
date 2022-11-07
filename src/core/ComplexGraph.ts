import { Scene } from './Scene'
import { Renderer } from './Renderer'
import { SceneObject } from './SceneObject'
import { SceneDataRepresentation } from './SceneDataRepresentation'
import { Primitive } from '../tools/Primitive'
import { CanvasParameters } from '../tools/Canvas'
import { Scrollbar } from './Scrollbar'
import { UtilsCoordinates } from '../utils/UtilsCoordinates'
import { UtilsMath } from '../utils/UtilsMath'
import { ScaleSegments, ScaleSegmentsData } from '../tools/ScaleSegments'

export type DataReps =
  | 'airTemperature'
  | 'iceCover'
  | 'iceRuler'
  | 'precipitation'
  | 'snowAmount'
  | 'waterConsumption'
  | 'waterLevel'
  | 'waterTemperature'

export type DataRepsWithScales = Exclude<DataReps, 'iceCover' | 'iceRuler'>

export type MonthsData = Array<string> | undefined

export interface GraphsDataGroup<T extends ScaleSegmentsData> {
  name: string
  scaleName: string
  graph: T
}

export type GraphsData = {
  airTemperature: GraphsDataGroup<{
    max: Array<number>
    middle: Array<number>
    min: Array<number>
  }>
  precipitation: GraphsDataGroup<Array<number>>
}

export interface Data {
  months: MonthsData
  reps: GraphsData
}

export interface Colors {
  timeline: string
  timelineMonth: string
  content: string
  default: string
  reps: {
    airTemperature: {
      scale: string
      min: string
      middle: string
      max: string
    }
    precipitation: {
      scale: string
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

export interface Sizes {
  font: number
  paddingX: number
  paddingY: number
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

export interface ScaleCalculationSegment {
  position: number
  value: string | number
  isBase: boolean
}

export interface Calculations {
  fontSize: number
  workspace: Primitive
  content: Primitive
  contentWrapper: Primitive
  timeline: {
    primitive: Primitive
    months: Array<{
      primitive: Primitive
      data: string
    }>
  }
  rowsPrimitives: { [key: number]: Primitive }
  scaleOffset: number
  scaleThickness: number
  scales: { [K in DataRepsWithScales]: ScaleSegments }
}

export interface ComplexGraphGlobals {
  data: Data
  colors: Colors
  font: string
  sizes: Sizes
  calculations: Calculations
  rowsVisibility: { [key: number]: boolean }
}

export type GlobalsConfig = Omit<ComplexGraphGlobals, 'calculations'>

export interface Settings {
  zoomMouseButton: 'left' | 'right'
  wheelZoomSpeed: number
  wheelTranlationSpeed: number
  smoothness: number
  maxZoom: number
}

export interface ComplexGraphParameters extends Pick<CanvasParameters, 'container'> {
  settings?: Partial<Settings>
  globals: GlobalsConfig
  objects: Array<SceneObject | SceneDataRepresentation>
}

export let CGGlobals: ComplexGraphGlobals = null!

export class ComplexGraph {
  public readonly renderer: Renderer

  private readonly container: HTMLElement

  private readonly settings: Pick<Settings, 'wheelZoomSpeed' | 'wheelTranlationSpeed'> & {
    zoomMouseButton: 0 | 2
  }

  private readonly scene: Scene
  private readonly scrollbar: Scrollbar

  private readonly statuses: {
    scaleButtonPressed: boolean
  }

  constructor({ container, settings = {}, globals, objects }: ComplexGraphParameters) {
    CGGlobals = {
      ...globals,
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
        scales: {
          airTemperature: new ScaleSegments(globals.data.reps.airTemperature.graph),
          precipitation: new ScaleSegments(globals.data.reps.precipitation.graph, false),
          snowAmount: new ScaleSegments(globals.data.reps.precipitation.graph),
          waterConsumption: new ScaleSegments(globals.data.reps.precipitation.graph),
          waterLevel: new ScaleSegments(globals.data.reps.precipitation.graph),
          waterTemperature: new ScaleSegments(globals.data.reps.precipitation.graph),
        },
      },
    }

    this.container = container

    this.settings = {
      zoomMouseButton: 0,
      wheelZoomSpeed: 1,
      wheelTranlationSpeed: 1,
    }

    this.scene = new Scene({
      maxZoom: settings.maxZoom,
      smoothness: settings.smoothness,
    })

    this.renderer = new Renderer({
      container: this.container,
      scene: this.scene,
    })

    this.scrollbar = new Scrollbar({
      container: this.container,
      renderer: this.renderer,
    })

    this.statuses = {
      scaleButtonPressed: false,
    }

    objects.forEach((object) => {
      this.scene.addObject(object)
      if (object instanceof SceneDataRepresentation) {
        CGGlobals.rowsVisibility[object.row] = true
        if (!CGGlobals.sizes.rowsFactors[object.row]) {
          CGGlobals.sizes.rowsFactors[object.row] = 1
        }
        if (!CGGlobals.calculations.rowsPrimitives[object.row]) {
          CGGlobals.calculations.rowsPrimitives[object.row] = new Primitive()
        }
      }
    })

    this.updateSettings(settings)

    this.container.addEventListener('wheel', this.handleWheel)
    this.container.addEventListener('pointerdown', this.handlePointerDown)
    this.container.addEventListener('pointerup', this.handleMouseUp)
    this.container.addEventListener('contextmenu', this.handleContextMenu)
  }

  public updateSettings(settings: Partial<Settings>) {
    this.scene.maxZoom = settings.maxZoom || 10
    this.scene.setSmoothness(settings.smoothness || 0)
    ;(this.settings.zoomMouseButton =
      settings.zoomMouseButton === 'left' ? 0 : settings.zoomMouseButton === 'right' ? 2 : 0),
      (this.settings.wheelZoomSpeed = settings.wheelZoomSpeed ?? 1)
    this.settings.wheelTranlationSpeed = settings.wheelTranlationSpeed ?? 1
  }

  public destroy(): void {
    this.container.removeEventListener('wheel', this.handleWheel)
    this.container.removeEventListener('pointerdown', this.handlePointerDown)
    this.container.removeEventListener('pointerup', this.handleMouseUp)
    this.container.removeEventListener('contextmenu', this.handleContextMenu)

    this.renderer.destroy()
    this.scrollbar.destroy()

    CGGlobals = null!
  }

  public hideObject(nameOrRowId: DataReps | number) {
    this.toggleVisibility(nameOrRowId, false)
  }

  public showObject(nameOrRowId: DataReps | number) {
    this.toggleVisibility(nameOrRowId, true)
  }

  private toggleVisibility(nameOrRowId: DataReps | number, visible: boolean) {
    if (typeof nameOrRowId === 'string') {
      this.scene.objects.forEach((object) => {
        if (object.name === nameOrRowId) {
          object.active = visible
        }
      })
    } else {
      const rowObjects = this.scene.objects.filter(
        (object) => object instanceof SceneDataRepresentation
      ) as Array<SceneDataRepresentation>
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
    const zoomSpeed = this.settings.wheelZoomSpeed * UtilsMath.clamp(event.deltaY, -1, 1)
    this.renderer.withTicker(() => {
      this.scene.scale(mousePosition, zoomSpeed)
    })
  }

  private translate = (event: WheelEvent) => {
    this.renderer.withTicker(() => {
      this.scene.translate(event.deltaY * this.settings.wheelTranlationSpeed)
    })
  }
}
