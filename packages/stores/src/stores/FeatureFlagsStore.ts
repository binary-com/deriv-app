import BaseStore from './BaseStore';

const FLAGS = {
    wallet: false,
    next_wallet: false,
    sharkfin: false,
    p2p_v2: false,
} satisfies Record<string, boolean>;

export default class FeatureFlagsStore extends BaseStore<{ [k in keyof typeof FLAGS]: boolean }> {
    constructor() {
        super('FeatureFlagsStore', () => {
            // Set the default values for the first time.
            if (!this.data) this.update(FLAGS);

            // Update the store data if a new flag was added or removed.
            if (this.data && Object.keys(this.data).length !== Object.keys(FLAGS).length) {
                this.update(old => {
                    const data = FLAGS;

                    Object.keys(FLAGS).forEach(flag => {
                        // @ts-expect-error flag key is always present in the object, Hence can ignore the TS error.
                        if (old[flag] !== undefined) data[flag] = old[flag];
                    });

                    return data;
                });
            }
        });

        this.data = FLAGS;
    }
}
