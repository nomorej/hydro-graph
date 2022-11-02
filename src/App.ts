import { CanvasParameters } from './Canvas'
import { Scene } from './Scene'
import { Renderer } from './Renderer'
import { UtilsGrid } from './UtilsGrid'
import { UtilsMath } from './UtilsMath'
import Timeline from './Timeline'
import { Scrollbar } from './Scrollbar'
import TestGraph from './TestGraph'
import { XY } from './UtilsTS'
import PreCalc from './PreCalc'

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
    timelineYOffset: number
    timelineAxisThickness: number
    timelineDashSize: number
  }
  font: string
  calculations: {
    timeline: Array<XY>
    paddingX: number
    paddingY: number
    sceneWidthMinusPadding: number
    timelineYOffset: number
    timelineY: number
    timelineDashSize: number
    contentX: number
    contentY: number
    contentWidth: number
    contentHeight: number
  }
}

export interface AppSettings {
  zoomMouseButton: 'left' | 'right'
  wheelZoomSpeed: number
  wheelTranlationSpeed: number
  smoothness: number
  maxZoom: number
}

export interface AppParameters extends Pick<CanvasParameters, 'container'> {
  settings?: Partial<AppSettings>
  globals: AppGlobals
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
    appGlobals = globals

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

    this.renderer.scene.addObject(new PreCalc())
    this.renderer.scene.addObject(new Timeline())
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
    const mousePosition = UtilsGrid.cursorPosition(event, this.container).x
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
