export interface XY<T = number> {
  x: T
  y: T
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type DayData = {
  number: number
  value: number
}

export type MonthData = Array<DayData>
export type MonthsData = Array<MonthData>
export type KeyedMonthsData = { [key: string]: MonthsData }
