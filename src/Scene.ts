import { AppSettings } from './App'
import { Renderer } from './Renderer'
import { Track } from './Track'
import { UtilsMath } from './UtilsMath'

export interface SceneParameters extends Partial<Pick<AppSettings, 'smoothness' | 'maxZoom'>> {}

export interface SceneCallbackData {
  renderer: Renderer
  scene: Scene
}

export interface SceneRenderData extends SceneCallbackData {
  t: number
  dt: number
}

export abstract class SceneObject {
  constructor() {}

  public abstract render(data: SceneRenderData): void
  public resize?(data: SceneCallbackData): void
  public create?(scene: Scene): void
  public destroy?(scene: Scene): void
}

export class Scene {
  private _viewportSize: number
  public zoom: number

  public readonly maxZoom: number
  public readonly size: Track
  public readonly position: Track

  public objects: Set<SceneObject>

  constructor({ maxZoom = 1, smoothness = 0 }: SceneParameters = {}) {
    this._viewportSize = 0
    this.zoom = 1

    this.maxZoom = maxZoom
    this.size = new Track({ slipperiness: smoothness || 0, start: 0 })
    this.position = new Track({ slipperiness: smoothness || 0, start: 0 })

    this.objects = new Set()
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
    this.zoom = UtilsMath.clamp(this.zoom + value, 1, this.maxZoom)

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
    this.objects.forEach((object) => object.resize?.({ renderer, scene: this }))
  }

  public render(renderer: Renderer, t: number, dt: number) {
    this.size.slide(dt)
    this.position.slide(dt)

    renderer.context.save()
    renderer.context.translate(this.position.pointer.current * -1, 0)

    this.objects.forEach((object) => object.render({ renderer, scene: this, t, dt }))

    renderer.context.restore()
  }

  public addObject(object: SceneObject) {
    this.objects.add(object)
    object.create?.(this)
  }

  public removeObject(object: SceneObject) {
    this.objects.delete(object)
    object.destroy?.(this)
  }
}
