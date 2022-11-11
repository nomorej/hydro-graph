export class Primitive {
  private _x1: number
  private _x2: number
  private _y1: number
  private _y2: number
  private _width: number
  private _height: number

  constructor(x1 = 0, x2 = 0, y1 = 0, y2 = 0) {
    this._x1 = x1
    this._x2 = x2

    this._y1 = y1
    this._y2 = y2

    this._width = 0
    this._height = 0

    this.calculateWidth()
    this.calculateHeight()
  }

  public set x1(v: number) {
    this._x1 = v
    this.calculateWidth()
  }

  public get x1() {
    return this._x1
  }

  public set x2(v: number) {
    this._x2 = v
    this.calculateWidth()
  }

  public get x2() {
    return this._x2
  }

  public set y1(v: number) {
    this._y1 = v
    this.calculateHeight()
  }

  public get y1() {
    return this._y1
  }

  public set y2(v: number) {
    this._y2 = v
    this.calculateHeight()
  }

  public get y2() {
    return this._y2
  }

  public set width(v: number) {
    this._width = v
    this._x2 = this._x1 + this._width
  }

  public get width() {
    return this._width
  }

  public set height(v: number) {
    this._height = v
    this._y2 = this._y1 + this._height
  }

  public get height() {
    return this._height
  }

  public get middleX() {
    return this._x1 + this._width / 2
  }

  public get middleY() {
    return this._y1 + this._height / 2
  }

  private calculateWidth() {
    this._width = this.x2 - this.x1
  }

  private calculateHeight() {
    this._height = this.y2 - this.y1
  }
}
