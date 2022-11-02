export abstract class UtilsMath {
  public static lerp(a: number, b: number, c: number) {
    return (1 - c) * a + c * b
  }

  public static damp(a: number, b: number, c: number, dt: number) {
    return UtilsMath.lerp(a, b, 1 - Math.exp(-c * dt))
  }

  public static step(edge: number, value: number, x = 0, y = 1) {
    return value < edge ? x : y
  }

  public static round(number: number, precision: number = 5) {
    return +number.toFixed(precision)
  }

  public static clamp(number: number, min: number = 0, max: number = 0) {
    return Math.max(min, Math.min(number, max))
  }
}
