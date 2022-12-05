import { XY } from '../utils/ts';
import { Events } from './Events';
export declare type CanvasDrawFunction = (canvasState: Canvas, ...args: any[]) => void;
export interface CanvasParameters {
    container: HTMLElement;
    clearColor?: string;
}
export declare class Canvas {
    readonly containerElement: HTMLElement;
    readonly canvasElement: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    readonly size: XY;
    clearColor: string | undefined;
    minSize: number;
    maxSize: number;
    pixelRatio: number;
    readonly events: Events<{
        resize(): void;
    }>;
    private _drawFunction?;
    private readonly resizeObserver;
    constructor(parameters: CanvasParameters);
    set drawFunction(drawFunction: CanvasDrawFunction);
    destroy(): void;
    draw: (...args: any[]) => void;
    clear(): void;
    protected resize(width?: number, height?: number): void;
    redraw: () => void;
}
