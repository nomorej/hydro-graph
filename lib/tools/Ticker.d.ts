export declare type TickerListener = (t: number, dt: number) => void;
export interface TickerQueueItem {
    callback: TickerListener;
    position: number;
}
export declare abstract class Ticker {
    private static lastTickDate;
    private static lastFrameId;
    private static timeoutsCallbacks;
    private static queue;
    static add(callback: TickerListener, position?: number): () => void;
    static remove(callback: TickerListener): void;
    static removeAfterDelay(callback: TickerListener, options?: {
        delay: number;
        afterRemove?: Function;
    }): void;
    private static tick;
    private static checkTimeouts;
}
