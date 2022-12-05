import { Primitive } from './Primitive';
import { Visualizer } from '../visualizer';
export declare type RowsFactors = Array<number>;
export declare class Rows {
    private segmentator;
    rows: Array<Primitive>;
    readonly visualizers: Map<number, Set<Visualizer<any>>>;
    constructor();
    addVisualizer(visualizer: Visualizer<any>): Primitive;
    removeVisualizer(visualizer: Visualizer<any>): void;
    resize(x1: number, x2: number, y: number, height: number): void;
    private segmentate;
}
