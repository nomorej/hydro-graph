import { Extension } from './Extension';
export interface ObjectParameters {
    name?: string;
    unactive?: true;
}
export declare abstract class Object extends Extension {
    readonly name: string | undefined;
    isActive: boolean;
    constructor(parameters?: ObjectParameters);
    onDestroy(): void;
    onObjectReady?(): void;
    abstract onRender(): void;
    onResize?(): void;
}
