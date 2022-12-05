import { Object } from './Object';
import { Primitive } from './Primitive';
import { Renderer } from './Renderer';
import { TimelineSegment } from './Timeline';
export declare class Calculator extends Object {
    readonly clipArea: Primitive;
    readonly area: Primitive;
    fontSize: number;
    isDaysZoom: boolean;
    isDaysFullZoom: boolean;
    isHoursZoom: boolean;
    isHoursFullZoom: boolean;
    constructor();
    onRender(): void;
    clip(renderer: Renderer, callback: () => void): void;
    isSegmentVisible(segment: TimelineSegment, segment2?: TimelineSegment): boolean;
    isPointVisible(point: {
        x: number;
        width: number;
    }, offsetLeft?: number, offsetRight?: number): boolean;
}
