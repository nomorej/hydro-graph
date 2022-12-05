import { Extension } from '../core/Extension';
export declare class Tooltips extends Extension {
    private readonly element;
    private visualizers;
    private readonly mouse;
    private readonly mouseZoomed;
    constructor();
    onDestroy(): void;
    private showElement;
    private hideElement;
    private handlePointerLeave;
    private handlePointerMove;
}
