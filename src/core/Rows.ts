import { Primitive } from '../core/Primitive'
import { Segmentator } from '../tools/Segmentator'

export class Row {
  public readonly primitive: Primitive

  constructor() {
    this.primitive = new Primitive()
  }
}

export type RowsFactors = Array<number>

export class Rows {
  public readonly rows: { [key: number]: Row }
  private readonly segmentator: Segmentator<number>

  constructor() {
    this.segmentator = new Segmentator({ scale: 1, gap: 0.05 })
    this.rows = []
  }

  public construct(factors: RowsFactors) {
    for (let index = 0; index < factors.length; index++) {
      this.rows[index] = new Row()
      this.segmentator.cut(index, factors[index])
    }
  }

  public resize(x1: number, x2: number, y: number, height: number) {
    this.segmentator.segments.forEach((s) => {
      this.rows[s.id].primitive.x1 = x1
      this.rows[s.id].primitive.x2 = x2
      this.rows[s.id].primitive.y1 = y + height * s.a
      this.rows[s.id].primitive.y2 = y + height * s.b
    })
  }
}
