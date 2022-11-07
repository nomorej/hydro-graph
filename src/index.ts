import { Data } from './core/ComplexGraph'
import { ComplexGraphWithGUI } from './core/ComplexGraphWithGUI'
import { presetDefault } from './presets/presetDefault'

// --- TEST

const container = document.createElement('div')

container.style.cssText = `
  width: 100%;
  height: 100%;
`

document.getElementById('graph')?.appendChild(container)

const data: Data = {
  months: [
    'Ноябрь',
    'Декабрь',
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
  ],
  reps: {
    airTemperature: {
      name: 'Температура воздуха',
      scaleName: 't воздуха ˚С',
      graph: {
        min: [
          30, 43, -24, 26, -41, 5, 26, -13, -22, 40, 18, -2, 39, 3, 18, 49, -27, -35, -1, -43, 15,
          -7, 25, -37, 38,
        ],
        middle: [
          -13, -10, -41, -24, -10, 27, 33, -37, 15, 24, -6, -3, 22, 13, -34, -47, -48, 20, 29, 4,
          13, -38, 25, 37, 31,
        ],
        max: [
          -23, -30, -26, -13, -7, -10, 11, 17, -25, 24, -47, 9, -44, -45, 49, -12, -2, -33, -37, 14,
          -32, 4, 10, -10, 30,
        ],
      },
    },
    precipitation: {
      name: 'Осадки',
      scaleName: 'Осадки мм',
      graph: [
        43, 1, 8, 15, 49, 0, 19, 16, 31, 3, 48, 22, 5, 31, 40, 24, 6, 36, 16, 8, 41, 44, 38, 47, 46,
      ],
    },
  },
}

new ComplexGraphWithGUI(
  presetDefault({
    container,
    data,
  })
)
