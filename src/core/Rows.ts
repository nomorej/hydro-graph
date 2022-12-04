import { Primitive } from './Primitive'
import { Segmentator } from '../tools/Segmentator'
import { Visualizer } from '../visualizer'

export type RowsFactors = Array<number>

export class Rows {
  private segmentator: Segmentator<number>
  public rows: Array<Primitive>
  public readonly visualizers: Map<number, Set<Visualizer<any>>>

  constructor() {
    this.segmentator = new Segmentator({ scale: 1, gap: 0.03 })
    this.rows = []
    this.visualizers = new Map()
  }

  public addVisualizer(visualizer: Visualizer<any>) {
    if (!this.rows[visualizer.rowParameter]) {
      this.rows[visualizer.rowParameter] = new Primitive()
    }

    if (visualizer.isActive) {
      if (!this.visualizers.has(visualizer.rowParameter)) {
        this.visualizers.set(visualizer.rowParameter, new Set([visualizer]))
      } else {
        this.visualizers.get(visualizer.rowParameter)!.add(visualizer)
      }
    }

    this.segmentate()

    return this.rows[visualizer.rowParameter]
  }

  public removeVisualizer(visualizer: Visualizer<any>) {
    if (this.visualizers.has(visualizer.rowParameter)) {
      this.visualizers.get(visualizer.rowParameter)!.delete(visualizer)
    }

    this.segmentate()
  }

  public resize(x1: number, x2: number, y: number, height: number) {
    this.segmentator.segments.forEach((s) => {
      if (this.rows[s.id]) {
        this.rows[s.id].x1 = x1
        this.rows[s.id].x2 = x2
        this.rows[s.id].y1 = y + height * s.a
        this.rows[s.id].y2 = y + height * s.b
      }
    })
  }

  private segmentate() {
    for (let index = 0; index < this.rows.length; index++) {
      const rowVisualizers = this.visualizers.get(index)
      let maxFactor = 0
      rowVisualizers?.forEach(
        (g) => g.rowFactorParameter > maxFactor && (maxFactor = g.rowFactorParameter)
      )
      this.segmentator.cut(index, maxFactor)
    }
  }
}
