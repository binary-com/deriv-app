import BotStore    from './bot-store';
import FlyoutStore from './flyout-store';

// Single instance so we can use it outside React.
export const flyout = new FlyoutStore();

export default class RootStore {
    constructor(core, ws) {
        this.bot = new BotStore();
        this.flyout = flyout;
        this.core = core;
        this.ws = ws;
    }
}
