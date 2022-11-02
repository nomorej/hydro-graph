import { App, AppSettings } from './App'
import GUI from 'lil-gui'

// --- TEST

const container = document.createElement('div')

container.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`

document.body.appendChild(container)

const settings: AppSettings = {
  maxZoom: 15,
  smoothness: 7,
  wheelZoomSpeed: 1,
  wheelTranlationSpeed: 1,
  zoomMouseButton: 'left',
}

let app = new App({
  container,
  ...settings,
})

// --- GUI

const gui = new GUI()
gui.domElement.style.width = '35%'

gui.add(settings, 'maxZoom').step(1).min(1).max(100).name('Максимальный масштаб')

gui.add(settings, 'smoothness').step(0.1).min(0).max(10).name('Плавность')

gui
  .add(settings, 'wheelZoomSpeed')
  .step(0.01)
  .min(0.01)
  .max(3)
  .name('Скорость масштабирования колесиком')

gui
  .add(settings, 'wheelTranlationSpeed')
  .step(0.1)
  .min(0)
  .max(10)
  .name('Скорость прокрутки колесиком')

gui.add(settings, 'zoomMouseButton', ['left', 'right']).name('Кнопка мыши для масштабирования')

gui.onChange(() => {
  app?.destroy()
  app = new App({
    container,
    ...settings,
  })
})
