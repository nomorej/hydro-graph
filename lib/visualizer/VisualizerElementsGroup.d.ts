import { TimelineSegmentDateWithTime } from '../core/Timeline';
import { XY } from '../utils/ts';
import { VisualizerElement, VisualizerElementParameters } from './VisualizerElement';
import { VisualizerGroup, VisualizerGroupParameters } from './VisualizerGroup';
export declare type VisualizerElementsGroupData<V> = Array<VisualizerElementsGroupDataItem<V>>;
export interface VisualizerElementsGroupDataItem<V = number> extends Omit<VisualizerElementParameters<V>, 'startSegment' | 'endSegment'> {
    date: TimelineSegmentDateWithTime;
    fillDay?: boolean;
}
export interface VisualizerElementsGroupParameters<V> extends VisualizerGroupParameters {
    name?: string;
    color?: string;
    data: VisualizerElementsGroupData<V>;
    hitInfo?: HitInfoCallback<V>;
}
export declare type HitInfoCallback<V> = (element: VisualizerElement<V>) => Array<string>;
export declare abstract class VisualizerElementsGroup<T extends VisualizerElement<any> = VisualizerElement<any>> extends VisualizerGroup {
    readonly elements: Array<T>;
    constructor(parameters: VisualizerElementsGroupParameters<T['value']>);
    calculateMinMax(): {
        min: number;
        max: number;
    };
    protected abstract createElement(parameters: VisualizerElementParameters<T['value']>): T;
    protected getElementNumberValue?(element: T): number | [number, number];
    hitTest?(pointer: XY): VisualizerElement<any> | undefined | false;
    hitInfo?(element: VisualizerElement<any>): Array<string>;
}
