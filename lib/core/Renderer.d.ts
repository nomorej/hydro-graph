import { Canvas, CanvasParameters } from '../tools/Canvas';
import { Scene } from './Scene';
export interface RendererParameters extends CanvasParameters {
    scene: Scene;
}
export declare class Renderer extends Canvas {
    scene: Scene;
    constructor(parameters: RendererParameters);
    withTicker(callback?: () => void): void;
    withoutTicker(callback: () => void): void;
    stopTick(): void;
    resize(width?: number, height?: number): void;
    private render;
}
