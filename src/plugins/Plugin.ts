import { ComplexGraph } from '../core/ComplexGraph'

export abstract class Plugin {
  public complexGraph: ComplexGraph = null!
  public onDestroy?(): void
  public onCreate?(): void
}
