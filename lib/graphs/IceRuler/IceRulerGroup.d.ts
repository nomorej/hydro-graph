import { XY } from '../../utils/ts';
import { VisualizerElement } from '../../visualizer/VisualizerElement';
import { VisualizerGroup, VisualizerGroupParameters } from '../../visualizer/VisualizerGroup';
import { IceRulerLine } from './IceRuler';
export interface IceRulerGroupParameters extends VisualizerGroupParameters {
    elements: Array<VisualizerElement<undefined>>;
    startLine: IceRulerLine;
    endLine: IceRulerLine;
    auxLines?: Array<IceRulerLine>;
}
export declare abstract class IceRulerGroup extends VisualizerGroup {
    protected elements: Array<VisualizerElement<undefined>>;
    protected startLine: IceRulerLine;
    protected endLine: IceRulerLine;
    protected auxLines?: Array<IceRulerLine>;
    protected lineSize: number;
    constructor(parameters: IceRulerGroupParameters);
    resize(): void;
    hitTest(pointer: XY): VisualizerElement<undefined> | undefined;
    hitInfo(element: VisualizerElement<undefined>): string[];
}
