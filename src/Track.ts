import { UtilsMath } from './UtilsMath'

export interface TrackPoint {
  current: number
  target: number
}

export interface TrackParameters {
  start?: number
  distance?: number
  slipperiness?: number
}

export class Track {
  public readonly pointer: TrackPoint
  public readonly progress: TrackPoint
  public start: number
  public distance: number
  private _slipperiness: number

  constructor(parameters?: TrackParameters) {
    this.start = parameters?.start || 0
    this.distance = parameters?.distance || 1
    this.slipperiness = this._slipperiness = parameters?.slipperiness || 0

    this.pointer = {
      current: 0,
      target: 0,
    }

    this.progress = {
      current: 0,
      target: 0,
    }

    this.calibratePointer(this.start)
  }

  public get slipperiness() {
    return this._slipperiness
  }

  public set slipperiness(newValue: number) {
    const m = 11
    const c = UtilsMath.clamp(newValue, 1, m)
    const s = 0.0005 * (m - c)
    this._slipperiness = s * m + s - c * s
  }

  public setPointer(value: number) {
    this.pointer.target = UtilsMath.clamp(value, this.start, this.distance)
    this.progress.target = UtilsMath.round(this.pointer.target / this.distance, 4)
  }

  public setProgress(newProgress: number) {
    this.setPointer(newProgress * this.distance)
  }

  public step(value: number) {
    this.setPointer(this.pointer.target + value)
  }

  public slide(dt: number) {
    if (this.slipperiness) {
      this.pointer.current = UtilsMath.round(
        UtilsMath.damp(this.pointer.current, this.pointer.target, this.slipperiness, dt),
        4
      )

      this.progress.current = UtilsMath.round(this.pointer.current / this.distance, 4) || 0
    } else {
      this.equalize()
    }
  }

  public equalize() {
    this.pointer.current = this.pointer.target
    this.progress.current = this.progress.target
  }

  public calibratePointer(value: number = this.pointer.target) {
    this.setPointer(value)
    this.equalize()
  }

  public calibrateProgress(newProgress: number = this.progress.target) {
    this.setProgress(newProgress)
    this.equalize()
  }

  public isIdle() {
    return UtilsMath.round(this.pointer.target, 2) === UtilsMath.round(this.pointer.current, 2)
  }

  public isStart(progressType: 'current' | 'target') {
    return this.progress[progressType] === 0
  }

  public isEnd(progressType: 'current' | 'target') {
    return this.progress[progressType] === 1
  }
}
