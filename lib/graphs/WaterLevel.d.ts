import { VisualizerElementsGroupData } from '../visualizer/VisualizerElementsGroup';
export interface WaterLevelParameters {
    default?: VisualizerElementsGroupData<number>;
    adverse?: number;
    dangerous?: number;
}
export declare function createWaterLevelGraph(parameters: WaterLevelParameters): void;
