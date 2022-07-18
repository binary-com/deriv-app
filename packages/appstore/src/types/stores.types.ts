import ConfigStore from 'Stores/config-store';
import WalletStore from 'Stores/wallet-store';

export type TRootStore = {
    ui: Record<string, any>;
    client: Record<string, any>;
    config: ConfigStore;
    wallet_store: WalletStore;
};
