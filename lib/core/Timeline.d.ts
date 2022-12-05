export declare type TimelineParameters = Array<Date>;
export interface TimelineSegmentParameters {
    index: number;
    date: TimelineSegmentDateWithTime;
    type: TimelineSegmentType;
    number: number;
    title: string;
    daysBefore: number;
}
export declare type TimelineSegmentType = 'month' | 'day' | 'hour';
export declare type TimelineSegmentDate = `${number}-${number}-${number}`;
export declare type TimelineSegmentDateWithTime = `${number}-${number}-${number}T${number}:${number}:${number}`;
export declare class TimelineSegment {
    readonly index: number;
    readonly date: TimelineSegmentDateWithTime;
    readonly type: TimelineSegmentType;
    readonly number: number;
    readonly title: string;
    readonly daysBefore: number;
    x1: number;
    x2: number;
    width: number;
    x1Normalized: number;
    x2Normalized: number;
    widthNormalized: number;
    nextHourSegment: TimelineSegment;
    nextDaySegment: TimelineSegment;
    currentDaySegment: TimelineSegment;
    constructor(parameters: TimelineSegmentParameters);
}
export declare class Timeline {
    readonly segments: Array<TimelineSegment>;
    constructor(parameters: TimelineParameters);
    resize(width: number): void;
}
