import ConfigStore from './config-store';
import WalletStore from './wallet-store';

export type CoreStoreTypes = {
    config: ConfigStore;
    client: Record<string, any>;
    common: Record<string, any>;
    ui: Record<string, any>;
};
export default class RootStore {
    public config: ConfigStore;
    public ws: unknown;
    public client: Record<string, any>;
    public common: Record<string, any>;
    public ui: Record<string, any>;
    public wallet_store: WalletStore;

    public constructor(core_store: CoreStoreTypes) {
        this.config = new ConfigStore(this);
        this.client = core_store.client;
        this.common = core_store.common;
        this.ui = core_store.ui;
        this.wallet_store = new WalletStore(this);
    }
}
