import { ComplexGraph } from './ComplexGraph'
import { Object } from './Object'
import { Primitive } from './Primitive'
import { Renderer } from './Renderer'
import { Scene, SceneRenderData } from './Scene'
import { TimelineMonth } from './Timeline'

export class Calculator extends Object {
  public readonly clipArea: Primitive
  public readonly area: Primitive
  public fontSize: number
  public isDaysZoom: boolean
  public isDaysFullZoom: boolean
  public isHoursZoom: boolean
  public isHoursFullZoom: boolean

  constructor() {
    super()
    this.clipArea = new Primitive()
    this.area = new Primitive()

    this.fontSize = 0
    this.isDaysZoom = false
    this.isDaysFullZoom = false
    this.isHoursZoom = false
    this.isHoursFullZoom = false
  }

  public render({ scene, renderer }: SceneRenderData): void {
    const offsetX = renderer.minSize * 0.15
    const offsetY = renderer.minSize * 0.02

    this.clipArea.x1 = offsetX + scene.position.pointer.current
    this.clipArea.x2 = renderer.size.x - offsetX + scene.position.pointer.current
    this.clipArea.y1 = offsetY
    this.clipArea.y2 = renderer.size.y - offsetY * 4

    this.area.x1 = offsetX
    this.area.x2 = scene.size.pointer.current - offsetX
    this.area.y1 = this.clipArea.y1
    this.area.y2 = this.clipArea.y2 * 0.95

    this.fontSize = ComplexGraph.globals.sizes.font * renderer.minSize

    this.isDaysZoom = scene.zoom > 4
    this.isDaysFullZoom = scene.zoom > 10
    this.isHoursZoom = scene.zoom > 50
    this.isHoursFullZoom = scene.zoom > 150

    ComplexGraph.globals.timeline.resize(this.area.width)
    ComplexGraph.globals.rows.resize(
      this.clipArea.x1,
      this.clipArea.x2,
      this.clipArea.y1,
      this.area.height
    )
  }

  public clip(renderer: Renderer, callback: () => void) {
    renderer.context.save()

    renderer.context.beginPath()
    renderer.context.rect(
      this.clipArea.x1,
      this.clipArea.y1,
      this.clipArea.width,
      this.clipArea.height
    )

    renderer.context.clip()

    renderer.context.closePath()

    callback()

    renderer.context.restore()
  }

  public isVisible(scene: Scene, month: TimelineMonth) {
    return !(
      scene.position.pointer.current > month.x2 + this.area.x1 ||
      scene.position.pointer.current + this.clipArea.width < month.x1 - this.area.x1
    )
  }
}
