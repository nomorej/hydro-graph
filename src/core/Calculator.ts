import { Object } from './Object'
import { Primitive } from './Primitive'
import { Renderer } from './Renderer'
import { TimelineSegment } from './Timeline'

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

  public onRender() {
    const { renderer, scene, timeline } = this.complexGraph

    renderer.context.lineJoin = 'round'

    const offsetX = renderer.minSize * 0.15
    const offsetY = renderer.minSize * 0.03

    this.clipArea.x1 = offsetX + scene.position.pointer.current
    this.clipArea.x2 = renderer.size.x - offsetX + scene.position.pointer.current
    this.clipArea.y1 = offsetY
    this.clipArea.y2 = renderer.size.y - offsetY * 3

    this.area.x1 = offsetX
    this.area.x2 = scene.size.pointer.current - offsetX
    this.area.y1 = this.clipArea.y1
    this.area.y2 = this.clipArea.y2 * 0.95

    this.fontSize = this.complexGraph.fontSize * renderer.minSize

    const ppp = timeline.months.length / 4

    this.isDaysZoom = scene.zoom > ppp
    this.isDaysFullZoom = scene.zoom > ppp * 2.5
    this.isHoursZoom = scene.zoom > ppp * 12.5
    this.isHoursFullZoom = scene.zoom > ppp * 35

    this.complexGraph.timeline.resize(this.area.width)
    this.complexGraph.rows.resize(
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

  public isSegmentVisible(segment: TimelineSegment, segment2?: TimelineSegment) {
    const { scene } = this.complexGraph
    return !(
      scene.position.pointer.current > (segment2 || segment).x2 + this.area.x1 ||
      scene.position.pointer.current + this.clipArea.width < segment.x1 - this.area.x1
    )
  }

  public isPointVisible(point: { x: number; width: number }, offsetLeft = 0, offsetRight = 0) {
    const { scene } = this.complexGraph
    return !(
      scene.position.pointer.current > point.x + point.width - this.area.x1 + offsetLeft ||
      scene.position.pointer.current + this.clipArea.width < point.x - this.area.x1 - offsetRight
    )
  }
}
