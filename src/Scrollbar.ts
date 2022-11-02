import { Renderer } from './Renderer'
import { Scene, SceneCallbackData, SceneObject, SceneRenderData } from './Scene'
import { Track } from './Track'

export interface ScrollbarParameters {
  container: HTMLElement
  renderer: Renderer
}

export class Scrollbar extends SceneObject {
  private readonly container: HTMLElement
  private readonly bar: HTMLElement
  private readonly knob: HTMLElement
  private readonly track: Track
  private knobSize: number
  private scene: Scene
  private renderer: Renderer
  private grabbed: boolean
  private hovered: boolean

  constructor(parameters: ScrollbarParameters) {
    super()

    this.container = parameters.container
    this.bar = document.createElement('div')
    this.knob = document.createElement('div')

    this.bar.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100%;
      height: 0.8vh;
      pointer-events: none;
      transition: opacity 1s, color 0.5s;
      opacity: 0;
    `

    this.knob.style.cssText = `
      height: 100%;
      background-color: black;
      transform-origin: left;
      pointer-events: auto;
      cursor: grab;
    `

    this.track = new Track()
    this.knobSize = 0

    this.renderer = parameters.renderer
    this.scene = parameters.renderer.scene
    this.scene.addObject(this)

    this.grabbed = false
    this.hovered = false

    this.bar.appendChild(this.knob)
    this.container.appendChild(this.bar)
  }

  public override create() {
    this.knob.addEventListener('pointerdown', this.handlePointerDown)
    this.knob.addEventListener('pointerenter', this.handlePointerEnter)
    this.knob.addEventListener('pointerleave', this.handlePointerLeave)
  }

  public override destroy() {
    this.knob.removeEventListener('pointerdown', this.handlePointerDown)
    this.knob.removeEventListener('pointerenter', this.handlePointerEnter)
    this.knob.removeEventListener('pointerleave', this.handlePointerLeave)
    this.container.removeChild(this.bar)
  }

  public override resize({ renderer, scene }: SceneCallbackData) {
    this.knobSize = renderer.size.x / scene.maxZoom
    this.knob.style.width = this.knobSize + 'px'
    this.track.slipperiness = scene.position.slipperiness
    this.track.distance = renderer.size.x - this.knobSize
  }

  public render({ scene }: SceneRenderData) {
    const max = scene.size.pointer.current - scene.viewportSize

    const scale = max / scene.viewportSize
    const scaleR = scene.maxZoom - scale
    const scaleWidthoutButtonSize = max / (scene.viewportSize - this.knobSize * scaleR) || 0
    const x = scene.position.pointer.current / Math.max(1, scaleWidthoutButtonSize)
    this.knob.style.transform = `translateX(${x}px) scaleX(${scaleR})`

    if (scene.zoom === 1) {
      this.bar.style.opacity = '0'
      this.bar.style.pointerEvents = 'none'
    } else {
      this.bar.style.opacity = this.grabbed || this.hovered ? '1' : '0.3'
      this.bar.style.pointerEvents = 'auto'
    }
  }

  private handlePointerEnter = () => {
    this.hovered = true
    this.bar.style.opacity = '1'
  }

  private handlePointerLeave = () => {
    this.hovered = false
    this.bar.style.opacity = '0.3'
  }

  private handlePointerDown = (grabEvent: MouseEvent) => {
    const move = (moveEvent: MouseEvent) => {
      this.renderer.withTicker(() => {
        const moveCoord = start + (moveEvent.x - grabCoord) * this.scene.zoom
        this.scene.setTranslate(moveCoord)
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
    const start = this.scene.position.pointer.target

    document.body.style.cursor = 'grabbing'
    this.knob.style.cursor = 'grabbing'
    this.grabbed = true

    addEventListener('pointermove', move)
    addEventListener('pointerup', drop)
  }
}
