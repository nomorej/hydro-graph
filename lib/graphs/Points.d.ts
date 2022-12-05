import { VisualizerElement, VisualizerElementParameters } from '../visualizer/VisualizerElement';
import { VisualizerElementsGroup, VisualizerElementsGroupParameters } from '../visualizer/VisualizerElementsGroup';
import { XY } from '../utils/ts';
export interface PointsElementParameters<T = number> extends VisualizerElementParameters<T> {
    new?: boolean;
}
export declare class PointsElement<T = number> extends VisualizerElement<T> {
    new: boolean;
    constructor(parameters: PointsElementParameters<T>);
}
export interface PointsGroupParameters<T = number> extends VisualizerElementsGroupParameters<T> {
    maxDaysGap?: number;
}
export declare abstract class PointsGroup<T> extends VisualizerElementsGroup<PointsElement<T>> {
    constructor(parameters: PointsGroupParameters<T>);
    render(heightStep: number): void;
    protected drawLinear(color?: string): void;
    protected createElement(parameters: PointsElementParameters<T>): PointsElement<T>;
}
export declare class PointsNumberGroup extends PointsGroup<number> {
    constructor(parameters: PointsGroupParameters<number>);
    resize(heightStep: number): void;
    protected getElementNumberValue(element: PointsElement<number>): number;
    hitTest(pointer: XY<number>): PointsElement<number> | undefined;
}
