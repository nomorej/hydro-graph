import { XY } from '../utils/ts';
import { VisualizerElement, VisualizerElementParameters } from '../visualizer/VisualizerElement';
import { VisualizerElementsGroup, VisualizerElementsGroupData, VisualizerElementsGroupParameters } from '../visualizer/VisualizerElementsGroup';
export interface PrecipitationMixedElementValue {
    solid: number;
    liquid: number;
}
export declare class PrecipitationMixedElement extends VisualizerElement<PrecipitationMixedElementValue> {
    constructor(parameters: VisualizerElementParameters<PrecipitationMixedElementValue>);
}
export declare class PrecipitationDefaultGroup extends VisualizerElementsGroup<VisualizerElement<number>> {
    constructor(parameters: VisualizerElementsGroupParameters<number>);
    render(heightStep: number): void;
    resize(heightStep: number): void;
    hitTest(pointer: XY<number>): VisualizerElement<number> | undefined;
    hitInfo(element: VisualizerElement<any>): string[];
    protected createElement(parameters: VisualizerElementParameters<number>): VisualizerElement<number>;
    protected getElementNumberValue(element: VisualizerElement<number>): number;
}
export interface PrecipitationMixedGroupParameters extends Omit<VisualizerElementsGroupParameters<PrecipitationMixedElementValue>, 'color'> {
    liquidColor?: string;
    solidColor?: string;
}
export declare class PrecipitationMixedGroup extends VisualizerElementsGroup<PrecipitationMixedElement> {
    private readonly liquidColor;
    private readonly solidColor;
    constructor(parameters: PrecipitationMixedGroupParameters);
    render(): void;
    resize(heightStep: number): void;
    hitTest(pointer: XY<number>): PrecipitationMixedElement | undefined;
    hitInfo(element: VisualizerElement<any>): string[];
    protected createElement(parameters: VisualizerElementParameters<PrecipitationMixedElementValue>): PrecipitationMixedElement;
    protected getElementNumberValue(element: PrecipitationMixedElement): number;
}
export interface PrecipitationParameters {
    solid?: VisualizerElementsGroupData<number>;
    liquid?: VisualizerElementsGroupData<number>;
    mixed?: VisualizerElementsGroupData<PrecipitationMixedElementValue>;
}
export declare function createPrecipitationGraph(parameters: PrecipitationParameters): void;
