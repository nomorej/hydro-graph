import { XY } from './UtilsTS'

export type CanvasDrawFunction = (canvasState: Canvas, ...args: any[]) => void

export interface CanvasParameters {
  container: HTMLElement
}

export class Canvas {
  public readonly containerElement: HTMLElement
  public readonly canvasElement: HTMLCanvasElement
  public readonly context: CanvasRenderingContext2D
  public readonly size: XY

  private _drawFunction?: CanvasDrawFunction | undefined
  private pixelRatio: number
  private resizeObserver: ResizeObserver

  constructor(parameters: CanvasParameters) {
    this.containerElement = parameters.container
    this.canvasElement = document.createElement('canvas')

    const context = this.canvasElement.getContext('2d')

    if (!context) {
      throw new Error('Error getting context')
    }

    this.containerElement.appendChild(this.canvasElement)

    this.context = context

    this.size = { x: 0, y: 0 }
    this.pixelRatio = 1

    this.resizeObserver = new ResizeObserver(this.handleResize)
  }

  public set drawFunction(drawFunction: CanvasDrawFunction) {
    this.resizeObserver.unobserve(this.containerElement)
    this._drawFunction = drawFunction
    this.resizeObserver.observe(this.containerElement)
  }

  public destroy() {
    this.containerElement.removeChild(this.canvasElement)
    this.resizeObserver.disconnect()
  }

  public draw = (...args: any[]) => {
    this._drawFunction?.(this, ...args)
  }

  public clear() {
    this.context.clearRect(0, 0, this.size.x, this.size.y)
  }

  protected resize(entry: ResizeObserverEntry) {
    this.pixelRatio = Math.min(devicePixelRatio, 2)
    this.size.x = entry.contentRect.width
    this.size.y = entry.contentRect.height
    this.canvasElement.width = this.size.x * this.pixelRatio
    this.canvasElement.height = this.size.y * this.pixelRatio
  }

  private handleResize = (entries: Array<ResizeObserverEntry>) => {
    this.clear()

    entries[0] && this.resize(entries[0])

    this.draw()
  }
}
