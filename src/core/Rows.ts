import { Primitive } from './Primitive'
import { Segmentator } from '../tools/Segmentator'
import { Visualizer } from './Visualizer'

export type RowsFactors = Array<number>

export class Rows {
  private segmentator: Segmentator<number>
  public rows: Array<Primitive>
  public readonly graphs: Map<number, Set<Visualizer<any, any>>>

  constructor() {
    this.segmentator = new Segmentator({ scale: 1, gap: 0.05 })
    this.rows = []
    this.graphs = new Map()
  }

  public addVisualizer(graph: Visualizer<any, any>) {
    if (!this.rows[graph.rowParameter]) {
      this.rows[graph.rowParameter] = new Primitive()
    }

    if (graph.isActive) {
      if (!this.graphs.has(graph.rowParameter)) {
        this.graphs.set(graph.rowParameter, new Set([graph]))
      } else {
        this.graphs.get(graph.rowParameter)!.add(graph)
      }
    }

    this.segmentate()
  }

  public removeVisualizer(graph: Visualizer<any, any>) {
    if (this.graphs.has(graph.rowParameter)) {
      this.graphs.get(graph.rowParameter)!.delete(graph)
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
      const rowVisualizers = this.graphs.get(index)
      let maxFactor = 0
      rowVisualizers?.forEach(
        (g) => g.rowFactorParameter > maxFactor && (maxFactor = g.rowFactorParameter)
      )
      this.segmentator.cut(index, maxFactor)
    }
  }
}
