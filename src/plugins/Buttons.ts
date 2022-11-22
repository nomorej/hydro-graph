import { Visualizer, VisualizerGroup } from '../core/Visualizer'
import { Plugin } from './Plugin'

class SubButton {
  public readonly subButton: HTMLElement

  constructor(public readonly drg: VisualizerGroup<any>) {
    this.subButton = document.createElement('div')
    this.subButton.className = 'complex-graph-button'
    this.subButton.addEventListener('click', this.toggle)
    this.subButton.innerText = drg.title || 'unnamed'
  }

  public destroy() {
    this.subButton.removeEventListener('click', this.toggle)
  }

  public appendTo(container: HTMLElement) {
    container.appendChild(this.subButton)
  }

  public unactive() {
    this.subButton.classList.add('unactive')
  }

  public active() {
    this.subButton.classList.remove('unactive')
  }

  private toggle = () => {
    if (this.drg.isVisible) {
      this.drg.hide()
      this.unactive()
    } else {
      this.drg.show()
      this.active()
    }
  }
}

class SubButtons {
  public readonly subButtons: Array<SubButton>
  public readonly container: HTMLElement

  constructor() {
    this.subButtons = []
    this.container = document.createElement('div')
    this.container.className = 'complex-graph-sub-buttons'
  }

  public destroy() {
    this.subButtons.forEach((subButton) => subButton.destroy())
  }

  public add(subButton: SubButton) {
    this.subButtons.push(subButton)
    subButton.appendTo(this.container)
  }

  public appendTo(container: HTMLElement) {
    container.appendChild(this.container)
  }

  public active() {
    this.subButtons.forEach((b) => b.active())
  }

  public unactive() {
    this.subButtons.forEach((b) => b.unactive())
  }
}

class Button {
  public readonly wrapper: HTMLElement
  public readonly button: HTMLElement
  public readonly subButtons: SubButtons

  constructor(public readonly dr: Visualizer<any>) {
    this.wrapper = document.createElement('div')
    this.wrapper.className = 'complex-graph-button-wrapper '

    this.button = document.createElement('div')
    this.button.innerText = dr.name || ''
    this.button.className = 'complex-graph-button'

    this.wrapper.appendChild(this.button)

    this.subButtons = new SubButtons()
    this.subButtons.appendTo(this.wrapper)

    dr.groups.forEach((group) => {
      if (group.name !== 'default' && group.title) {
        this.subButtons.add(new SubButton(group))
      }
    })

    if (!dr.isActive) {
      this.unactive()
    }

    this.button.addEventListener('click', this.toggle)
  }

  public destroy() {
    this.subButtons.destroy()
    this.button.removeEventListener('click', this.toggle)
  }

  public appendTo(container: HTMLElement) {
    container.appendChild(this.wrapper)
  }

  private unactive() {
    this.wrapper.classList.add('unactive')
    this.subButtons.unactive()
  }

  private active() {
    this.wrapper.classList.remove('unactive')
    this.subButtons.active()
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

export class Buttons extends Plugin {
  private buttons: Array<Button>
  private readonly container: HTMLElement
  private readonly styles: HTMLStyleElement

  constructor() {
    super()

    this.buttons = []

    this.container = document.createElement('div')
    this.container.className = 'complex-graph-buttons'

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
        const button = new Button(object)
        this.buttons.push(button)
        button.appendTo(this.container)
      }
    })

    this.styles.innerText = `

      .complex-graph-buttons {
        position: absolute;
        top: -4vmin;
        left: 0;
        z-index: 2;
        display: flex;
        font-family: ${this.complexGraph.font};
        user-select: none;
      }

      .complex-graph-button-wrapper {
        position: relative;
        pointer-events: none;
      }

      .complex-graph-button {
        font-size: 1.4vmin;
        padding: 0 1.5vmin;
        height: 4vmin;
        background-color: #4C6EF5;
        color: white;

        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
      }

      .complex-graph-button-wrapper:not(:first-child) > .complex-graph-button {
        border-left: 0.1vmin solid white;
      }

      .complex-graph-buttons .complex-graph-button-wrapper:first-child > .complex-graph-button  {
        border-top-left-radius: 0.5vmin;
      }

      .complex-graph-buttons .complex-graph-button-wrapper:last-child > .complex-graph-button  {
        border-top-right-radius: 0.5vmin;
      }

      .complex-graph-button-wrapper.unactive .complex-graph-button,
      .complex-graph-button.unactive {
        background-color:  #f4f4f4;
        color: #bfbfbf;
      }

      .complex-graph-button:hover {
        background-color: #8099ff;
      }

      .complex-graph-button-wrapper.unactive:hover .complex-graph-button,
      .complex-graph-button.unactive:hover {
        background-color: #e7e7e7;
      }

      .complex-graph-sub-buttons {
        position: relative;
        width: 100%;
      }

      .complex-graph-sub-buttons .complex-graph-button {
        opacity: 0;
        pointer-events: none
      }

      .complex-graph-button-wrapper:not(:first-child) .complex-graph-sub-buttons {
        left: 0.1vmin;
        width: calc(100% - 0.1vmin);
      }

      .complex-graph-button-wrapper:not(.unactive):hover .complex-graph-sub-buttons .complex-graph-button {
        opacity: 1;
        pointer-events: auto;
      }

      .complex-graph-sub-buttons .complex-graph-button {
        font-size: 1.5vmin;
        text-align:left;
        justify-content: flex-start;
      }
    `
  }
}
