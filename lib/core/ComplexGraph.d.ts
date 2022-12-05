import { Extension } from './Extension';
import { Scene, SceneParameters } from './Scene';
import { Renderer } from './Renderer';
import { CanvasParameters } from '../tools/Canvas';
import { Timeline, TimelineParameters } from './Timeline';
import { Rows } from './Rows';
import { Calculator } from './Calculator';
import { Visualizer } from '../visualizer';
import { Pointer } from '../tools/Pointer';
export interface Parameters extends SceneParameters {
    wrapper: CanvasParameters['container'];
    timeline: TimelineParameters;
    fontSize?: number;
    font?: string;
}
export declare const complexGraphPointer: Pointer<ComplexGraph>;
export declare class ComplexGraph {
    readonly extensions: Set<Extension>;
    readonly wrapper: HTMLElement;
    readonly container: HTMLElement;
    readonly timeline: Timeline;
    readonly scene: Scene;
    readonly renderer: Renderer;
    readonly rows: Rows;
    readonly calculator: Calculator;
    readonly fontSize: number;
    readonly font: string;
    constructor(parameters: Parameters);
    destroy(): void;
    hide(dr: Visualizer): void;
    show(dr: Visualizer): void;
}
