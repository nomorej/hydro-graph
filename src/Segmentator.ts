class Segment<T> {
  public readonly id: T
  public readonly factor: number
  public s: number
  public a: number
  public b: number

  constructor(id: T, factor: number) {
    this.id = id
    this.factor = factor
    this.s = 0
    this.a = 0
    this.b = 0
  }
}

export interface SegmentatorParameters {
  scale?: number
  offset?: number
  gap?: number
}

export class Segmentator<T extends string = string> {
  private _scale: number
  private _offset: number
  private _gap: number
  public readonly segments: Map<T, Segment<T>> = new Map()

  constructor(parameters?: SegmentatorParameters) {
    this._scale = parameters?.scale || 1
    this._offset = parameters?.offset || 0
    this._gap = parameters?.offset || 0
  }

  public get scale() {
    return this._scale
  }

  public set scale(v: number) {
    if (v === this._scale) return
    this._scale = v
    this.calculate()
  }

  public get offset() {
    return this._offset
  }

  public set offset(v: number) {
    if (v === this._offset) return
    this._offset = v
    this.calculate()
  }

  public get gap() {
    return this._gap
  }

  public set gap(v: number) {
    if (v === this._gap) return
    this._gap = v
    this.calculate()
  }

  public cut(id: T, growFactor: number) {
    if (this.segments.get(id)?.factor !== growFactor) {
      this.segments.set(id, new Segment(id, growFactor))
      this.calculate()
    }
  }

  public get(id: T) {
    return this.segments.get(id)!
  }

  private calculate() {
    const cutsAsArray = Array.from(this.segments)
    const total = cutsAsArray.reduce((prev, current) => prev + current[1].factor, 0)

    const cutsWithFactor = cutsAsArray.filter((v) => !!v[1].factor)

    cutsAsArray.forEach((cut) => {
      const factor = cut[1].factor
      const gap = cutsWithFactor.length > 1 ? this.gap : 0
      cut[1].s = factor ? (factor / total) * this.scale - gap : 0
    })

    cutsWithFactor.forEach((cut, cutIndex) => {
      cut[1].a = this.offset

      for (let index = 0; index < cutIndex; index++) {
        const next = cutsWithFactor[index][1]
        const gap = cutsWithFactor.length ? this.gap + this.gap / (cutsWithFactor.length - 1) : 0
        cut[1].a += next ? next.s + gap : 0
      }

      cut[1].b = cut[1].a + cut[1].s
    })
  }
}
