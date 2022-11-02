export type TickerListener = (t: number, dt: number) => void

export interface TickerQueueItem {
  callback: TickerListener
  position: number
}

export abstract class Ticker {
  private static lastTickDate = 0
  private static lastFrameId = 0
  private static timeoutsCallbacks: WeakMap<TickerListener, ReturnType<typeof setTimeout>> =
    new WeakMap()
  private static queue: Array<TickerQueueItem> = []

  public static add(callback: TickerListener, position: number = 0) {
    this.checkTimeouts(callback)

    if (!this.lastFrameId) {
      this.lastTickDate = Date.now()
      this.lastFrameId = requestAnimationFrame(this.tick)
    }

    if (!this.queue.find((item) => item.callback === callback)) {
      this.queue.push({ callback, position })
      this.queue.sort((a, b) => a.position - b.position)
    }

    return () => {
      this.remove(callback)
    }
  }

  public static remove(callback: TickerListener) {
    this.queue = this.queue.filter((item) => {
      if (item.callback !== callback) return true

      return false
    })

    if (!this.queue.length) {
      cancelAnimationFrame(this.lastFrameId)
      this.lastFrameId = 0
    }
  }

  public static removeAfterDelay(
    callback: TickerListener,
    options?: { delay: number; afterRemove?: Function }
  ) {
    if (this.timeoutsCallbacks.has(callback)) return

    this.timeoutsCallbacks.set(
      callback,
      setTimeout(() => {
        this.remove(callback)
        options?.afterRemove?.()
        this.timeoutsCallbacks.delete(callback)
      }, options?.delay ?? 2000)
    )
  }

  private static tick = (t: number) => {
    const now = Date.now()
    const delta = now - this.lastTickDate
    this.queue.forEach((item) => item.callback(t, delta))
    this.lastTickDate = now
    this.lastFrameId = requestAnimationFrame(this.tick)
  }

  private static checkTimeouts(callback: TickerListener) {
    if (this.timeoutsCallbacks.has(callback)) {
      clearTimeout(this.timeoutsCallbacks.get(callback)!)
      this.timeoutsCallbacks.delete(callback)
    }
  }
}
