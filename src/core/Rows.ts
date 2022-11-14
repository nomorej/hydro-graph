import { Primitive } from '../core/Primitive'
import { Segmentator } from '../tools/Segmentator'
import { Graph } from './Graph'

export type RowsFactors = Array<number>

export class Rows {
  private segmentator: Segmentator<number>
  public rows: Array<Primitive>
  public readonly graphs: Map<number, Set<Graph>>

  constructor() {
    this.segmentator = new Segmentator({ scale: 1, gap: 0.04 })
    this.rows = []
    this.graphs = new Map()
  }

  public addGraph(graph: Graph) {
    if (!this.rows[graph.rowParameter]) {
      this.rows[graph.rowParameter] = new Primitive()
    }

    if (!this.graphs.has(graph.rowParameter)) {
      this.graphs.set(graph.rowParameter, new Set([graph]))
    } else {
      this.graphs.get(graph.rowParameter)!.add(graph)
    }

    this.segmentate()
  }

  public removeGraph(graph: Graph) {
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
      const rowGraphs = this.graphs.get(index)
      let maxFactor = 0
      rowGraphs?.forEach(
        (g) => g.rowFactorParameter > maxFactor && (maxFactor = g.rowFactorParameter)
      )
      this.segmentator.cut(index, maxFactor)
    }
  }
}
