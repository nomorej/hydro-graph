import GUI from 'lil-gui'
import { ComplexGraph, ComplexGraphParameters } from './ComplexGraph'

export class ComplexGraphWithGUI {
  private gui: GUI
  private app: ComplexGraph
  private preset: ComplexGraphParameters

  constructor(preset: ComplexGraphParameters) {
    this.preset = preset
    this.app = new ComplexGraph(this.preset)

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
    folder.addColor(colors.reps.airTemperature, 'scale').name('Цвет шкалы "Температуры воздуха"')
    folder
      .addColor(colors.reps.airTemperature, 'min')
      .name('Цвет графика "Минимальная температура воздуха"')
    folder
      .addColor(colors.reps.airTemperature, 'middle')
      .name('Цвет графика "Средняя температура воздуха"')
    folder
      .addColor(colors.reps.airTemperature, 'max')
      .name('Цвет графика "Максимальная температура воздуха"')
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

    for (const key in sizes.rowsFactors) {
      folder.add(sizes.rowsFactors, key).step(0.1).min(0).max(10).name(`Фактор высоты ряда №${key}`)
    }

    folder.add(sizes, 'rowsGap').step(0.001).min(0).max(0.2).name('Расстояние между рядами ↕')
    folder.add(sizes, 'scaleOffset').step(0.001).min(0).max(0.1).name('Отступ от шкал ↔')
    folder.add(sizes, 'scaleThickness').step(0.0001).min(0.0001).max(0.005).name('Толщина шкал')
  }

  private handleChange = (v: any) => {
    if (v.controller?.parent?._title === 'Движение / Масштабирование') {
      this.app.updateSettings(this.preset.settings || {})
    }
    this.app.renderer.redraw()
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

    const rows = this.preset.globals.rowsVisibility

    for (const key in rows) {
      folder.add(rows, key).name(key)
    }

    folder.onChange((v) => {
      if (v.value) {
        this.app.showObject(parseInt(v.property))
      } else {
        this.app.hideObject(parseInt(v.property))
      }
    })
  }
}
