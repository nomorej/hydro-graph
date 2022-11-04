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
  gap?: number
}

export class Segmentator<T extends string = string> {
  private _scale: number
  private _gap: number
  public readonly segments: Map<T, Segment<T>> = new Map()

  constructor(parameters?: SegmentatorParameters) {
    this._scale = parameters?.scale || 1
    this._gap = parameters?.gap || 0
  }

  public get scale() {
    return this._scale
  }

  public set scale(v: number) {
    if (v === this._scale) return
    this._scale = v
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
    const scalar =
      1 / this.scale - this.gap * Math.max(cutsAsArray.length - 1, 0) * (1 / this.scale)

    const total = cutsAsArray.reduce((prev, current) => prev + current[1].factor, 0)

    for (let i = 0; i < cutsAsArray.length; i++) {
      const cut = cutsAsArray[i][1]
      cut.s = (cut.factor / total) * scalar
    }

    for (let i = 0; i < cutsAsArray.length; i++) {
      const cut = cutsAsArray[i][1]

      cut.a = 0

      for (let j = 0; j < i; j++) {
        cut.a += cutsAsArray[j][1].s + this.gap
      }

      cut.b = cut.a + cut.s
    }
  }
}
