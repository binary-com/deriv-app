import GeneralStore from './general-store';
import BaseStore from './base-store';

export default class CashierStore extends BaseStore {
    constructor({ root_store, WS }) {
        super({ root_store });
        this.WS = WS;

        this.general = new GeneralStore({
            root_store: this.root_store,
            WS: this.WS,
        });
    }
}
