import { VisualizerElementsGroupData } from '../visualizer/VisualizerElementsGroup';
export interface WaterConsumptionParameters {
    calculated?: VisualizerElementsGroupData<number>;
    qh?: VisualizerElementsGroupData<number>;
    operational?: VisualizerElementsGroupData<number>;
    measured?: VisualizerElementsGroupData<number>;
}
export declare function createWaterConsumptionGraph(parameters: WaterConsumptionParameters): void;
