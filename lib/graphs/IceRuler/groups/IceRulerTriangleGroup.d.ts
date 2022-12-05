import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup';
export declare abstract class IceRulerTriangleGroup extends IceRulerGroup {
    constructor(parameters: IceRulerGroupParameters);
    protected drawTriangle(x: number, y: number, s: number, color?: string, r?: boolean): void;
}
