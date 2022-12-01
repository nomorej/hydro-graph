import { Visualizer, VisualizerGroup } from '../core/Visualizer'
import { Plugin } from './Plugin'

abstract class Button {
  public readonly element: HTMLElement

  constructor() {
    this.element = document.createElement('div')
    this.element.className = 'cg-button'

    setTimeout(() => {
      this.element.addEventListener('click', this.toggle)
    }, 0)
  }

  public destroy() {
    this.element.removeEventListener('click', this.toggle)
  }

  public appendTo(container: HTMLElement) {
    container.appendChild(this.element)
  }

  public unactive() {
    this.element.classList.add('unactive')
  }

  public active() {
    this.element.classList.remove('unactive')
  }

  protected abstract toggle(): void
}

class GraphButton extends Button {
  constructor(public readonly drg: VisualizerGroup<any>) {
    super()
    this.element.innerText = drg.title!
  }

  protected toggle = () => {
    if (this.drg.isVisible) {
      this.drg.hide()
      this.unactive()
    } else {
      this.drg.show()
      this.active()
    }
  }
}

class GridButton extends Button {
  constructor(public readonly dr: Visualizer<any>) {
    super()
    this.element.innerText = 'Сетка'

    if (!this.dr.scale!.gridActive) {
      this.unactive()
    }
  }

  protected override toggle = () => {
    if (this.dr.scale!.gridActive) {
      this.dr.hideGrid()
      this.unactive()
    } else {
      this.dr.showGrid()
      this.active()
    }
  }
}

class Buttons {
  public readonly buttons: Array<Button>
  public readonly container: HTMLElement

  constructor() {
    this.buttons = []
    this.container = document.createElement('div')
    this.container.className = 'cg-graphs-buttons'
  }

  public destroy() {
    this.buttons.forEach((subButton) => subButton.destroy())
  }

  public add(subButton: Button) {
    this.buttons.push(subButton)
    subButton.appendTo(this.container)
  }

  public appendTo(container: HTMLElement) {
    container.appendChild(this.container)
  }

  public active() {
    this.buttons.forEach((b) => {
      if (b instanceof GraphButton) {
        b.active()
      }
    })
  }

  public unactive() {
    this.buttons.forEach((b) => {
      if (b instanceof GraphButton) {
        b.unactive()
      }
    })
  }
}

class Category {
  public readonly wrapper: HTMLElement
  public readonly categoryButton: HTMLElement
  public readonly buttons: Buttons

  constructor(public readonly dr: Visualizer<any>) {
    this.wrapper = document.createElement('div')
    this.wrapper.className = 'cg-button-wrapper'

    this.categoryButton = document.createElement('div')
    this.categoryButton.innerText = dr.name || ''
    this.categoryButton.className = 'cg-button'

    this.wrapper.appendChild(this.categoryButton)

    this.buttons = new Buttons()
    this.buttons.appendTo(this.wrapper)

    if (dr.scale) {
      this.buttons.add(new GridButton(dr))
    }

    dr.groups.forEach((group) => {
      if (group.name !== 'default' && group.title) {
        this.buttons.add(new GraphButton(group))
      }
    })

    if (!dr.isActive) {
      this.unactive()
    }

    this.categoryButton.addEventListener('click', this.toggle)
  }

  public destroy() {
    this.buttons.destroy()
    this.categoryButton.removeEventListener('click', this.toggle)
  }

  public appendTo(container: HTMLElement) {
    container.appendChild(this.wrapper)
  }

  private unactive() {
    this.wrapper.classList.add('unactive')
    this.buttons.unactive()
  }

  private active() {
    this.wrapper.classList.remove('unactive')
    this.buttons.active()
  }

  private toggle = () => {
    if (this.dr.isActive) {
      this.dr.hide()
      this.unactive()
    } else {
      this.dr.show()
      this.active()
    }
  }
}

export class Valves extends Plugin {
  private categories: Array<Category>
  private readonly container: HTMLElement
  private readonly styles: HTMLStyleElement

  constructor() {
    super()

    this.categories = []

    this.container = document.createElement('div')
    this.container.className = 'cg-buttons'

    this.styles = document.createElement('style')
    document.head.appendChild(this.styles)
  }

  public override onDestroy() {
    document.head.removeChild(this.styles)
  }

  public override onCreate() {
    this.complexGraph.container.appendChild(this.container)

    this.complexGraph.scene.objects.forEach((object) => {
      if (object instanceof Visualizer) {
        const button = new Category(object)
        this.categories.push(button)
        button.appendTo(this.container)
      }
    })

    this.styles.innerText = `

      .cg-buttons {

        --size: calc(var(--cg-scalar) * 30);
        position: absolute;
        top: calc(var(--size) * -1);
        left: 0;
        z-index: 2;
        display: flex;
        font-family: ${this.complexGraph.font};
        user-select: none;
        pointer-events: none;
      }

      .cg-button-wrapper {
        position: relative;
        pointer-events: none;
      }

      .cg-button {
        font-size: calc(var(--cg-scalar) * 10);
        padding: 0 calc(var(--cg-scalar) * 10);
        height: var(--size);
        background-color: #4C6EF5;
        color: white;

        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
      }

      .cg-button-wrapper:not(:first-child) > .cg-button {
        border-left: 0.1vmin solid white;
      }

      .cg-buttons .cg-button-wrapper:first-child > .cg-button  {
        border-top-left-radius: 0.5vmin;
      }

      .cg-buttons .cg-button-wrapper:last-child > .cg-button  {
        border-top-right-radius: 0.5vmin;
      }

      .cg-button-wrapper.unactive .cg-button,
      .cg-button.unactive {
        background-color:  #f4f4f4;
        color: #bfbfbf;
      }

      .cg-button:hover {
        background-color: #8099ff;
      }

      .cg-button-wrapper.unactive:hover .cg-button,
      .cg-button.unactive:hover {
        background-color: #e7e7e7;
      }

      .cg-graphs-buttons {
        position: relative;
        width: 100%;
      }

      .cg-graphs-buttons .cg-button {
        opacity: 0;
        pointer-events: none
      }

      .cg-button-wrapper:not(:first-child) .cg-graphs-buttons {
        left: 0.1vmin;
        width: calc(100% - 0.1vmin);
      }

      .cg-button-wrapper:not(.unactive):hover .cg-graphs-buttons .cg-button {
        opacity: 1;
        pointer-events: auto;
      }

      .cg-graphs-buttons .cg-button {
        font-size: calc(var(--cg-scalar) * 12);
        text-align:left;
        justify-content: flex-start;
      }
    `
  }
}
