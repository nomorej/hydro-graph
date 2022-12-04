import { Track } from '../tools/Track'
import { clamp } from '../utils/math'
import { Renderer } from './Renderer'
import { Object } from './Object'

export interface SceneParameters {
  maxZoom?: number
  sizeProgress?: number
  positionProgress?: number
  zoom?: number
}

export class Scene {
  public renderer: Renderer

  public zoom: number
  public maxZoom: number

  public size: Track
  public position: Track
  public readonly objects: Set<Object>

  private _viewportSize: number

  constructor(parameters?: SceneParameters) {
    this.renderer = null!

    this.zoom = parameters?.zoom || 1
    this.maxZoom = parameters?.maxZoom || 300

    this.size = new Track({ slipperiness: 5 })
    this.position = new Track({ slipperiness: 5 })

    if (parameters?.sizeProgress) {
      this.size.calibrateProgress(parameters.sizeProgress)
    }

    if (parameters?.positionProgress) {
      this.position.calibrateProgress(parameters.positionProgress)
    }

    this.objects = new Set()

    this._viewportSize = 0
  }

  public get viewportSize() {
    return this._viewportSize
  }

  public set viewportSize(value: number) {
    this._viewportSize = value
    this.scaleStep()
    this.calibratePointer()
    this.scaleStep()
  }

  public scaleStep(pivot = 0, value = 0) {
    this.scaleSet(pivot, this.zoom + value)
  }

  public scaleSet(pivot = 0, value = 0) {
    const zoom = this.zoom
    this.zoom = clamp(value, 1, this.maxZoom)
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

  public calibratePointer() {
    this.size.calibratePointer()
    this.position.calibratePointer()
  }

  public resize() {
    const positionProgress = this.position.progress.target || 0
    const sizeProgress = this.size.progress.target || 0

    this.viewportSize = this.renderer.size.x

    this.objects.forEach((object) => {
      if (object.isActive) {
        object.onResize?.()
      }
    })

    this.position.calibrateProgress(positionProgress)
    this.size.calibrateProgress(sizeProgress)
  }

  public render(_: number, dt: number) {
    this.size.slide(dt)
    this.position.slide(dt)

    if (this.position.isIdle() && this.size.isIdle()) {
      this.renderer.stopTick()
    }

    this.renderer.context.save()
    this.renderer.context.translate(this.position.pointer.current * -1, 0)

    this.objects.forEach((object) => {
      if (object.isActive) {
        object.onRender?.()
      }
    })

    this.renderer.context.restore()
  }

  public addObject(object: Object) {
    if (!this.objects.has(object)) {
      this.objects.add(object)
    }
  }

  public removeObject(object: Object) {
    if (this.objects.has(object)) {
      this.objects.delete(object)
      object.onDestroy?.()
    }
  }
}
