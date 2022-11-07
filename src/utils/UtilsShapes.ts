import { ComplexGraphGlobals } from '../core/ComplexGraph'

export default abstract class UtilsShapes {
  public static yScale(
    context: CanvasRenderingContext2D,
    {
      calculations: c,
      font,
      colors,
      row,
      align,
      name,
    }: {
      calculations: ComplexGraphGlobals['calculations']
      font: ComplexGraphGlobals['font']
      data: ComplexGraphGlobals['data']
      colors: ComplexGraphGlobals['colors']
      row: number
      align: 'left' | 'right'
      name: string
    }
  ) {
    const x = c.contentWrapper.x1 - c.scaleOffset
    const y = c.rowsPrimitives[row].y1
    const height = c.rowsPrimitives[row].height
    const segments = c.scales.airTemperature
    const fontSize = c.fontSize
    const lineColor = colors.airTemperature.scale
    const thickness = c.scaleThickness

    context.beginPath()
    context.lineWidth = thickness
    context.strokeStyle = lineColor
    context.moveTo(x, y + height)
    context.lineTo(x, y)
    context.stroke()

    context.font = `${fontSize}px ${font}`
    context.textAlign = align === 'left' ? 'right' : 'left'
    context.textBaseline = 'middle'

    const dashSize = thickness * 3.5
    const pointerSize = dashSize * 1.5
    const textMarkX = align === 'left' ? x - dashSize * 1.5 : x + dashSize * 1.5

    segments.forEach((s) => {
      context.strokeStyle = colors.default
      context.fillText(s.data.toString(), textMarkX, s.position)

      context.beginPath()
      context.lineWidth = thickness
      context.strokeStyle = lineColor
      const ds = s.data ? dashSize : dashSize / 2
      context.moveTo(x - ds, s.position)
      context.lineTo(x + ds, s.position)
      context.stroke()
    })

    context.beginPath()
    context.lineWidth = thickness
    context.strokeStyle = lineColor
    context.moveTo(x - pointerSize / 2, y + pointerSize)
    context.lineTo(x, y)
    context.lineTo(x + pointerSize / 2, y + pointerSize)
    context.stroke()

    context.save()
    context.font = `${fontSize}px ${font}`
    context.textBaseline = 'top'
    context.textAlign = 'center'
    context.fillStyle = colors.default
    context.rotate(-Math.PI / 2)
    context.translate(
      c.rowsPrimitives[row].y1 * -1 + (c.rowsPrimitives[row].height / 2) * -1,
      c.contentWrapper.x1 - c.content.x1 + c.workspace.x1
    )
    context.fillText(name, 0, 0)
    context.restore()
  }
}
