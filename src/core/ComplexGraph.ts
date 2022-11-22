import { Scene } from './Scene'
import { Renderer } from './Renderer'
import { CanvasParameters } from '../tools/Canvas'
import { cursorPosition } from '../utils/coordinates'
import { clamp } from '../utils/math'
import { Timeline, TimelineMonthsData } from './Timeline'
import { Rows } from './Rows'
import { Calculator } from './Calculator'
import { Object } from './Object'
import { Visualizer } from './Visualizer'
import { Plugin } from '../plugins/Plugin'

export interface Parameters {
  wrapper: CanvasParameters['container']
  months: TimelineMonthsData
  zoomMouseButton?: number
  wheelZoomAcceleration?: number
  wheelTranlationSpeed?: number
  smoothness?: number
  maxZoom?: number
  fontSize?: number
  font?: string
}

export class ComplexGraph {
  public readonly wrapper: HTMLElement
  public readonly container: HTMLElement
  public readonly scene: Scene
  public readonly renderer: Renderer

  public readonly calculator: Calculator
  public readonly timeline: Timeline
  public readonly rows: Rows

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
    `
    this.wrapper.appendChild(this.container)

    this.scene = new Scene({
      smoothness: parameters.smoothness,
      maxZoom: parameters.maxZoom,
    })

    this.renderer = new Renderer({
      container: this.container,
      scene: this.scene,
      clearColor: 'white',
    })

    this.timeline = new Timeline(parameters.months)
    this.rows = new Rows()
    this.calculator = new Calculator()
    this.calculator.complexGraph = this

    this.zoomMouseButton = parameters.zoomMouseButton || 0
    this.wheelZoomAcceleration = parameters.wheelZoomAcceleration || 1
    this.wheelTranlationSpeed = parameters.wheelTranlationSpeed || 1
    this.fontSize = parameters.maxZoom || 0.02
    this.font = parameters.font || 'sans-serif'

    this.statuses = {
      scaleButtonPressed: false,
      fullView: false,
    }

    this.plugins = new Set()

    this.scene.addObject(this.calculator)

    this.container.addEventListener('wheel', this.handleWheel)
    this.container.addEventListener('pointerdown', this.handlePointerDown)
    this.container.addEventListener('pointerup', this.handleMouseUp)
    this.container.addEventListener('contextmenu', this.handleContextMenu)
  }

  public destroy() {
    this.container.removeEventListener('wheel', this.handleWheel)
    this.container.removeEventListener('pointerdown', this.handlePointerDown)
    this.container.removeEventListener('pointerup', this.handleMouseUp)
    this.container.removeEventListener('contextmenu', this.handleContextMenu)

    this.renderer.destroy()
    this.plugins.forEach((p) => p.onDestroy?.())

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
      this.scale(event)
    } else {
      this.translate(event)
    }
  }

  private handlePointerDown = (event: PointerEvent) => {
    if (event.button === this.zoomMouseButton) {
      event.preventDefault()
      this.statuses.scaleButtonPressed = true
    }
  }

  private handleMouseUp = (event: PointerEvent) => {
    if (event.button === this.zoomMouseButton) {
      event.preventDefault()
      this.statuses.scaleButtonPressed = false
    }
  }

  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
  }

  private scale = (event: WheelEvent) => {
    const mousePosition = cursorPosition(event, this.container, {
      x: this.calculator.area.x1,
      y: 0,
    }).x
    const zoomSpeed =
      clamp(event.deltaY, -1, 1) * this.scene.zoom * this.wheelZoomAcceleration * 0.2
    this.renderer.withTicker(() => {
      this.scene.scale(mousePosition, zoomSpeed)
    })
  }

  private translate = (event: WheelEvent) => {
    this.renderer.withTicker(() => {
      this.scene.translate(event.deltaY * this.wheelTranlationSpeed)
    })
  }
}
