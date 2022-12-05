import { VisualizerElementsGroupData } from '../visualizer/VisualizerElementsGroup';
export interface WaterTemperatureParameters {
    default?: VisualizerElementsGroupData<number>;
}
export declare function createWaterTemperatureGraph(parameters: WaterTemperatureParameters): void;
