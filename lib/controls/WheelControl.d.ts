import { Extension } from '../core/Extension';
export declare class WheelControl extends Extension {
    private scaleButtonPressed;
    constructor();
    onDestroy(): void;
    private handleWheel;
    private handlePointerDown;
    private handlePointerUp;
    private handleContextMenu;
}
