import { TimelineSegment } from '../core/Timeline';
export interface VisualizerElementParameters<V> {
    startSegment: TimelineSegment;
    endSegment: TimelineSegment;
    value: V;
    comment?: string | Array<string>;
}
export declare class VisualizerElement<T> {
    x: number;
    y: number;
    width: number;
    height: number;
    startSegment: TimelineSegment;
    endSegment: TimelineSegment;
    readonly value: T;
    readonly comment: Array<string>;
    constructor(parameters: VisualizerElementParameters<T>);
}
