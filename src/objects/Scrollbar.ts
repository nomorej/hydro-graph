import { Object } from '../core/Object'

export interface ScrollbarParameters {
  color?: string
}

export class Scrollbar extends Object {
  private readonly bar: HTMLElement
  private readonly knob: HTMLElement
  private grabbed: boolean = null!
  private hovered: boolean = null!

  constructor(parameters?: ScrollbarParameters) {
    super()

    this.bar = document.createElement('div')
    this.knob = document.createElement('div')

    this.bar.style.cssText = `
      position: absolute;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 1%;
      pointer-events: none;
      transition: opacity 1s, color 0.5s;
      opacity: 0;
    `

    this.knob.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      height: 100%;
      background-color: ${parameters?.color || 'black'};
      transform-origin: left;
      pointer-events: none;
      cursor: grab;
    `

    this.grabbed = false
    this.hovered = false

    this.bar.appendChild(this.knob)

    this.complexGraph.container.appendChild(this.bar)

    this.knob.addEventListener('pointerdown', this.handlePointerDown)
    this.knob.addEventListener('pointerenter', this.handlePointerEnter)
    this.knob.addEventListener('pointerleave', this.handlePointerLeave)
  }

  public override onDestroy() {
    this.knob.removeEventListener('pointerdown', this.handlePointerDown)
    this.knob.removeEventListener('pointerenter', this.handlePointerEnter)
    this.knob.removeEventListener('pointerleave', this.handlePointerLeave)
    this.complexGraph.container.removeChild(this.bar)
  }

  public onRender() {
    const { scene } = this.complexGraph

    const c = this.complexGraph.calculator

    this.bar.style.top = c.clipArea.y2 + 'px'

    const reduce = 0.9
    const sceneSize = scene.size.pointer.current - scene.viewportSize
    let zoom = sceneSize / scene.viewportSize
    const reversedZoom = this.complexGraph.scene.maxZoom - zoom * reduce

    const scale =
      ((scene.viewportSize - c.area.x1 * 2) / this.complexGraph.scene.maxZoom) * reversedZoom

    const x =
      c.area.x1 +
      (scene.position.pointer.current /
        ((scene.viewportSize * this.complexGraph.scene.maxZoom) / c.clipArea.width)) *
        reduce

    this.knob.style.transform = `translateX(${x}px)`
    this.knob.style.width = scale + 'px'

    if (scene.zoom === 1) {
      this.bar.style.opacity = '0'
      this.knob.style.pointerEvents = 'none'
    } else {
      this.bar.style.opacity = this.grabbed || this.hovered ? '1' : '0.3'
      this.knob.style.pointerEvents = 'auto'
    }
  }

  private handlePointerEnter = () => {
    const { scene } = this.complexGraph
    this.hovered = true
    this.bar.style.opacity = scene.zoom !== 1 ? '1' : '0'
  }

  private handlePointerLeave = () => {
    const { scene } = this.complexGraph
    this.hovered = false
    this.bar.style.opacity = scene.zoom !== 1 ? '0.3' : '0'
  }

  private handlePointerDown = (grabEvent: MouseEvent) => {
    const { renderer, scene } = this.complexGraph

    const move = (moveEvent: MouseEvent) => {
      renderer.withTicker(() => {
        const moveCoord = start + (moveEvent.x - grabCoord) * scene.zoom
        scene.setTranslate(moveCoord)
      })
    }

    const drop = () => {
      document.body.style.cursor = ''
      this.knob.style.cursor = 'grab'
      this.grabbed = false

      removeEventListener('pointermove', move)
      removeEventListener('pointerup', drop)
    }

    const grabCoord = grabEvent.x
    const start = scene.position.pointer.target

    if (scene.zoom !== 1) {
      document.body.style.cursor = 'grabbing'
      this.knob.style.cursor = 'grabbing'
      this.grabbed = true

      addEventListener('pointermove', move)
      addEventListener('pointerup', drop)
    }
  }
}
