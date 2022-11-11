export function lerp(a: number, b: number, c: number) {
  return (1 - c) * a + c * b
}

export function damp(a: number, b: number, c: number, dt: number) {
  return lerp(a, b, 1 - Math.exp(-c * dt))
}

export function step(edge: number, value: number, x = 0, y = 1) {
  return value < edge ? x : y
}

export function round(number: number, precision: number = 5) {
  return +number.toFixed(precision)
}

export function clamp(number: number, min: number = 0, max: number = 0) {
  return Math.max(min, Math.min(number, max))
}
