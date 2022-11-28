import { ComplexGraph } from '../core/ComplexGraph'
import { Visualizer, VisualizerElement, VisualizerGroup } from '../core/Visualizer'
import { AirTemperature, AirTemperatureGroupsNames } from '../graphs/AirTemperature'
import { IceRuler, IceRulerGroupsNames, IceRulerValue } from '../graphs/IceRuler'
import {
  Precipitation,
  PrecipitationGroupsNames,
  PrecipitationValue,
} from '../graphs/Precipitation'
import { SnowIce, SnowIceValue } from '../graphs/SnowIce'
import { WaterLevel } from '../graphs/WaterLevel'
import { WaterTemperature } from '../graphs/WaterTemperature'
import { WaterСonsumption, WaterСonsumptionGroupsNames } from '../graphs/WaterСonsumption'
import { pointRectCollision } from '../utils/pointRectCollision'
import { XY } from '../utils/ts'
import { Plugin } from './Plugin'

export class Tooltip {
  public readonly element: HTMLElement

  constructor(public readonly complexGraph: ComplexGraph) {
    this.element = document.createElement('div')

    this.element.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      opacity: 0;
      pointer-events: none;
      font-family: ${complexGraph.font || 'sans-serif'};
      font-size: 1.5vmin;
      padding: 0.4vmin;
      background-color: white;
      border-radius: 0.2vmin;
      transition: opacity 0.3s;
      opacity: 0.8,
    `

    complexGraph.container.appendChild(this.element)
  }

  public destroy() {
    this.complexGraph.container.removeChild(this.element)
  }

  public show(text: string | Array<string>) {
    text = Array.isArray(text) ? text : [text]

    let preparedText = ''

    text.forEach((t, i) => {
      if (i === text.length - 1) {
        preparedText += t
      } else {
        return (preparedText += t + '<br>')
      }
    })

    this.element.innerHTML = preparedText
    this.element.style.opacity = '0.8'

    const height = this.element.offsetHeight
    this.element.style.transform = `translate(${this.complexGraph.mouse.x}px, ${
      this.complexGraph.mouse.y - height
    }px)`
  }

  public hide() {
    this.element.style.opacity = '0'
  }
}

export class Tooltips extends Plugin {
  private tooltip: Tooltip
  private visualizers: Array<Visualizer<any, any>>

  constructor() {
    super()

    this.tooltip = null!
    this.visualizers = []
  }

  public override onCreate() {
    this.tooltip = new Tooltip(this.complexGraph)
    this.visualizers = Array.from(this.complexGraph.scene.objects).filter(
      (v) => v instanceof Visualizer
    ) as Array<Visualizer<any>>
    this.complexGraph.events.listen('mousemove', this.handleMouseMove)
  }

  public override onDestroy() {
    this.tooltip.destroy()
    this.complexGraph.events.unlisten('mousemove', this.handleMouseMove)
  }

  private handleMouseMove = (mouse: XY<number>, mouseZoomed: XY<number>) => {
    let collisionsCount = 0
    let visibleGroupsCount = 0
    this.visualizers.forEach((visualizer) => {
      const { isActive, row, groups, complexGraph } = visualizer

      if (isActive && mouseZoomed.y > row.y1 && mouseZoomed.y < row.y2) {
        groups.forEach((group) => {
          if (group?.elements.length && group.isVisible) {
            visibleGroupsCount++

            group.elements.forEach((el) => {
              if (visualizer instanceof AirTemperature) {
                collisionsCount += this.airTemperature(el, group)
              } else if (visualizer instanceof Precipitation) {
                collisionsCount += this.precipitation(el, group)
              } else if (visualizer instanceof IceRuler) {
                collisionsCount += this.iceRuler(el, group)
              } else if (visualizer instanceof SnowIce) {
                collisionsCount += this.snowIce(el, group)
              } else if (visualizer instanceof WaterTemperature) {
                collisionsCount += this.waterTemperature(el, group)
              } else if (visualizer instanceof WaterLevel) {
                collisionsCount += this.waterLevel(el, group)
              } else if (visualizer instanceof WaterСonsumption) {
                collisionsCount += this.waterConsumption(el, group)
              }
            })
          }
        })
      }
      if (!collisionsCount && visibleGroupsCount) {
        this.tooltip.hide()
      }
    })
  }

  private graphPointCollision(element: VisualizerElement<number>) {
    const rectSize = this.complexGraph.renderer.minSize * 0.05

    return pointRectCollision(this.complexGraph.mouseZoomed, {
      x: element.x - rectSize / 2,
      y: element.y - rectSize / 2,
      width: rectSize,
      height: rectSize,
    })
  }

  private airTemperature(
    el: VisualizerElement<number>,
    group: VisualizerGroup<number, AirTemperatureGroupsNames>
  ) {
    if (this.graphPointCollision(el)) {
      this.tooltip.show([`Срок: ${el.segment.date}`, `Температура: ${el.value}`])
      return 1
    }

    return 0
  }

  private precipitation(
    el: VisualizerElement<PrecipitationValue>,
    group: VisualizerGroup<PrecipitationValue, PrecipitationGroupsNames>
  ) {
    if (pointRectCollision(this.complexGraph.mouseZoomed, el)) {
      if (typeof el.value === 'number') {
        this.tooltip.show([`Срок: ${el.segment.date}`, `Уровень: ${el.value}`])
      } else {
        this.tooltip.show([
          `Срок: ${el.segment.date}`,
          `Уровни`,
          `Твердый: ${el.value.solid}`,
          `Жидкий: ${el.value.liquid}`,
        ])
      }
      return 1
    }
    return 0
  }

  private iceRuler(
    el: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) {
    let collision = pointRectCollision(this.complexGraph.mouseZoomed, el)

    if (group.name === 'shoreIce') {
      collision =
        collision ||
        pointRectCollision(this.complexGraph.mouseZoomed, {
          x: el.x,
          y: (group.dr as IceRuler).lines[7].y - el.height,
          width: el.width,
          height: el.height,
        })
    }

    if (el.value.text && collision) {
      this.tooltip.show([`Срок: ${el.segment.date}`, ...el.value.text])
      return 1
    }

    return 0
  }

  private snowIce(el: VisualizerElement<SnowIceValue>, group: VisualizerGroup<SnowIceValue>) {
    const columnSize = this.complexGraph.renderer.minSize * 0.05

    if (
      pointRectCollision(this.complexGraph.mouseZoomed, {
        x: el.x - columnSize / 2,
        y: group.dr.row.y1,
        width: columnSize,
        height: group.dr.row.height,
      })
    ) {
      this.tooltip.show([
        `Срок: ${el.segment.date}`,
        `Уровни`,
        `Снег: ${el.value.snow}`,
        `Лед: ${el.value.ice}`,
      ])

      return 1
    }

    return 0
  }

  private waterTemperature(el: VisualizerElement<number>, group: VisualizerGroup<number>) {
    if (this.graphPointCollision(el)) {
      this.tooltip.show([`Срок: ${el.segment.date}`, `Температура: ${el.value}`])
      return 1
    }
    return 0
  }

  private waterLevel(
    el: VisualizerElement<number>,
    group: VisualizerGroup<number, WaterСonsumptionGroupsNames>
  ) {
    if (this.graphPointCollision(el)) {
      this.tooltip.show([`Срок: ${el.segment.date}`, `Уровень: ${el.value}`])
      return 1
    }
    return 0
  }

  private waterConsumption(
    el: VisualizerElement<number>,
    group: VisualizerGroup<number, WaterСonsumptionGroupsNames>
  ) {
    if (this.graphPointCollision(el)) {
      this.tooltip.show([`Срок: ${el.segment.date}`, `Расход: ${el.value}`])
      return 1
    }
    return 0
  }
}
