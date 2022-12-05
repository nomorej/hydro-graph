import { IceRulerGroupParameters } from '../IceRulerGroup';
import { IceRulerIceDamGroup } from './IceRulerIceDamGroup';
export declare class IceRulerIceDamAboveGroup extends IceRulerIceDamGroup {
    constructor(parameters: IceRulerGroupParameters);
    protected drawEdge(x: number, y: number, s: number): void;
}
