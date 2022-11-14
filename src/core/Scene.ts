import { Track } from '../tools/Track'
import { clamp } from '../utils/math'
import { Renderer } from './Renderer'
import { Object } from './Object'

export interface SceneParameters {
  smoothness?: number
  maxZoom?: number
}

export class Scene {
  public renderer: Renderer

  public zoom: number
  public maxZoom: number

  public readonly size: Track
  public readonly position: Track

  private objects: Array<Object>
  private _smoothness: number
  private _viewportSize: number

  constructor(parameters?: SceneParameters) {
    this.renderer = null!

    this.zoom = 1
    this.maxZoom = parameters?.maxZoom || 300

    this.size = new Track()
    this.position = new Track()

    this.objects = []

    this._smoothness =
      this.size.slipperiness =
      this.position.slipperiness =
        parameters?.smoothness || 0
    this._viewportSize = 0
  }

  public set smoothness(value: number) {
    this._smoothness = this.size.slipperiness = this.position.slipperiness = value
  }

  public get smoothness() {
    return this._smoothness
  }

  public get viewportSize() {
    return this._viewportSize
  }

  public set viewportSize(value: number) {
    this._viewportSize = value
    this.scale()
    this.calibrate()
    this.scale()
  }

  public scale(pivot = 0, value = 0) {
    const zoom = this.zoom
    this.zoom = clamp(this.zoom + value, 1, this.maxZoom)
    this.size.setPointer(this.viewportSize * this.zoom)
    this.size.start = this.viewportSize
    this.size.distance = this.viewportSize * this.maxZoom
    this.position.distance = this.size.pointer.target - this.viewportSize
    this.position.setPointer(((pivot + this.position.pointer.target) * this.zoom) / zoom - pivot)
  }

  public setTranslate(value = 0) {
    this.position.setPointer(value)
  }

  public translate(value = 0) {
    this.position.step(value)
  }

  public calibrate() {
    this.size.calibratePointer()
    this.position.calibratePointer()
  }

  public resize(renderer: Renderer) {
    this.viewportSize = renderer.size.x
    this.objects.forEach((object) => {
      if (object.isActive) {
        object.onResize?.()
      }
    })
  }

  public render(renderer: Renderer, _: number, dt: number) {
    this.size.slide(dt)
    this.position.slide(dt)

    renderer.context.save()
    renderer.context.translate(this.position.pointer.current * -1, 0)

    this.objects.forEach((object) => {
      if (object.isActive) {
        object.onRender?.()
      }
    })

    renderer.context.restore()
  }

  public addObject(object: Object) {
    if (!this.objects.includes(object)) {
      this.objects.push(object)
      object.onCreate?.()
    }
  }

  public removeObject(object: Object) {
    if (this.objects.includes(object)) {
      this.objects = this.objects.filter((o) => o !== object)
      object.onDestroy?.()
    }
  }
}
