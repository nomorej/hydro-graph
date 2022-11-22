export type EventListener<T> = {
  [K in keyof T]: (...args: any[]) => any
}

export type EventDefaultListener = {
  [k: string]: (...args: any[]) => any
}

export class Events<T extends EventListener<T> = EventDefaultListener> {
  public readonly listeners: Map<keyof T, Array<Function>>

  constructor() {
    this.listeners = new Map()
  }

  public listen<E extends keyof T>(event: E, listener: T[E]) {
    if (this.listeners.has(event)) {
      const arr = this.listeners.get(event)
      arr!.push(listener)
    } else {
      const arr = [listener]
      this.listeners.set(event, arr)
    }
  }

  public unlisten<E extends keyof T>(event: E, listener?: T[E]) {
    if (this.listeners.has(event)) {
      if (listener) {
        const arr = this.listeners.get(event)!.filter((l) => l !== listener)
        if (arr.length) {
          this.listeners.set(event, arr)
        } else {
          this.listeners.delete(event)
        }
      } else {
        this.listeners.delete(event)
      }
    }
  }

  public unlistenAll(event?: keyof T) {
    if (event && this.listeners.has(event)) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }

  public notify<E extends keyof T>(event: E, ...args: Parameters<T[E]>) {
    this.listeners.get(event)?.forEach((listener) => {
      listener(...args)
    })
  }
}
