import { Object } from '../core/Object';
export interface ScrollbarParameters {
    color?: string;
}
export declare class Scrollbar extends Object {
    private readonly bar;
    private readonly knob;
    private grabbed;
    private hovered;
    constructor(parameters?: ScrollbarParameters);
    onDestroy(): void;
    onRender(): void;
    private handlePointerEnter;
    private handlePointerLeave;
    private handlePointerDown;
}
