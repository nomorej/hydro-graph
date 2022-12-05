import { XY } from '../ts';
export declare function pointRectCollision(point: XY, rect: XY & {
    width: number;
    height: number;
}): true | undefined;
