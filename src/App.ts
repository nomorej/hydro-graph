import { CanvasParameters } from './Canvas'
import { Scene } from './Scene'
import { Renderer } from './Renderer'
import { UtilsGrid } from './UtilsGrid'
import { UtilsMath } from './UtilsMath'
import Timeline from './Timeline'
import { Scrollbar } from './Scrollbar'

export interface AppSettings {
  zoomMouseButton: 'left' | 'right'
  wheelZoomSpeed: number
  wheelTranlationSpeed: number
  smoothness: number
  maxZoom: number
}

export interface AppParameters extends Pick<CanvasParameters, 'container'>, Partial<AppSettings> {}

export class App {
  private container: HTMLElement
  private scene: Scene
  private renderer: Renderer
  private scrollbar: Scrollbar

  private statuses: {
    scaleButtonPressed: boolean
  }

  private settings: Omit<
    AppSettings,
    'scaleSmoothness' | 'smoothness' | 'maxZoom' | 'zoomMouseButton'
  > & { zoomMouseButton: 0 | 2 }

  constructor(parameters: AppParameters) {
    this.container = parameters.container

    this.scene = new Scene({
      maxZoom: parameters.maxZoom,
      smoothness: parameters.smoothness,
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

    this.settings = {
      zoomMouseButton:
        parameters.zoomMouseButton === 'left' ? 0 : parameters.zoomMouseButton === 'right' ? 2 : 0,
      wheelZoomSpeed: parameters.wheelZoomSpeed ?? 1,
      wheelTranlationSpeed: parameters.wheelTranlationSpeed ?? 1,
    }

    this.renderer.scene.addObject(new Timeline())

    this.container.addEventListener('wheel', this.handleWheel)
    this.container.addEventListener('pointerdown', this.handlePointerDown)
    this.container.addEventListener('pointerup', this.handleMouseUp)
    this.container.addEventListener('contextmenu', this.handleContextMenu)
  }

  public destroy(): void {
    this.renderer.destroy()
    this.container.removeEventListener('wheel', this.handleWheel)
    this.container.removeEventListener('pointerdown', this.handlePointerDown)
    this.container.removeEventListener('pointerup', this.handleMouseUp)
    this.container.removeEventListener('contextmenu', this.handleContextMenu)
    this.scrollbar.destroy()
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
