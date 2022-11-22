import { ComplexGraph } from './ComplexGraph'

export class Tooltip {
  public readonly element: HTMLElement

  constructor(public readonly complexGraph: ComplexGraph) {
    this.element = document.createElement('div')

    this.element.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      pointer-events: none;
      font-family: ${complexGraph.font || 'sans-serif'};
      font-size: 1.5vmin;
      padding: 0.4vmin;
      background-color: white;
      border-radius: 0.2vmin;
      transition: opacity 0.3s;
    `

    complexGraph.container.appendChild(this.element)
  }

  public show(text: string) {
    this.element.innerText = text
    this.element.style.opacity = '1'
    this.element.style.transform = `translate(${this.complexGraph.mouse.x}px, ${
      this.complexGraph.mouse.y - this.complexGraph.renderer.size.y * 0.04
    }px)`
  }

  public hide() {
    this.element.style.opacity = '0'
  }
}
