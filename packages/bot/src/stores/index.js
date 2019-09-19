import FlyoutStore      from './flyout-store';
import ScratchStore     from './scratch-store';
import ToolbarStore     from './toolbar-store';
import AnimationStore   from './animation-store';

export default class RootStore {
    constructor(core, ws) {
        this.core = core;
        this.ws = ws;
        this.flyout = new FlyoutStore();
        this.animation = new AnimationStore();
        this.toolbar = new ToolbarStore(this);

        // Create a singleton class to share rootStore with scratch
        ScratchStore.setInstance(this);
    }
}
