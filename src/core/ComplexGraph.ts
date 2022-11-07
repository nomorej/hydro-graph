import { Scene } from './Scene'
import { Renderer } from './Renderer'
import { SceneObject } from './SceneObject'
import { SceneRowObject } from './SceneRowObject'
import { Primitive } from '../tools/Primitive'
import { CanvasParameters } from '../tools/Canvas'
import { Scrollbar } from './Scrollbar'
import { UtilsCoordinates } from '../utils/UtilsCoordinates'
import { UtilsMath } from '../utils/UtilsMath'

export interface ComplexGraphGlobals {
  data: {
    months: Array<string> | undefined
    airTemperature: {
      max: Array<number>
      middle: Array<number>
      min: Array<number>
    }
  }
  colors: {
    timeline: string
    timelineMonth: string
    content: string
    default: string
    airTemperature: {
      scale: string
      min: string
      middle: string
      max: string
    }
  }
  font: string
  sizes: {
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
  calculations: {
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
    scales: {
      airTemperature: Array<{
        position: number
        data: string | number
        isBase: boolean
      }>
    }
    airTemperatureMax: number
    airTemperatureMin: number
  }
  rowsVisibility: { [key: number]: boolean }
}

export type ComplexGraphGlobalsConfig = Omit<ComplexGraphGlobals, 'calculations'>

export interface ComplexGraphSettings {
  zoomMouseButton: 'left' | 'right'
  wheelZoomSpeed: number
  wheelTranlationSpeed: number
  smoothness: number
  maxZoom: number
}

export interface ComplexGraphParameters extends Pick<CanvasParameters, 'container'> {
  settings?: Partial<ComplexGraphSettings>
  globals: ComplexGraphGlobalsConfig
  objects: Array<SceneObject | SceneRowObject>
}

export let CGGlobals: ComplexGraphGlobals = null!

export class ComplexGraph {
  public readonly renderer: Renderer

  private readonly container: HTMLElement

  private readonly settings: Pick<
    ComplexGraphSettings,
    'wheelZoomSpeed' | 'wheelTranlationSpeed'
  > & {
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
          airTemperature: [],
        },
        airTemperatureMax: 0,
        airTemperatureMin: 0,
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
      if (object instanceof SceneRowObject) {
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

  public updateSettings(settings: Partial<ComplexGraphSettings>) {
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

  public hideObject(nameOrRowId: string | number) {
    this.toggleVisibility(nameOrRowId, false)
  }

  public showObject(nameOrRowId: string | number) {
    this.toggleVisibility(nameOrRowId, true)
  }

  private toggleVisibility(nameOrRowId: string | number, visible: boolean) {
    if (typeof nameOrRowId === 'string') {
      this.scene.objects.forEach((object) => {
        if (object.name === nameOrRowId) {
          object.active = visible
        }
      })
    } else {
      const rowObjects = this.scene.objects.filter(
        (object) => object instanceof SceneRowObject
      ) as Array<SceneRowObject>
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
