import { Object, ObjectParameters } from '../core/Object';
import { TimelineSegmentDateWithTime } from '../core/Timeline';
export interface PhaseParameters extends ObjectParameters {
    shortName?: string;
    start: TimelineSegmentDateWithTime;
    end: TimelineSegmentDateWithTime;
    fill?: boolean;
    fontColor?: string;
    backgroundColor?: string;
    edgeColor?: string;
}
export declare class Phase extends Object {
    private start;
    private end;
    private readonly startParam;
    private readonly endParam;
    private readonly fillParam;
    readonly shortName: string;
    private readonly fontColor;
    private readonly backgroundColor;
    private readonly edgeColor;
    constructor(parameters: PhaseParameters);
    onRender(): void;
}
declare const phasesPresets: {
    ОР: {
        fontColor: string;
        backgroundColor: string;
        name: string;
        shortName: string;
    };
    ОПП: {
        fontColor: string;
        backgroundColor: string;
        name: string;
        shortName: string;
    };
    ЛД: {
        fontColor: string;
        backgroundColor: string;
        name: string;
        shortName: string;
    };
    ВПП: {
        fontColor: string;
        backgroundColor: string;
        name: string;
        shortName: string;
    };
    ЗАР: {
        fontColor: string;
        backgroundColor: string;
        name: string;
        shortName: string;
    };
};
export declare type PhasesParameters = Array<{
    type: keyof typeof phasesPresets;
    start: PhaseParameters['start'];
    end: PhaseParameters['end'];
}>;
export declare function createPhases(parameters: PhasesParameters): void;
export {};
