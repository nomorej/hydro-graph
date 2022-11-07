export function prepareData(data: Array<Array<number>>) {
  let maxLength = 0

  data.forEach((m) => m.length > maxLength && (maxLength = m.length))

  data.forEach((m, i) => {
    if (m.length < maxLength) {
      data[i] = interpolateArray(m, maxLength)
    }
  })

  return data.flat(1)
}

function interpolateArray(data: Array<number>, fitCount: number, ease?: number) {
  const linear = (before: number, after: number, atPoint: number) =>
    before + (after - before) * atPoint

  const newData = new Array()
  const springFactor = (data.length - 1) / (fitCount - 1)

  newData[0] = data[0]

  for (let i = 1; i < fitCount - 1; i++) {
    const tmp = i * springFactor
    const before = Math.floor(tmp)
    const after = Math.ceil(tmp)
    const atPoint = ease || tmp - before
    newData[i] = linear(data[before], data[after], atPoint)
  }
  newData[fitCount - 1] = data[data.length - 1]
  return newData
}
