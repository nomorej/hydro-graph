import { Visualizer } from '.';
export interface VisualizerGroupParameters {
    name?: string;
    color?: string;
}
export declare type HitInfoCallback = (data: any) => Array<string>;
export declare abstract class VisualizerGroup {
    readonly visualizer: Visualizer;
    readonly name?: string;
    readonly color: string;
    isVisible: boolean;
    constructor(parameters: VisualizerGroupParameters);
    destroy(): void;
    abstract render?(heightStep: number): void;
    abstract resize?(heightStep: number): void;
    hide(): void;
    show(): void;
}
