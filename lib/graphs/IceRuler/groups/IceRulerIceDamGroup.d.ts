import { IceRulerGroupParameters } from '../IceRulerGroup';
import { IceRulerTriangleGroup } from './IceRulerTriangleGroup';
export declare abstract class IceRulerIceDamGroup extends IceRulerTriangleGroup {
    private mergedElements;
    constructor(parameters: IceRulerGroupParameters);
    resize(): void;
    render(): void;
    protected abstract drawEdge(x: number, y: number, s: number): void;
}
