import { Scene, SceneParameters } from './Scene'
import { Renderer } from './Renderer'
import { CanvasParameters } from '../tools/Canvas'
import { cursorPosition, pinchDistance, touchPosition } from '../utils/coordinates'
import { clamp } from '../utils/math'
import { Timeline, TimelineParameters } from './Timeline'
import { Rows } from './Rows'
import { Calculator } from './Calculator'
import { Object } from './Object'
import { Visualizer } from './Visualizer'
import { Plugin } from '../plugins/Plugin'
import { XY } from '../utils/ts'
import { Events } from '../tools/Events'

export interface Parameters extends SceneParameters {
  wrapper: CanvasParameters['container']
  timeline: TimelineParameters
  zoomMouseButton?: number
  wheelZoomAcceleration?: number
  wheelTranlationSpeed?: number
  fontSize?: number
  font?: string
}

export class ComplexGraph {
  public readonly wrapper: HTMLElement
  public readonly container: HTMLElement
  public readonly timeline: Timeline
  public readonly scene: Scene
  public readonly renderer: Renderer

  public readonly calculator: Calculator
  public readonly rows: Rows
  public readonly events: Events<{
    pointermove(mouse: XY, mouseZoomed: XY, event: MouseEvent): void
    pointerleave(event: MouseEvent): void
    resize(scalar: number): void
  }>
  public readonly mouse: XY
  public readonly mouseZoomed: XY

  public zoomMouseButton: number
  public wheelZoomAcceleration: number
  public wheelTranlationSpeed: number
  public fontSize: number
  public font: string

  private readonly statuses: {
    scaleButtonPressed: boolean
    fullView: boolean
  }

  private readonly plugins: Set<Plugin>

  private readonly resizeObserver: ResizeObserver

  constructor(parameters: Parameters) {
    this.wrapper = parameters.wrapper

    this.container = document.createElement('div')
    this.container.style.cssText = `
      position: relative;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      touch-action: none;
    `
    this.wrapper.appendChild(this.container)

    this.timeline = new Timeline(parameters.timeline)

    const maxZoom = (parameters.maxZoom || 5) * this.timeline.segments.length * 0.01

    this.scene = new Scene({
      smoothness: parameters.smoothness,
      maxZoom: maxZoom,
      zoom: parameters.zoom,
      positionProgress: parameters.positionProgress,
      sizeProgress: parameters.sizeProgress,
    })

    this.renderer = new Renderer({
      container: this.container,
      scene: this.scene,
      clearColor: 'white',
    })

    this.rows = new Rows()
    this.calculator = new Calculator()
    this.calculator.complexGraph = this

    this.events = new Events()
    this.mouse = { x: 0, y: 0 }
    this.mouseZoomed = { x: 0, y: 0 }

    this.zoomMouseButton = parameters.zoomMouseButton || 0
    this.wheelZoomAcceleration = parameters.wheelZoomAcceleration || 1
    this.wheelTranlationSpeed = parameters.wheelTranlationSpeed || 1
    this.fontSize = parameters.fontSize || 0.02
    this.font = parameters.font || 'sans-serif'

    this.statuses = {
      scaleButtonPressed: false,
      fullView: false,
    }

    this.plugins = new Set()

    this.scene.addObject(this.calculator)

    this.container.addEventListener('wheel', this.handleWheel)
    this.container.addEventListener('touchstart', this.handleTouch)
    this.container.addEventListener('pointerdown', this.handlePointerDown)
    this.container.addEventListener('pointerup', this.handlePointerUp)
    this.container.addEventListener('contextmenu', this.handleContextMenu)
    this.renderer.canvasElement.addEventListener('pointermove', this.handlePointerMove)
    this.renderer.canvasElement.addEventListener('click', this.handlePointerMove)
    this.renderer.canvasElement.addEventListener('pointerleave', this.handlePointerLeave)

    this.resizeObserver = new ResizeObserver(this.resize)
    this.resizeObserver.observe(this.container)
  }

  public destroy() {
    this.container.removeEventListener('wheel', this.handleWheel)
    this.container.removeEventListener('touchstart', this.handleTouch)
    this.container.removeEventListener('pointerdown', this.handlePointerDown)
    this.container.removeEventListener('pointerup', this.handlePointerUp)
    this.container.removeEventListener('contextmenu', this.handleContextMenu)
    this.renderer.canvasElement.removeEventListener('pointermove', this.handlePointerMove)
    this.renderer.canvasElement.removeEventListener('click', this.handlePointerMove)
    this.renderer.canvasElement.removeEventListener('pointerleave', this.handlePointerLeave)

    this.renderer.destroy()
    this.plugins.forEach((p) => p.onDestroy?.())

    this.resizeObserver.disconnect()
    this.wrapper.removeChild(this.container)
  }

