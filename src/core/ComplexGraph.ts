import { Extension } from './Extension'
import { Scene, SceneParameters } from './Scene'
import { Renderer } from './Renderer'
import { CanvasParameters } from '../tools/Canvas'
import { Timeline, TimelineParameters } from './Timeline'
import { Rows } from './Rows'
import { Calculator } from './Calculator'
import { Visualizer } from '../visualizer'
import { Pointer } from '../tools/Pointer'

export interface Parameters extends SceneParameters {
  wrapper: CanvasParameters['container']
  timeline: TimelineParameters
  fontSize?: number
  font?: string
}

export const complexGraphPointer = new Pointer<ComplexGraph>()

export class ComplexGraph {
  public readonly extensions: Set<Extension>

  public readonly wrapper: HTMLElement
  public readonly container: HTMLElement

  public readonly timeline: Timeline
  public readonly scene: Scene
  public readonly renderer: Renderer

  public readonly rows: Rows
  public readonly calculator: Calculator

  public readonly fontSize: number
  public readonly font: string

  constructor(parameters: Parameters) {
    complexGraphPointer.target = this

    this.extensions = new Set()

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

    this.scene = new Scene({
      maxZoom: (parameters.maxZoom || 5) * this.timeline.segments.length * 0.01,
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

    this.fontSize = parameters.fontSize || 0.02
    this.font = parameters.font || 'sans-serif'

    this.scene.addObject(this.calculator)
  }

  public destroy() {
    complexGraphPointer.remove(this)

    this.renderer.destroy()
    this.extensions.forEach((p) => p.destroy?.())

    this.wrapper.removeChild(this.container)
  }

  public hide(dr: Visualizer) {
    dr.isActive = false
    this.rows.removeVisualizer(dr)
    this.renderer.redraw()
  }

  public show(dr: Visualizer) {
    dr.isActive = true
    this.rows.addVisualizer(dr)
    this.renderer.redraw()
  }
}
