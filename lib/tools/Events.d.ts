export declare type EventListener<T> = {
    [K in keyof T]: (...args: any[]) => any;
};
export declare type EventDefaultListener = {
    [k: string]: (...args: any[]) => any;
};
export declare class Events<T extends EventListener<T> = EventDefaultListener> {
    readonly listeners: Map<keyof T, Array<Function>>;
    constructor();
    listen<E extends keyof T>(event: E, listener: T[E]): void;
    unlisten<E extends keyof T>(event: E, listener?: T[E]): void;
    unlistenAll(event?: keyof T): void;
    notify<E extends keyof T>(event: E, ...args: Parameters<T[E]>): void;
}
