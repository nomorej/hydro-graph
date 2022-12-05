import { ComplexGraph } from '../core/ComplexGraph';
export declare abstract class Extension {
    readonly complexGraph: ComplexGraph;
    private destroyed;
    constructor();
    destroy(): void;
    onDestroy?(): void;
}
