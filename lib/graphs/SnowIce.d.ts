import { VisualizerElementsGroupData } from '../visualizer/VisualizerElementsGroup';
interface SnowIceValue {
    snow: number;
    ice: number;
}
export interface SnowIceParameters {
    default?: VisualizerElementsGroupData<SnowIceValue>;
}
export declare function createSnowIceGraph(parameters: SnowIceParameters): void;
export {};
