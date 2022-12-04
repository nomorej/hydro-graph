import { Visualizer, visualizerPointer } from '.'

export interface VisualizerGroupParameters {
  name?: string
  color?: string
}

export type HitInfoCallback = (data: any) => Array<string>

export abstract class VisualizerGroup {
  public readonly visualizer: Visualizer
  public readonly name?: string
  public readonly color: string
  public isVisible: boolean

  constructor(parameters: VisualizerGroupParameters) {
    if (!visualizerPointer.target) {
      throw new Error(
        `[VisualizerElementsGroup] прежде чем создавать VisualizerElementsGroup необходимо создать Visualizer`
      )
    }

    this.visualizer = visualizerPointer.target

    this.visualizer.groups.add(this)

    this.name = parameters.name
    this.color = parameters.color || 'black'
    this.isVisible = true
  }

  public destroy() {
    this.visualizer.groups.delete(this)
  }

  public abstract render?(heightStep: number): void

  public abstract resize?(heightStep: number): void

  public hide() {
    this.isVisible = false
    this.visualizer.complexGraph.renderer.redraw()
  }

  public show() {
    this.isVisible = true
    this.visualizer.complexGraph.renderer.redraw()
  }
}
