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
      position: absolute;
      left: 0;
      top: 0;
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
      height: 100%;
      background-color: black;
      transform-origin: left;
      pointer-events: none;
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
    this.knobSize = Math.floor(renderer.size.x / scene.maxZoom)
    this.knob.style.width = this.knobSize + 'px'
    this.track.slipperiness = scene.position.slipperiness
    this.track.distance = renderer.size.x - this.knobSize
  }

  public render({ scene }: SceneRenderData) {
    let max = scene.size.pointer.current - scene.viewportSize

    const scale = max / scene.viewportSize
    const scaleR = scene.maxZoom - scale
    const scaleWithoutButtonSize = max / (scene.viewportSize - this.knobSize * scaleR) || 0
    const x = scene.position.pointer.current / Math.max(1, scaleWithoutButtonSize)
    this.knob.style.transform = `translateX(${x}px) scaleX(${scaleR})`

    if (scene.zoom === 1) {
      this.bar.style.opacity = '0'
      this.knob.style.pointerEvents = 'none'
    } else {
      this.bar.style.opacity = this.grabbed || this.hovered ? '1' : '0.3'
      this.knob.style.pointerEvents = 'auto'
    }
  }

  private handlePointerEnter = () => {
    this.hovered = true
    this.bar.style.opacity = this.scene.zoom !== 1 ? '1' : '0'
  }

  private handlePointerLeave = () => {
    this.hovered = false
    this.bar.style.opacity = this.scene.zoom !== 1 ? '0.3' : '0'
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

    if (this.scene.zoom !== 1) {
      document.body.style.cursor = 'grabbing'
      this.knob.style.cursor = 'grabbing'
      this.grabbed = true

      addEventListener('pointermove', move)
      addEventListener('pointerup', drop)
    }
  }
}
