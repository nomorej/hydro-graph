import { Object } from '../core/Object';
export interface TimelineParameters {
    scaleColor?: string;
    fontColor?: string;
    monthColor?: string;
    dayColor?: string;
    hourColor?: string;
    decadeColor?: string;
}
export declare class Timeline extends Object {
    scaleColor: string;
    fontColor: string;
    monthColor: string;
    dayColor: string;
    hourColor: string;
    decadeColor: string;
    constructor(parameters?: TimelineParameters);
    onRender(): void;
    private renderSegments;
}
