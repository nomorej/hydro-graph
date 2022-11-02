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
  content: '#ccfcff',
}

const sizes: AppGlobals['sizes'] = {
  font: 0.02,
  paddingX: 0.005,
  paddingY: 0.005,
  contentPaddingX: 0.1,
  timelineYOffset: 0.04,
  timelineAxisThickness: 0.003,
  timelineDashSize: 0.02,
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

const calculations: AppGlobals['calculations'] = {
  timeline: [],
  paddingX: 0,
  paddingY: 0,
  sceneWidthMinusPadding: 0,
  timelineYOffset: 0,
  timelineY: 0,
  contentX: 0,
  contentY: 0,
  contentWidth: 0,
  contentHeight: 0,
  timelineDashSize: 0,
}

const globals: AppGlobals = {
  colors,
  sizes,
  data,
  calculations,
  font: 'sans-serif',
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
colorsFolder.addColor(colors, 'timelineSegment').name('Таймлайн сегмент(not ready)')
colorsFolder.addColor(colors, 'content').name('Фон контента')

// ---

const sizesFolder = gui.addFolder('Размеры').close()

sizesFolder.add(sizes, 'font').step(0.001).min(0.01).max(0.04).name('Размер шрифта')
sizesFolder.add(sizes, 'paddingX').step(0.001).min(0).max(0.02).name('Минимальный отступ ↔')
sizesFolder.add(sizes, 'paddingY').step(0.001).min(0).max(0.02).name('Минимальный отступ ↕')
sizesFolder.add(sizes, 'contentPaddingX').step(0.001).min(0).max(0.15).name('Отступ от контента ↔')
sizesFolder.add(sizes, 'timelineYOffset').step(0.001).min(0).max(0.1).name('Отступ от таймлайна ↓')
sizesFolder
  .add(sizes, 'timelineAxisThickness')
  .step(0.0001)
  .min(0)
  .max(0.015)
  .name('Толщина таймлайна')

sizesFolder
  .add(sizes, 'timelineDashSize')
  .step(0.0001)
  .min(0.001)
  .max(0.05)
  .name('Размер черточек на таймлайне')
