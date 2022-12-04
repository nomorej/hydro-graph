import { Pointer } from '../tools/Pointer'
import { Object, ObjectParameters } from '../core/Object'
import { Primitive } from '../core/Primitive'
import { Scale, ScaleParameters } from '../core/Scale'
import { VisualizerElementsGroup } from './VisualizerElementsGroup'
import { VisualizerGroup } from './VisualizerGroup'

export interface VisualizerParameters extends ObjectParameters {
  row: number
  rowFactor?: number
  scale?: ScaleParameters
  paddingBottom?: number
}

export const visualizerPointer = new Pointer<Visualizer>()

export class Visualizer<T extends VisualizerGroup = VisualizerGroup> extends Object {
  public readonly rowParameter: number
  public readonly rowFactorParameter: number

  public readonly groups: Set<T>
  public readonly row: Primitive = null!

  public min: number = null!
  public max: number = null!

  public readonly scale?: Scale
  private readonly _paddingBottom: number

  constructor(parameters: VisualizerParameters) {
    super(parameters)

    visualizerPointer.target = this

    this.rowParameter = parameters.row
    this.rowFactorParameter = parameters.rowFactor || 1

    this.groups = new Set()

    if (parameters.scale) {
      this.scale = new Scale(parameters.scale)
    }

    this._paddingBottom = parameters.paddingBottom || 0

    this.row = this.complexGraph.rows.addVisualizer(this)

    this.min = 0
    this.max = -999999999

    setTimeout(() => {
      this.calculateMinMax()

      if (this.scale) {
        const { min, max } = this.scale.create(this.min, this.max)
        this.min = min
        this.max = max
      }
    }, 0)
  }

  public override destroy() {
    super.destroy()
    visualizerPointer.remove(this)
    this.complexGraph.rows.removeVisualizer(this)
  }

  public get paddingBottom() {
    return this._paddingBottom * this.row.height
  }

  public onRender() {
    const { renderer, calculator, font } = this.complexGraph

    const heightStep = (this.row.height - this.paddingBottom) / Math.max(1, this.max - this.min)

    this.groups.forEach((group) => {
      if (!group.isVisible) return
      group.resize?.(heightStep)
    })

    this.scale?.render(renderer, calculator, this.row, font, this.paddingBottom)

    this.complexGraph.calculator.clip(this.complexGraph.renderer, () => {
      this.groups.forEach((group) => {
        if (!group.isVisible) return
        group.render?.(heightStep)
      })
    })
  }

  public show() {
    this.groups.forEach((group) => {
      group.isVisible = true
    })

    this.complexGraph.show(this)
  }

  public hide() {
    this.groups.forEach((group) => {
      group.isVisible = false
    })

    this.complexGraph.hide(this)
  }

  public showGrid() {
    if (this.scale) {
      this.scale.gridActive = true
      this.complexGraph.renderer.redraw()
    }
  }

  public hideGrid() {
    if (this.scale) {
      this.scale.gridActive = false
      this.complexGraph.renderer.redraw()
    }
  }

  private calculateMinMax() {
    this.groups.forEach((group) => {
      if (group instanceof VisualizerElementsGroup) {
        const { min, max } = group.calculateMinMax()

        this.min = min < this.min ? min : this.min
        this.max = max > this.max ? max : this.max
      }
    })
  }
}
