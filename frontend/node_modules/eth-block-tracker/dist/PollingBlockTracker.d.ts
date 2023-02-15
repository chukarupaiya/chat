import { BaseBlockTracker, Provider } from './BaseBlockTracker';
interface PollingBlockTrackerArgs {
    provider: Provider;
    pollingInterval: number;
    retryTimeout: number;
    keepEventLoopActive: boolean;
    setSkipCacheFlag: boolean;
}
export declare class PollingBlockTracker extends BaseBlockTracker {
    private _provider;
    private _pollingInterval;
    private _retryTimeout;
    private _keepEventLoopActive;
    private _setSkipCacheFlag;
    constructor(opts?: Partial<PollingBlockTrackerArgs>);
    checkForLatestBlock(): Promise<string>;
    protected _start(): void;
    private _synchronize;
    private _updateLatestBlock;
    private _fetchLatestBlock;
}
export {};
