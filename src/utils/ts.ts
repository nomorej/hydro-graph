export interface XY<T = number> {
  x: T
  y: T
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type Constructor<T, P> = new (parameters: P) => T

export type Range<T extends number> = number extends T ? number : _Range<T, []>
type _Range<T extends number, R extends unknown[]> = R['length'] extends T
  ? R[number]
  : _Range<T, [R['length'], ...R]>
