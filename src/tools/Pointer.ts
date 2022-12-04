export class Pointer<T> {
  public target: T | null

  constructor() {
    this.target = null
  }

  public remove(target: T) {
    if (target === this.target) {
      this.target = null
    }
  }
}
