import { CGGlobals, GraphsNames } from '../core/ComplexGraph'

export default abstract class UtilsShapes {
  public static yScale(
    context: CanvasRenderingContext2D,
    {
      row,
      align,
      graphName,
    }: {
      row: number
      align: 'left' | 'right'
      graphName: GraphsNames
    }
  ) {
    const { calculations: c, graphsData: g, colors, font } = CGGlobals

    const scale = g[graphName].scale

    if (!scale) return

    const isLeft = align === 'left'
    const x = isLeft ? c.contentWrapper.x1 - c.scaleOffset : c.contentWrapper.x2 + c.scaleOffset
    const y = c.rowsPrimitives[row].y1
    const height = c.rowsPrimitives[row].height
    const fontSize = c.fontSize
    const lineColor = colors.graphs[graphName].scale
    const thickness = c.scaleThickness
    const dashSize = thickness * 3.5
    const pointerSize = dashSize * 1.5
    const textMarkX = isLeft ? x - dashSize * 1.5 : x + dashSize * 1.5

    context.beginPath()
    context.lineWidth = thickness
    context.strokeStyle = lineColor
    context.moveTo(x, y + height)
    context.lineTo(x, y - pointerSize)
    context.stroke()

    context.font = `${fontSize}px ${font}`
    context.textAlign = isLeft ? 'right' : 'left'
    context.textBaseline = 'middle'

    scale.segments.forEach((s) => {
      if (s.isBase) {
        context.fillStyle = colors.default
        context.fillText(s.value.toString(), textMarkX, s.position)
      }

      context.beginPath()
      context.lineWidth = thickness
      context.strokeStyle = lineColor
      const ds = s.isBase ? dashSize : dashSize / 2
      context.moveTo(x - ds, s.position)
      context.lineTo(x + ds, s.position)
      context.stroke()
    })

    context.beginPath()
    context.lineWidth = thickness
    context.strokeStyle = lineColor
    const pointerY = y - pointerSize
    context.moveTo(x - pointerSize / 2, pointerY + pointerSize)
    context.lineTo(x, pointerY)
    context.lineTo(x + pointerSize / 2, pointerY + pointerSize)
    context.stroke()

    context.save()
    context.font = `${fontSize}px ${font}`
    context.textBaseline = isLeft ? 'top' : 'bottom'
    context.textAlign = 'center'
    context.fillStyle = colors.default
    context.rotate(-Math.PI / 2)
    context.translate(
      c.rowsPrimitives[row].y1 * -1 + (c.rowsPrimitives[row].height / 2) * -1,
      isLeft
        ? c.contentWrapper.x1 - c.content.x1 + c.workspace.x1
        : c.contentWrapper.x2 + c.content.x1 - c.workspace.x1
    )
    scale.title && context.fillText(scale.title, 0, 0)
    context.restore()
  }
}
