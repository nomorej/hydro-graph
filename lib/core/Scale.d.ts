import { Calculator } from './Calculator';
import { Primitive } from './Primitive';
import { Renderer } from './Renderer';
export declare type ScalePosition = 'right' | 'left';
export declare type ScaleSegment = {
    y: number;
    value: number;
};
export interface ScaleParameters {
    title?: string;
    step?: number;
    color?: string;
    position?: ScalePosition;
    gridColor?: string;
    abs?: boolean;
    gridActive?: boolean;
}
export interface SkipScaleSegmentParameters {
    segment: ScaleSegment;
    index: number;
    segments: Array<ScaleSegment>;
}
export declare class Scale {
    private readonly color;
    private readonly gridColor;
    private readonly step;
    private readonly abs;
    readonly segments: Array<ScaleSegment>;
    private readonly title;
    private readonly position;
    private scaleScatter;
    gridActive: boolean;
    constructor(parameters: ScaleParameters);
    create(min: number, max: number): {
        min: number;
        max: number;
    };
    render(renderer: Renderer, calculator: Calculator, row: Primitive, font?: string, paddingBottom?: number): void;
    skip(data: SkipScaleSegmentParameters): boolean | undefined;
}
