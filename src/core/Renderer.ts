import { Canvas, CanvasParameters } from '../tools/Canvas'
import { Ticker } from '../tools/Ticker'
import { Scene } from './Scene'

export interface RendererParameters extends CanvasParameters {
  scene: Scene
}

export class Renderer extends Canvas {
  public scene: Scene

  constructor(parameters: RendererParameters) {
    super({
      container: parameters.container,
      clearColor: parameters.clearColor,
    })

    //@ts-ignore
    this.context.roundRect = this.context.roundRect || this.context.rect

    this.scene = parameters.scene
    this.scene.renderer = this
    this.drawFunction = this.render
  }

  public withTicker(callback?: () => void) {
    Ticker.add(this.draw)
    Ticker.removeAfterDelay(this.draw)
    callback?.()
  }

  public withoutTicker(callback: () => void) {
    callback()
    this.scene.calibratePointer()
    this.draw()
  }

  public stopTick() {
    Ticker.remove(this.draw)
  }

  public override resize(width?: number, height?: number) {
    super.resize(width, height)
    this.scene.resize()
  }

  private render = (canvas: Canvas, t = 0, dt = 0) => {
    canvas.clear()
    this.scene.render(t, dt)
  }
}
