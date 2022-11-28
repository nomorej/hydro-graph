import { Plugin } from './Plugin'

export class Print extends Plugin {
  private button: HTMLElement

  constructor() {
    super()

    this.button = document.createElement('button')

    this.button.style.cssText = `
      position: absolute;
      left: 100%;
      bottom: 100%;
      width: 3.5vmin;
      height: 3.5vmin;
      border: none;
      transform: translateX(-3.5vmin);
      background: none;
    `

    this.button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
        <path d="M42.5,19.408H40V1.843c0-0.69-0.561-1.25-1.25-1.25H6.25C5.56,0.593,5,1.153,5,1.843v17.563H2.5
          c-1.381,0-2.5,1.119-2.5,2.5v20c0,1.381,1.119,2.5,2.5,2.5h40c1.381,0,2.5-1.119,2.5-2.5v-20C45,20.525,43.881,19.408,42.5,19.408z
          M32.531,38.094H12.468v-5h20.063V38.094z M37.5,19.408H35c-1.381,0-2.5,1.119-2.5,2.5v5h-20v-5c0-1.381-1.119-2.5-2.5-2.5H7.5
          V3.093h30V19.408z M32.5,8.792h-20c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25h20c0.689,0,1.25,0.56,1.25,1.25
          S33.189,8.792,32.5,8.792z M32.5,13.792h-20c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25h20c0.689,0,1.25,0.56,1.25,1.25
          S33.189,13.792,32.5,13.792z M32.5,18.792h-20c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25h20c0.689,0,1.25,0.56,1.25,1.25
          S33.189,18.792,32.5,18.792z" stroke="#4C6EF5" fill="#4C6EF5"/>
      </svg>
    `

    this.button.addEventListener('click', this.handleClick)
  }

  public override onCreate() {
    this.complexGraph.container.appendChild(this.button)
  }

  public override onDestroy() {
    this.complexGraph.container.removeChild(this.button)
    this.button.removeEventListener('click', this.handleClick)
  }

  private handleClick = () => {
    const url = this.complexGraph.renderer.canvasElement.toDataURL()

    const win = window.open()

    if (win) {
      win.document.write("<img src='" + url + "'/>")
      win.setTimeout(() => win.print(), 0)
    }
  }
}
