import { XY } from './ts';
export declare function cursorPosition(event: MouseEvent, container: HTMLElement, offset?: XY): {
    x: number;
    y: number;
};
export declare function touchPosition(event: TouchEvent, container: HTMLElement, offset?: XY): {
    x: number;
    y: number;
};
export declare function pinchDistance(event: TouchEvent): number;