  public hide(dr: Visualizer<any, any>) {
    dr.isActive = false
    this.rows.removeVisualizer(dr)
    this.renderer.redraw()
  }

  public show(dr: Visualizer<any, any>) {
    dr.isActive = true
    this.rows.addVisualizer(dr)
    this.renderer.redraw()
  }

  public add<T extends Object | Plugin>(object: T) {
    if (object instanceof Object) {
      object.complexGraph = this
      if (object instanceof Visualizer) {
        this.rows.addVisualizer(object)
      }
      this.scene.addObject(object)
      this.renderer.redraw()
    } else {
      this.plugins.add(object)
      object.complexGraph = this
      object.onCreate?.()
    }
    return object
  }

  public remove<T extends Object | Plugin>(object: T) {
    if (object instanceof Object) {
      if (object instanceof Visualizer) {
        this.rows.removeVisualizer(object)
      }
      this.scene.removeObject(object)
      this.renderer.redraw()
    } else {
      this.plugins.delete(object)
      object.onDestroy?.()
    }
  }

  public toggleView = () => {
    this.renderer.stopTick()

    if (this.statuses.fullView) {
      this.container.style.position = 'relative'
    } else {
      this.container.style.position = 'fixed'
    }

    this.statuses.fullView = !this.statuses.fullView
  }

  private handleWheel = (event: WheelEvent) => {
    if (this.statuses.scaleButtonPressed) {
      const mousePosition = cursorPosition(event, this.container, {
        x: this.calculator.area.x1,
        y: 0,
      }).x

      const zoomSpeed =
        clamp(event.deltaY, -1, 1) * this.scene.zoom * this.wheelZoomAcceleration * 0.2
      this.renderer.withTicker(() => {
        this.scene.scaleStep(mousePosition, zoomSpeed)
      })
    } else {
      this.renderer.withTicker(() => {
        this.scene.translate(event.deltaY * this.wheelTranlationSpeed)
      })
    }
  }

  private handleTouch = (startEvent: TouchEvent) => {
    const handleMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length === 2) {
        const movePinchDistance = pinchDistance(moveEvent)
        const pinchDelta = movePinchDistance - startPinchDistance
        const minimizer = 100
        const acceleration = this.scene.zoom * 0.2
        const zoom = lastZoom + (pinchDelta / minimizer) * acceleration

        this.renderer.withTicker(() => {
          this.scene.scaleSet(pivot, zoom)
        })
      } else {
        const delta =
          lastPosition + (startEvent.touches[0].clientX - moveEvent.touches[0].clientX) * 2

        if (Math.abs(delta) > 100) {
          this.renderer.withTicker(() => {
            this.scene.setTranslate(delta)
          })
        }
      }
    }

    const handleEnd = () => {
      removeEventListener('touchmove', handleMove)
      removeEventListener('touchend', handleEnd)
    }

    let startPinchDistance = 0

    const lastPosition = this.scene.position.pointer.current
    const lastZoom = this.scene.zoom

    let pivot = 0

    if (startEvent.touches.length === 2) {
      startPinchDistance = pinchDistance(startEvent)
      pivot = touchPosition(startEvent, this.container, {
        x: this.calculator.area.x1,
        y: 0,
      }).x
    } else {
      pivot = touchPosition(startEvent, this.container, {
        x: this.calculator.area.x1,
        y: 0,
      }).x
    }

    addEventListener('touchmove', handleMove)
    addEventListener('touchend', handleEnd)
  }

  private handlePointerDown = (event: PointerEvent) => {
    if (event.button === this.zoomMouseButton) {
      event.preventDefault()
      this.statuses.scaleButtonPressed = true
    }
  }

  private handlePointerUp = (event: PointerEvent) => {
    if (event.button === this.zoomMouseButton) {
      event.preventDefault()
      this.statuses.scaleButtonPressed = false
    }
  }

  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
  }

  private handlePointerMove = (event: MouseEvent) => {
    const c = cursorPosition(event, this.container)
    this.mouse.x = c.x
    this.mouse.y = c.y

    this.mouseZoomed.x = c.x + this.calculator.clipArea.x1 - this.calculator.area.x1
    this.mouseZoomed.y = c.y

    this.events.notify('pointermove', this.mouse, this.mouseZoomed, event)
  }

  private handlePointerLeave = (event: MouseEvent) => {
    this.events.notify('pointerleave', event)
  }

  private resize = () => {
    const scalar = this.renderer.size.x * 0.001
    this.container.style.setProperty('--cg-scalar', scalar + 'px')
    this.events.notify('resize', scalar)
  }
}
