export interface TrackPoint {
    current: number;
    target: number;
}
export interface TrackParameters {
    start?: number;
    distance?: number;
    slipperiness?: number;
}
export declare class Track {
    readonly pointer: TrackPoint;
    readonly progress: TrackPoint;
    start: number;
    distance: number;
    private _slipperiness;
    constructor(parameters?: TrackParameters);
    get slipperiness(): number;
    set slipperiness(newValue: number);
    setPointer(value: number): void;
    setProgress(newProgress: number): void;
    step(value: number): void;
    slide(dt: number): void;
    equalize(): void;
    calibratePointer(value?: number): void;
    calibrateProgress(newProgress?: number): void;
    isIdle(): boolean;
    isStart(progressType: 'current' | 'target'): boolean;
    isEnd(progressType: 'current' | 'target'): boolean;
}
