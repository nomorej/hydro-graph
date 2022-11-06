export default abstract class UtilsShapes {
  public static yScale(
    context: CanvasRenderingContext2D,
    {
      thickness = 1,
      height = 100,
      x = 0,
      y = 0,
      dashSize = 20,
      pointerSize = 20,
      marks = [],
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
      dashSize?: number
      pointerSize?: number
      marks?: Array<number | string>
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

    const textMarkX = textAlign === 'left' ? x - dashSize * 1.5 : x + dashSize * 1.5
    const markStep = height / marks.length

    marks.forEach((mark, i) => {
      const markY = y + height - markStep * i

      context.strokeStyle = textColor
      context.fillText(mark.toString(), textMarkX, markY)

      context.beginPath()
      context.lineWidth = thickness
      context.strokeStyle = lineColor
      context.moveTo(x - dashSize, markY)
      context.lineTo(x + dashSize, markY)
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
