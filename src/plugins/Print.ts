import { Extension } from '../core/Extension'

export class Print extends Extension {
  private button: HTMLElement

  constructor() {
    super()

    this.button = document.createElement('button')

    this.button.style.cssText = `
      --size:calc(var(--cg-scalar) * 28);
      position: absolute;
      left: 100%;
      bottom: 100%;
      width: var(--size);
      height: var(--size);
      padding: calc(var(--size) * 0.1);
      border: none;
      border-top-left-radius: 0.5vmin;
      border-top-right-radius: 0.5vmin;
      transform: translateX(calc(var(--size) * -1));
      background: #4C6EF5;
    `

    this.button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="white">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M11.993 14.407l-1.552 1.552a4 4 0 1 1-1.418-1.41l1.555-1.556-4.185-4.185 1.415-1.415 4.185 4.185 4.189-4.189 1.414 1.414-4.19 4.19 1.562 1.56a4 4 0 1 1-1.414 1.414l-1.561-1.56zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm2-7V5H5v8H3V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v9h-2z" />
        </g>
      </svg>
    `

    this.button.addEventListener('click', this.handleClick)
    this.complexGraph.container.appendChild(this.button)
  }

  public override onDestroy() {
    this.complexGraph.container.removeChild(this.button)
    this.button.removeEventListener('click', this.handleClick)
  }

  private handleClick = () => {
    this.complexGraph.renderer.clear()
    this.complexGraph.renderer.resize(innerWidth, innerHeight)
    this.complexGraph.renderer.draw()

    const url = this.complexGraph.renderer.canvasElement.toDataURL(undefined, 1)

    const win = window.open()

    if (win) {
      win.document.write(`
        <head>
          <title>Комплексный график</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            button {
              position: fixed;
              top: 2vmin;
              right: 2vmin;
              z-index: 1;
              width: 10vmin;
              height: 10vmin;
              padding: 2vmin;
              background: none;
              border: none;
              border: 0.2vmin solid #4C6EF5;
              border-radius: 50%;
              cursor: pointer;
            }
            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <img src="${url}"/>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
              <path d="M42.5,19.408H40V1.843c0-0.69-0.561-1.25-1.25-1.25H6.25C5.56,0.593,5,1.153,5,1.843v17.563H2.5
                c-1.381,0-2.5,1.119-2.5,2.5v20c0,1.381,1.119,2.5,2.5,2.5h40c1.381,0,2.5-1.119,2.5-2.5v-20C45,20.525,43.881,19.408,42.5,19.408z
                M32.531,38.094H12.468v-5h20.063V38.094z M37.5,19.408H35c-1.381,0-2.5,1.119-2.5,2.5v5h-20v-5c0-1.381-1.119-2.5-2.5-2.5H7.5
                V3.093h30V19.408z M32.5,8.792h-20c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25h20c0.689,0,1.25,0.56,1.25,1.25
                S33.189,8.792,32.5,8.792z M32.5,13.792h-20c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25h20c0.689,0,1.25,0.56,1.25,1.25
                S33.189,13.792,32.5,13.792z M32.5,18.792h-20c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25h20c0.689,0,1.25,0.56,1.25,1.25
                S33.189,18.792,32.5,18.792z" stroke="#4C6EF5" fill="#4C6EF5"/>
            </svg>
          </button>
        </body>
      `)

      const button = win.document.querySelector('button')

      button?.addEventListener('click', () => {
        win.setTimeout(() => win.print(), 0)
      })
    }

    this.complexGraph.renderer.clear()
    this.complexGraph.renderer.resize(
      this.complexGraph.renderer.containerElement.offsetWidth,
      this.complexGraph.renderer.containerElement.offsetHeight
    )
    this.complexGraph.renderer.draw()
  }
}
