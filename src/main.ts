import { App, AppGlobals, AppSettings } from './App'
import GUI from 'lil-gui'

// --- TEST

const container = document.createElement('div')

container.style.cssText = `
  width: 100%;
  height: 100%;
`

document.getElementById('graph')?.appendChild(container)
// document.body.appendChild(container)

const settings: Partial<AppSettings> = {
  maxZoom: 15,
  smoothness: 7,
  wheelZoomSpeed: 1,
  wheelTranlationSpeed: 1,
  zoomMouseButton: 'left',
}

const colors: AppGlobals['colors'] = {
  timeline: '#000000',
  timelineSegment: '#6B849A',
}

const sizes: AppGlobals['sizes'] = {
  minXOffset: 0.005,
  minYOffset: 0.005,
  timelineYOffset: 0.025,
  timelineAxisThickness: 0.003,
}

const data: AppGlobals['data'] = {
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

const globals: AppGlobals = {
  colors,
  sizes,
  data,
}

let app = new App({
  container,
  settings,
  globals,
})

// --- GUI

const hintl = document.getElementById('hint-l')
const hintr = document.getElementById('hint-r')

const gui = new GUI({
  title: 'Настройки',
})

gui.domElement.style.width = '35%'

gui.onChange(() => {
  app?.destroy()
  app = new App({
    container,
    settings,
    globals,
  })
})

gui.close()

// ---

const controlsFolder = gui.addFolder('Движение / Масштабирование').close()

controlsFolder.add(settings, 'maxZoom').step(1).min(1).max(100).name('Максимальный масштаб')

controlsFolder.add(settings, 'smoothness').step(0.1).min(0).max(10).name('Плавность')

controlsFolder
  .add(settings, 'wheelZoomSpeed')
  .step(0.01)
  .min(0.01)
  .max(3)
  .name('Скорость масштабирования колесиком')

controlsFolder
  .add(settings, 'wheelTranlationSpeed')
  .step(0.1)
  .min(0)
  .max(10)
  .name('Скорость прокрутки колесиком')

controlsFolder
  .add(settings, 'zoomMouseButton', ['left', 'right'])
  .name('Кнопка мыши для масштабирования')
  .onChange(() => {
    if (settings.zoomMouseButton === 'left') {
      hintl?.classList.add('shown')
      hintr?.classList.remove('shown')
    } else {
      hintl?.classList.remove('shown')
      hintr?.classList.add('shown')
    }
  })

// ---

const colorsFolder = gui.addFolder('Цвета').close()

colorsFolder.addColor(colors, 'timeline').name('Таймлайн')
colorsFolder.addColor(colors, 'timelineSegment').name('Таймлайн сегмент')

// ---

const sizesFolder = gui.addFolder('Размеры').close()

sizesFolder.add(sizes, 'minXOffset').step(0.001).min(0).max(0.02).name('Минимальный отступ ↔')
sizesFolder.add(sizes, 'minYOffset').step(0.001).min(0).max(0.02).name('Минимальный отступ ↕')
sizesFolder.add(sizes, 'timelineYOffset').step(0.001).min(0).max(0.1).name('Отступ от таймлайна ↓')
sizesFolder
  .add(sizes, 'timelineAxisThickness')
  .step(0.0001)
  .min(0)
  .max(0.015)
  .name('Толщина таймлайна')
