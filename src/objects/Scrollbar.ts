import { Renderer } from '../core/Renderer'
import { Scene, SceneRenderData } from '../core/Scene'
import { ComplexGraph } from '../core/ComplexGraph'
import { Object } from '../core/Object'

export interface ScrollbarParameters {
  color?: string
}

export class Scrollbar extends Object {
  private readonly bar: HTMLElement
  private readonly knob: HTMLElement
  private scene: Scene = null!
  private renderer: Renderer = null!
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
  }

  public override create(scene: Scene) {
    this.scene = scene
    this.renderer = scene.renderer

    this.scene.addObject(this)

    this.bar.appendChild(this.knob)

    scene.renderer.containerElement.appendChild(this.bar)

    this.knob.addEventListener('pointerdown', this.handlePointerDown)
    this.knob.addEventListener('pointerenter', this.handlePointerEnter)
    this.knob.addEventListener('pointerleave', this.handlePointerLeave)
  }

  public override destroy(scene: Scene) {
    this.knob.removeEventListener('pointerdown', this.handlePointerDown)
    this.knob.removeEventListener('pointerenter', this.handlePointerEnter)
    this.knob.removeEventListener('pointerleave', this.handlePointerLeave)
    scene.renderer.containerElement.removeChild(this.bar)
  }

  public render({ scene }: SceneRenderData) {
    const c = ComplexGraph.globals.calculator

    this.knob.style.width = 1 + 'px'
    this.bar.style.top = c.clipArea.y2 + 'px'

    const reduce = 0.9
    const sceneSize = scene.size.pointer.current - scene.viewportSize
    const zoom = sceneSize / scene.viewportSize
    const reversedZoom = ComplexGraph.globals.maxZoom - zoom * reduce

    const scale =
      ((scene.viewportSize - c.area.x1 * 2) / ComplexGraph.globals.maxZoom) * reversedZoom

    const x =
      c.area.x1 +
      (scene.position.pointer.current /
        ((scene.viewportSize * ComplexGraph.globals.maxZoom) / c.clipArea.width)) *
        reduce

    this.knob.style.transform = `translateX(${x}px) scaleX(${scale})`

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
