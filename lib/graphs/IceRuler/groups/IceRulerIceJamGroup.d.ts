import { IceRulerGroupParameters } from '../IceRulerGroup';
import { IceRulerTriangleGroup } from './IceRulerTriangleGroup';
export interface IceRulerIceJamGroupParameters extends IceRulerGroupParameters {
    rotate?: boolean;
}
export declare class IceRulerIceJamGroup extends IceRulerTriangleGroup {
    protected rotate: boolean;
    constructor(parameters: IceRulerIceJamGroupParameters);
    render(): void;
}
