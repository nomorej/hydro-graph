import { Constructor } from '../../../utils/ts';
import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup';
import { IceRuleGroupsNames, IceRulerLineNumber } from '../IceRuler';
declare type IceRulerGroups = {
    [K in IceRuleGroupsNames]: {
        startLine: IceRulerLineNumber;
        endLine: IceRulerLineNumber;
        auxLines?: Readonly<Array<IceRulerLineNumber>>;
        constructor: Constructor<IceRulerGroup, IceRulerGroupParameters>;
        name: string;
    };
};
export declare const iceRulerGroups: IceRulerGroups;
export {};
