import { CanvasParameters } from './Canvas'
import { Scene } from './Scene'
import { Renderer } from './Renderer'
import { UtilsCoordinates } from './UtilsCoordinates'
import { UtilsMath } from './UtilsMath'
import Timeline from './Timeline'
import { Scrollbar } from './Scrollbar'
import Calculator from './Calculator'
import { Primitive } from './Primitive'
import Content from './Content'
import TestGraph from './TestGraph'

export interface AppGlobals {
  data: {
    months: Array<string> | undefined
  }
  colors: {
    timeline: string
    timelineSegment: string
    content: string
  }
  sizes: {
    font: number
    paddingX: number
    paddingY: number
    contentPaddingX: number
    timelineOffsetY: number
    timelineHeight: number
  }
  font: string
  calculations: {
    fontSize: number
    workspace: Primitive
    content: Primitive
    contentWrapper: Primitive
    timeline: {
      primitive: Primitive
      segments: Array<{
        primitive: Primitive
        data: string
      }>
    }
  }
}

export type AppGlobalsConfig = Omit<AppGlobals, 'calculations'>

export interface AppSettings {
  zoomMouseButton: 'left' | 'right'
  wheelZoomSpeed: number
  wheelTranlationSpeed: number
  smoothness: number
  maxZoom: number
}

export interface AppParameters extends Pick<CanvasParameters, 'container'> {
  settings?: Partial<AppSettings>
  globals: AppGlobalsConfig
}

export let appGlobals: AppGlobals = null!

export class App {
  private container: HTMLElement

  private settings: Pick<AppSettings, 'wheelZoomSpeed' | 'wheelTranlationSpeed'> & {
    zoomMouseButton: 0 | 2
  }

  private scene: Scene
  private renderer: Renderer
  private scrollbar: Scrollbar

  private statuses: {
    scaleButtonPressed: boolean
  }

  constructor({ container, settings = {}, globals }: AppParameters) {
    appGlobals = {
      ...globals,
      calculations: {
        fontSize: 0,
        timeline: {
          primitive: new Primitive(),
          segments: [],
        },
        content: new Primitive(),
        contentWrapper: new Primitive(),
        workspace: new Primitive(),
      },
    }

    this.container = container

    this.settings = {
      zoomMouseButton:
        settings.zoomMouseButton === 'left' ? 0 : settings.zoomMouseButton === 'right' ? 2 : 0,
      wheelZoomSpeed: settings.wheelZoomSpeed ?? 1,
      wheelTranlationSpeed: settings.wheelTranlationSpeed ?? 1,
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

    this.renderer.scene.addObject(new Calculator())
    this.renderer.scene.addObject(new Timeline())
    this.renderer.scene.addObject(new Content())
    this.renderer.scene.addObject(new TestGraph())

    this.container.addEventListener('wheel', this.handleWheel)
    this.container.addEventListener('pointerdown', this.handlePointerDown)
    this.container.addEventListener('pointerup', this.handleMouseUp)
    this.container.addEventListener('contextmenu', this.handleContextMenu)
  }

  public destroy(): void {
    this.container.removeEventListener('wheel', this.handleWheel)
    this.container.removeEventListener('pointerdown', this.handlePointerDown)
    this.container.removeEventListener('pointerup', this.handleMouseUp)
    this.container.removeEventListener('contextmenu', this.handleContextMenu)

    this.renderer.destroy()
    this.scrollbar.destroy()

    appGlobals = null!
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
