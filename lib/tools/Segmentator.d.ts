declare class Segment<T> {
    readonly id: T;
    readonly factor: number;
    s: number;
    a: number;
    b: number;
    constructor(id: T, factor: number);
}
export interface SegmentatorParameters {
    scale?: number;
    gap?: number;
}
export declare class Segmentator<T extends string | number = string> {
    private _scale;
    private _gap;
    readonly segments: Map<T, Segment<T>>;
    constructor(parameters?: SegmentatorParameters);
    get scale(): number;
    set scale(v: number);
    get gap(): number;
    set gap(v: number);
    cut(id: T, growFactor: number): void;
    get(id: T): Segment<T>;
    private calculate;
}
export {};
