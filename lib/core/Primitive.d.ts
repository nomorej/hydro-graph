export declare class Primitive {
    private _x1;
    private _x2;
    private _y1;
    private _y2;
    private _width;
    private _height;
    constructor(x1?: number, x2?: number, y1?: number, y2?: number);
    set x1(v: number);
    get x1(): number;
    set x2(v: number);
    get x2(): number;
    set y1(v: number);
    get y1(): number;
    set y2(v: number);
    get y2(): number;
    set width(v: number);
    get width(): number;
    set height(v: number);
    get height(): number;
    get middleX(): number;
    get middleY(): number;
    private calculateWidth;
    private calculateHeight;
}
