import { VisualizerElementsGroupData } from '../visualizer/VisualizerElementsGroup';
export interface AirTemperatureParameters {
    middle?: VisualizerElementsGroupData<number>;
    max?: VisualizerElementsGroupData<number>;
    min?: VisualizerElementsGroupData<number>;
    post?: VisualizerElementsGroupData<number>;
    sumTempSpring?: VisualizerElementsGroupData<number>;
    sumTempAutumn?: VisualizerElementsGroupData<number>;
    sumTempAll?: VisualizerElementsGroupData<number>;
}
export declare function createAirTemperatureGraph(parameters: AirTemperatureParameters): void;
