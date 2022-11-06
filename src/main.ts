import { ComplexGraphGlobalsConfig } from './core/ComplexGraph'
import { ComplexGraphWithGUI } from './core/ComplexGraphWithGUI'
import { presetDefault } from './presets/presetDefault'

// --- TEST

const container = document.createElement('div')

container.style.cssText = `
  width: 100%;
  height: 100%;
`

document.getElementById('graph')?.appendChild(container)

const data: ComplexGraphGlobalsConfig['data'] = {
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
}

new ComplexGraphWithGUI(
  presetDefault({
    container,
    data,
  })
)
