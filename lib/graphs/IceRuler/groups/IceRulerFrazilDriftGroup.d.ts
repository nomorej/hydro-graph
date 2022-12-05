import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup';
export interface IceRulerFrazilDriftGroupParameters extends IceRulerGroupParameters {
    backgroundColor?: string;
}
export declare class IceRulerFrazilDriftGroup extends IceRulerGroup {
    private readonly backgroundColor;
    constructor(parameters: IceRulerFrazilDriftGroupParameters);
    render(): void;
}
