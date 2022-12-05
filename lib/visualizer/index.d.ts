import { Pointer } from '../tools/Pointer';
import { Object, ObjectParameters } from '../core/Object';
import { Primitive } from '../core/Primitive';
import { Scale, ScaleParameters } from '../core/Scale';
import { VisualizerGroup } from './VisualizerGroup';
export interface VisualizerParameters extends ObjectParameters {
    row: number;
    rowFactor?: number;
    scale?: ScaleParameters;
    paddingBottom?: number;
}
export declare const visualizerPointer: Pointer<Visualizer<VisualizerGroup>>;
export declare class Visualizer<T extends VisualizerGroup = VisualizerGroup> extends Object {
    readonly rowParameter: number;
    readonly rowFactorParameter: number;
    readonly groups: Set<T>;
    readonly row: Primitive;
    min: number;
    max: number;
    readonly scale?: Scale;
    private readonly _paddingBottom;
    constructor(parameters: VisualizerParameters);
    onDestroy(): void;
    get paddingBottom(): number;
    onRender(): void;
    show(): void;
    hide(): void;
    showGrid(): void;
    hideGrid(): void;
    private calculateMinMax;
}
