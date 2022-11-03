export default abstract class UtilsShapes {
  public static yScale(
    context: CanvasRenderingContext2D,
    {
      thickness = 1,
      height = 100,
      x = 0,
      y = 0,
      dashSize = 20,
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
      marks?: Array<number | string>
      font?: string
      fontSize?: number
      textAlign?: 'left' | 'right'
      textColor?: string
      lineColor?: string
    }
  ) {
    context.save()

    context.beginPath()
    context.lineWidth = thickness
    context.strokeStyle = lineColor
    context.moveTo(x, y)
    context.lineTo(x, y - height)
    context.stroke()

    context.font = `${fontSize}px ${font}`

    const textMarkX = textAlign === 'left' ? x - dashSize : x + dashSize
    const markStep = height / marks.length

    marks.forEach((mark, i) => {
      const markY = y - markStep * i

      context.strokeStyle = textColor
      context.fillText(mark.toString(), textMarkX, markY)

      context.beginPath()
      context.lineWidth = thickness
      context.strokeStyle = lineColor
      context.moveTo(x - dashSize, markY)
      context.lineTo(x + dashSize, markY)
      context.stroke()
    })

    context.restore()
  }
}
