import { Object } from '../core/Object';
export interface ContentParameters {
    backgroundColor?: '#f5fcff';
}
export declare class Content extends Object {
    private readonly backgroundColor;
    constructor(parameters?: ContentParameters);
    onRender(): void;
}
