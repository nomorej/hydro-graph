export type ScaleSegmentsData = { [key: string]: Array<number> } | Array<number>

class ScaleSegment {
  constructor(
    public position: number,
    public readonly value: string | number,
    public readonly isBase: boolean
  ) {}
}

export class ScaleSegments {
  public readonly segments: Array<ScaleSegment>
  public min: number
  public max: number

  constructor(data: ScaleSegmentsData, showZero = true) {
    this.min = 0
    this.max = 0

    if (Array.isArray(data)) {
      data.forEach((v) => {
        if (v < this.min) {
          this.min = v
        }
        if (v > this.max) {
          this.max = v
        }
      })
    } else {
      Object.entries(data).forEach(([_, graph]) => {
        let typeMin = 0
        let typeMax = 0

        graph.forEach((v) => {
          if (v < typeMin) {
            typeMin = v
          }
          if (v > typeMax) {
            typeMax = v
          }
        })

        this.min = typeMin < this.min ? typeMin : this.min
        this.max = typeMax > this.max ? typeMax : this.max
      })
    }

    this.min = Math.floor(this.min / 10) * 10
    this.max = Math.ceil(this.max / 10) * 10
    const delta = this.max - this.min
    const segmentsData = []

    for (let i = 0; i <= delta / 10; i++) {
      segmentsData[i] = this.min + i * 10
    }

    this.segments = []

    segmentsData.forEach((t, i) => {
      const isEven = (t / 10) % 2 === 0
      const value = !isEven || (t == 0 && !showZero) ? '' : t
      this.segments[i] = new ScaleSegment(0, value, isEven ? true : false)
      this.min = this.min
      this.max = this.max
    })
  }
}
