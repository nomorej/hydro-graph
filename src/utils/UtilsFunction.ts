export abstract class UtilsFunction {
  public static debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
    callback: F,
    delay = 100
  ): (...args: Parameters<F>) => void {
    let timeout: ReturnType<typeof setTimeout>

    return (...args: Parameters<F>): void => {
      clearTimeout(timeout)
      timeout = setTimeout(() => callback(...args), delay)
    }
  }

  public static throttle<F extends (...args: Parameters<F>) => ReturnType<F>>(
    callback: F,
    delay = 0
  ): (...args: Parameters<F>) => void {
    let wait = false

    return (...args: Parameters<F>): void => {
      if (!wait) {
        wait = true

        setTimeout(() => {
          callback(...args)
          wait = false
        }, delay)
      }
    }
  }
}
