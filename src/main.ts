import { AppGlobalsConfig } from './App'
import { AppWithGUI } from './AppWithGUI'
import { presetDefault } from './presetDefault'

// --- TEST

const container = document.createElement('div')

container.style.cssText = `
  width: 100%;
  height: 100%;
`

document.getElementById('graph')?.appendChild(container)

const data: AppGlobalsConfig['data'] = {
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

new AppWithGUI(
  presetDefault({
    container,
    data,
  })
)
