import { ComplexGraphWithGUI } from './core/ComplexGraphWithGUI'
import { presetDefault } from './presets/presetDefault'

// --- TEST

const container = document.createElement('div')

container.style.cssText = `
  width: 100%;
  height: 100%;
`

document.getElementById('graph')?.appendChild(container)

new ComplexGraphWithGUI(
  presetDefault({
    container,
    months: [
      {
        name: 'Октябрь',
        days: 31,
      },
      {
        name: 'Ноябрь',
        days: 30,
      },
      {
        name: 'Декабрь',
        days: 31,
      },
      {
        name: 'Январь',
        days: 31,
      },
      {
        name: 'Февраль',
        days: 28,
      },
      {
        name: 'Март',
        days: 31,
      },
      {
        name: 'Апрель',
        days: 30,
      },
      {
        name: 'Май',
        days: 31,
      },
      {
        name: 'Июнь',
        days: 30,
      },
      {
        name: 'Июль',
        days: 31,
      },
      {
        name: 'Август',
        days: 31,
      },
      {
        name: 'Сентябрь',
        days: 30,
      },
      {
        name: 'Октябрь',
        days: 31,
      },
    ],
    data: {
      airTemperature: {
        title: 'Температура воздуха',
        scale: 't воздуха ˚С',
        graph: {
          min: [
            [
              {
                number: 1,
                value: 10,
              },
              {
                number: 5,
                value: 20,
              },
              {
                number: 10,
                value: 10,
              },
              {
                number: 15,
                value: 20,
              },
              {
                number: 20,
                value: 10,
              },
              {
                number: 25,
                value: 20,
              },
            ],
            [
              {
                number: 1,
                value: 25,
              },
              {
                number: 5,
                value: 15,
              },
              {
                number: 10,
                value: 5,
              },
              {
                number: 15,
                value: -10,
              },
              {
                number: 20,
                value: -20,
              },
              {
                number: 25,
                value: -25,
              },
              {
                number: 30,
                value: -10,
              },
            ],
          ],
          middle: [],
          max: [],
        },
      },
      precipitation: {
        title: 'Осадки',
        scale: 'Осадки мм',
        graph: {
          liquid: [
            [
              {
                number: 1,
                value: 10,
              },
              {
                number: 12,
                value: 20,
              },
              {
                number: 12 + (1 / 24) * 5,
                value: 18,
              },
            ],
          ],
          solid: [
            [
              {
                number: 10,
                value: 15,
              },
              {
                number: 25,
                value: 10,
              },
            ],
          ],
        },
      },
    },
  })
)
