import { Extension } from '../core/Extension'
import { IceRulerGroup } from '../graphs/IceRuler/IceRulerGroup'
import { cursorPosition } from '../utils/coordinates'
import { XY } from '../utils/ts'
import { Visualizer } from '../visualizer'
import { VisualizerElementsGroup } from '../visualizer/VisualizerElementsGroup'

export class Tooltips extends Extension {
  private readonly element: HTMLElement
  private visualizers: Array<Visualizer>

  private readonly mouse: XY
  private readonly mouseZoomed: XY

  constructor() {
    super()

    this.element = document.createElement('div')

    this.element.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      opacity: 0;
      pointer-events: none;
      font-family: ${this.complexGraph.font || 'sans-serif'};
      font-size: 1.5vmin;
      padding: 0.4vmin;
      background-color: white;
      border-radius: 0.2vmin;
      transition: opacity 0.3s;
      opacity: 0.8,
    `

    this.complexGraph.container.appendChild(this.element)

    this.visualizers = []

    setTimeout(() => {
      this.visualizers = Array.from(this.complexGraph.scene.objects).filter(
        (v) => v instanceof Visualizer
      ) as Array<Visualizer<any>>
    }, 20)

    this.mouse = { x: 0, y: 0 }
    this.mouseZoomed = { x: 0, y: 0 }

    this.complexGraph.renderer.canvasElement.addEventListener('pointermove', this.handlePointerMove)
    this.complexGraph.renderer.canvasElement.addEventListener('click', this.handlePointerMove)
    this.complexGraph.renderer.canvasElement.addEventListener(
      'pointerleave',
      this.handlePointerLeave
    )
  }

  public override onDestroy() {
    this.complexGraph.container.removeChild(this.element)

    this.complexGraph.renderer.canvasElement.removeEventListener(
      'pointermove',
      this.handlePointerMove
    )
    this.complexGraph.renderer.canvasElement.removeEventListener('click', this.handlePointerMove)
    this.complexGraph.renderer.canvasElement.removeEventListener(
      'pointerleave',
      this.handlePointerLeave
    )
  }

  private showElement(text: string | Array<string>) {
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
    this.element.style.transform = `translate(${this.mouse.x}px, ${this.mouse.y - height}px)`
  }

  private hideElement() {
    this.element.style.opacity = '0'
  }

  private handlePointerLeave = () => {
    this.hideElement()
  }

  private handlePointerMove = (event: MouseEvent) => {
    const { container, calculator } = this.complexGraph

    const c = cursorPosition(event, container)

    this.mouse.x = c.x
    this.mouse.y = c.y

    this.mouseZoomed.x = c.x + calculator.clipArea.x1 - calculator.area.x1
    this.mouseZoomed.y = c.y

    let collisionsCount = 0

    this.visualizers.forEach((visualizer) => {
      const { isActive, row, groups } = visualizer

      if (isActive && this.mouseZoomed.y > row.y1 && this.mouseZoomed.y < row.y2) {
        groups.forEach((group) => {
          if (
            (group instanceof VisualizerElementsGroup || group instanceof IceRulerGroup) &&
            group.hitTest &&
            group.hitInfo &&
            group.isVisible
          ) {
            const h = group.hitTest(this.mouseZoomed)

            if (h) {
              collisionsCount++
              this.showElement(group.hitInfo(h))
            }
          }
        })
      }
    })

    if (!collisionsCount) {
      this.hideElement()
    }
  }
}
