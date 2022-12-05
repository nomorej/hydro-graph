import { Track } from '../tools/Track';
import { Renderer } from './Renderer';
import { Object } from './Object';
export interface SceneParameters {
    maxZoom?: number;
    sizeProgress?: number;
    positionProgress?: number;
    zoom?: number;
}
export declare class Scene {
    renderer: Renderer;
    zoom: number;
    maxZoom: number;
    size: Track;
    position: Track;
    readonly objects: Set<Object>;
    private _viewportSize;
    constructor(parameters?: SceneParameters);
    get viewportSize(): number;
    set viewportSize(value: number);
    scaleStep(pivot?: number, value?: number): void;
    scaleSet(pivot?: number, value?: number): void;
    setTranslate(value?: number): void;
    translate(value?: number): void;
    calibratePointer(): void;
    resize(): void;
    render(_: number, dt: number): void;
    addObject(object: Object): void;
    removeObject(object: Object): void;
}
