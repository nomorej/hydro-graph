import { Canvas, CanvasParameters } from './Canvas'
import { Scene } from './Scene'
import { Ticker } from './Ticker'

export interface RendererParameters extends CanvasParameters {
  scene: Scene
}

export class Renderer extends Canvas {
  public scene: Scene

  constructor(parameters: RendererParameters) {
    super({
      container: parameters.container,
    })

    this.scene = parameters.scene
    this.drawFunction = this.render
  }

  public withTicker(callback: () => void) {
    Ticker.add(this.draw)
    Ticker.removeAfterDelay(this.draw)
    callback()
  }

  public withoutTicker(callback: () => void) {
    callback()
    this.scene.calibrate()
    this.draw()
  }

  protected override resize(entry: ResizeObserverEntry): void {
    super.resize(entry)
    this.scene.resize(this)
  }

  private render = (canvas: Canvas, t = 0, dt = 0) => {
    canvas.clear()
    this.scene.render(canvas, t, dt)
  }
}
