import GUI from 'lil-gui'
import { App, AppParameters, AppPossibleRows } from './App'

export class AppWithGUI {
  private gui: GUI
  private app: App
  private preset: AppParameters

  constructor(preset: AppParameters) {
    this.preset = preset
    this.app = new App(this.preset)

    this.gui = new GUI({
      title: 'Настройки',
    })

    this.gui.domElement.style.width = '35%'

    this.gui.close()

    this.gui.onChange(this.handleChange)

    this.controlsFolder()
    this.colorsFolder()
    this.sizesFolder()
    this.rowsFolder()
    this.gui.add(this, 'handleSave').name('Сохранить')
    this.gui.add(this, 'handleLoad').name('Загрузить')
  }

  private controlsFolder() {
    const hintl = document.getElementById('hint-l')
    const hintr = document.getElementById('hint-r')

    const folder = this.gui.addFolder('Движение / Масштабирование').close()
    const settings = this.preset.settings!

    folder.add(settings, 'maxZoom').step(1).min(1).max(100).name('Максимальный масштаб')

    folder.add(settings, 'smoothness').step(0.1).min(0).max(10).name('Плавность')

    folder
      .add(settings, 'wheelZoomSpeed')
      .step(0.01)
      .min(0.01)
      .max(3)
      .name('Скорость масштабирования колесиком')

    folder
      .add(settings, 'wheelTranlationSpeed')
      .step(0.1)
      .min(0)
      .max(10)
      .name('Скорость прокрутки колесиком')

    folder
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
  }

  private colorsFolder() {
    const folder = this.gui.addFolder('Цвета').close()
    const colors = this.preset.globals.colors

    folder.addColor(colors, 'default').name('Стандартный')
    folder.addColor(colors, 'timeline').name('Таймлайн')
    folder.addColor(colors, 'timelineMonth').name('Месяцы')
    folder.addColor(colors, 'content').name('Фон контента')
  }

  private sizesFolder() {
    const folder = this.gui.addFolder('Размеры').close()
    const sizes = this.preset.globals.sizes

    folder.add(sizes, 'font').step(0.001).min(0.01).max(0.04).name('Размер шрифта')
    folder.add(sizes, 'paddingX').step(0.001).min(0).max(0.02).name('Отступ ↔')
    folder.add(sizes, 'paddingY').step(0.001).min(0).max(0.02).name('Отступ ↕')
    folder.add(sizes, 'contentPaddingX').step(0.01).min(0).max(0.2).name('Отступ от контента ↔')
    folder.add(sizes, 'timelineOffsetY').step(0.001).min(0).max(0.1).name('Отступ от таймлайна ↓')
    folder.add(sizes, 'timelineHeight').step(0.001).min(0.01).max(0.05).name('Высота таймлайна')
    folder
      .add(sizes.factors, 'airTemperature')
      .step(0.1)
      .min(0)
      .max(10)
      .name('Фактор высоты ряда "температура воздуха"')
    folder
      .add(sizes.factors, 'precipitation')
      .step(0.1)
      .min(0)
      .max(10)
      .name('Фактор высоты ряда "осадки"')
    folder
      .add(sizes.factors, 'waterTemperature')
      .step(0.1)
      .min(0)
      .max(10)
      .name('Фактор высоты ряда "температура воды"')
    folder
      .add(sizes.factors, 'waterLevel')
      .step(0.1)
      .min(0)
      .max(10)
      .name('Фактор высоты ряда "уровень воды"')

    folder.add(sizes, 'rowsGap').step(0.001).min(0).max(0.2).name('Расстояние между рядами')
  }

  private handleChange = (v: any) => {
    if (v.controller?.parent?._title !== 'Активные ряды') {
      this.app?.destroy()
      this.app = new App(this.preset)
    }
  }

  // @ts-ignore
  private handleSave = () => {
    const preset = this.gui.save()
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.href = window.URL.createObjectURL(new Blob([JSON.stringify(preset)], { type: 'text/plain' }))
    a.setAttribute('download', 'preset')
    a.click()
    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  }

  // @ts-ignore
  private handleLoad() {
    const reader = new FileReader()
    const input = document.createElement('input')
    input.type = 'file'
    input.style.display = 'none'
    document.body.appendChild(input)
    input.click()

    input.onchange = () => {
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          try {
            const preset = JSON.parse(reader.result)
            this.gui.load(preset)
          } catch (e) {
            console.error(e)
          }
        }

        document.body.removeChild(input)
      }

      reader.onerror = () => {
        document.body.removeChild(input)
      }

      if (input.files) {
        reader.readAsText(input.files[0])
      }
    }
  }

  private rowsFolder() {
    const folder = this.gui.addFolder('Активные ряды').close()

    const rows = this.preset.globals.rows

    folder.add(rows, 'airTemperature').name('Температура воздуха')
    folder.add(rows, 'precipitation').name('Осадки')
    folder.add(rows, 'waterTemperature').name('Температура воды')
    folder.add(rows, 'waterLevel').name('Уровень воды')

    folder.onChange((v) => {
      if (v.value) {
        this.app.showRow(v.property as AppPossibleRows)
      } else {
        this.app.hideRow(v.property as AppPossibleRows)
      }
    })
  }
}
