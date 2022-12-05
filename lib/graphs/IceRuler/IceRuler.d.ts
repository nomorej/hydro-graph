import { TimelineSegmentDateWithTime } from '../../core/Timeline';
import { Range } from '../../utils/ts';
import { Visualizer, VisualizerParameters } from '../../visualizer';
import { IceRulerGroup } from './IceRulerGroup';
export declare enum IceRulerFills {
    none = 0,
    sludge = 1,
    shoreIceSludge = 2,
    shoreIce = 3,
    iceDrift1 = 4,
    iceDrift2 = 5,
    iceDrift3 = 6,
    iceClearing = 7,
    freezing = 8,
    frazilDrift1 = 9,
    frazilDrift2 = 10,
    frazilDrift3 = 11,
    flangeIce = 12,
    error = 13
}
export declare enum IceRulerUpperSigns {
    waterOnIce = 1,
    iceJamBelow = 2,
    iceJamAbove = 3,
    iceDamBelow = 4,
    iceDamAbove = 5
}
export declare type IceRuleGroupsNames = keyof typeof IceRulerFills | keyof typeof IceRulerUpperSigns | 'iceShove';
export interface IceRulerLine {
    y: number;
}
export interface IceRulerItemData {
    localTime: TimelineSegmentDateWithTime;
    obsTime: TimelineSegmentDateWithTime;
    fill: IceRulerFills;
    upperSign: IceRulerUpperSigns | 0 | false;
    iceShove: boolean;
    waterState: number;
    text: Array<string>;
}
export declare type IceRulerData = Array<IceRulerItemData>;
export interface IceRulerParameters extends VisualizerParameters {
    data: IceRulerData;
}
export declare type IceRulerLineNumber = Exclude<Range<9>, 0>;
export declare class IceRuler extends Visualizer<IceRulerGroup> {
    readonly lines: Array<IceRulerLine>;
    private readonly segmentator;
    constructor(parameters: IceRulerParameters);
    onRender(): void;
}
