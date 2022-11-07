import { CGGlobals } from '../core/ComplexGraph'
import { SceneCallbackData, SceneRenderData } from '../core/Scene'
import { SceneObject } from '../core/SceneObject'
import { Primitive } from '../tools/Primitive'
import { Segmentator } from '../tools/Segmentator'

export class Calculator extends SceneObject {
  private segmentator: Segmentator<number>

  constructor() {
    super('calculator')
    this.segmentator = new Segmentator({ scale: 1 })
  }

  public override create() {
    {
      let airTemperatureMin = 0
      let airTemperatureMax = 0
      Object.entries(CGGlobals.data.airTemperature.graphs).forEach(([_, graph]) => {
        let typeMin = 0
        let typeMax = 0

        graph.data.forEach((v) => {
          if (v < typeMin) {
            typeMin = v
          }
          if (v > typeMax) {
            typeMax = v
          }
        })

        airTemperatureMin = typeMin < airTemperatureMin ? typeMin : airTemperatureMin
        airTemperatureMax = typeMax > airTemperatureMax ? typeMax : airTemperatureMax
      })

      airTemperatureMin = Math.floor(airTemperatureMin / 10) * 10
      airTemperatureMax = Math.ceil(airTemperatureMax / 10) * 10
      const airTemperatureDelta = airTemperatureMax - airTemperatureMin
      const airTemperatureSegments = []

      for (let i = 0; i <= airTemperatureDelta / 10; i++) {
        airTemperatureSegments[i] = airTemperatureMin + i * 10
      }

      airTemperatureSegments.forEach((t, i) => {
        const isEven = (t / 10) % 2 === 0
        CGGlobals.calculations.scales.airTemperature[i] = {
          position: 0,
          data: isEven ? t : '',
          isBase: isEven ? true : false,
        }
      })

      CGGlobals.calculations.airTemperatureMin = airTemperatureMin
      CGGlobals.calculations.airTemperatureMax = airTemperatureMax
    }
  }

  public override resize({ renderer }: SceneCallbackData) {
    const c = CGGlobals.calculations
    const s = CGGlobals.sizes

    const rows = Object.entries(CGGlobals.rowsVisibility) as Array<[string, boolean]>
    this.segmentator.gap = s.rowsGap
    rows.forEach((row) => {
      let factor = 0
      if (row[1]) {
        factor = s.rowsFactors[+row[0]]
      }
      this.segmentator.cut(+row[0], factor)
    })

    c.fontSize = s.font * renderer.minSize

    c.workspace.x1 = renderer.minSize * s.paddingX
    c.workspace.x2 = renderer.size.x - c.workspace.x1
    c.workspace.y1 = renderer.minSize * s.paddingY
    c.workspace.y2 = renderer.size.y - c.workspace.y1

    c.scaleOffset = s.scaleOffset * renderer.minSize
    c.scaleThickness = s.scaleThickness * renderer.minSize
  }

  public render({ renderer, scene }: SceneRenderData) {
    const c = CGGlobals.calculations
    const s = CGGlobals.sizes

    const sceneSize = scene.size.pointer.current - c.workspace.x1

    const timelineHeight = s.timelineHeight * renderer.minSize
    const timelineOffsetY = s.timelineOffsetY * renderer.minSize

    c.timeline.primitive.x1 = c.workspace.x1
    c.timeline.primitive.x2 = sceneSize
    c.timeline.primitive.y1 = c.workspace.y2 - timelineOffsetY - timelineHeight / 2
    c.timeline.primitive.y2 = c.workspace.y2 - timelineOffsetY + timelineHeight / 2

    const contentWrapperPaddingX = renderer.minSize * s.contentPaddingX
    const contentWrapperLeft = c.workspace.x1 + contentWrapperPaddingX
    const contentWrapperRight = c.workspace.x2 - contentWrapperPaddingX

    c.contentWrapper.x1 = contentWrapperLeft + scene.position.pointer.current
    c.contentWrapper.x2 = contentWrapperRight + scene.position.pointer.current
    c.contentWrapper.y1 = c.workspace.y1
    c.contentWrapper.y2 = c.timeline.primitive.y2 * 0.95

    c.content.x1 = contentWrapperLeft
    c.content.x2 = scene.size.pointer.current - contentWrapperLeft
    c.content.y1 = c.contentWrapper.y1
    c.content.y2 = c.contentWrapper.y2

    if (CGGlobals.data.months) {
      const length = CGGlobals.data.months.length - 1
      const monthWidth = (c.timeline.primitive.width - contentWrapperPaddingX * 2) / (length + 2)

      CGGlobals.data.months.forEach((data, i) => {
        const x1 = monthWidth + contentWrapperLeft + monthWidth * i
        const x2 = x1 + monthWidth
        const y1 = c.workspace.y1
        const y2 = c.timeline.primitive.middleY

        const month = {
          primitive: new Primitive(x1, x2, y1, y2),
          data,
        }

        c.timeline.months[i] = month
      })
    }

    this.segmentator.segments.forEach((s) => {
      c.rowsPrimitives[s.id].x1 = c.content.x1
      c.rowsPrimitives[s.id].x2 = c.content.x2
      c.rowsPrimitives[s.id].y1 = c.content.y1 + c.content.height * s.a
      c.rowsPrimitives[s.id].y2 = c.content.y1 + c.content.height * s.b
    })

    c.scales.airTemperature.forEach((s, i, arr) => {
      s.position =
        c.rowsPrimitives[0].y1 +
        c.rowsPrimitives[0].height -
        (c.rowsPrimitives[0].height / arr.length) * i
    })
  }
}
