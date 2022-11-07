export default abstract class UtilsShapes {
  public static yScale(
    context: CanvasRenderingContext2D,
    {
      thickness = 1,
      height = 100,
      x = 0,
      y = 0,
      segments = [],
      font = 'sans-serif',
      fontSize = 10,
      textAlign = 'left',
      textColor = 'black',
      lineColor = 'black',
    }: {
      thickness?: number
      height?: number
      x?: number
      y?: number
      segments?: Array<{ position: number; data: number | string }>
      font?: string
      fontSize?: number
      textAlign?: 'left' | 'right'
      textColor?: string
      lineColor?: string
    }
  ) {
    context.beginPath()
    context.lineWidth = thickness
    context.strokeStyle = lineColor
    context.moveTo(x, y + height)
    context.lineTo(x, y)
    context.stroke()

    context.font = `${fontSize}px ${font}`
    context.textAlign = textAlign === 'left' ? 'right' : 'left'
    context.textBaseline = 'middle'

    const dashSize = thickness * 3.5
    const pointerSize = dashSize * 1.5
    const textMarkX = textAlign === 'left' ? x - dashSize * 1.5 : x + dashSize * 1.5

    segments.forEach((s) => {
      context.strokeStyle = textColor
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
  }
}
