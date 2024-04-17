import _ from 'lodash';
import BackendSubscription from './subscription';
import { TSocketResponse, TSocketRequestPayload, TSocketSubscribableEndpointNames } from '../../types';
import { getQueryKeys } from '../utils';

export default class SubscriptionsManager {
    backendSubscriptions: Map<string, BackendSubscription> = new Map();
    ws: WebSocket;

    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    async subscribe(
        name: TSocketSubscribableEndpointNames,
        payload: TSocketRequestPayload<TSocketSubscribableEndpointNames>['payload'],
        onData: (data: TSocketResponse<TSocketSubscribableEndpointNames>) => void
    ) {
        const keys: Array<string> = getQueryKeys(name, payload); // potentially switch to separate function, which just returns primitive values (string)
        const key = keys.join('-'); // but until then, use "join" to conver array of specifci structre to just string (no idea why its overcomplicated on first place)

        let backendSubscription: BackendSubscription | undefined;

        if (!this.backendSubscriptions.has(key)) {
            backendSubscription = new BackendSubscription(this.ws, name, payload);
            this.backendSubscriptions.set(key, backendSubscription);

            await backendSubscription.subscribe();
        }

        backendSubscription = this.backendSubscriptions.get(key);
        backendSubscription?.addListener(onData);

        if (backendSubscription?.lastData) {
            onData(backendSubscription.lastData);
        }

        return {
            unsubscribe: async () => {
                // find and remove listener
                backendSubscription?.removeListener(onData);

                // if no more listeners,
                //   - unsubscribe from backend
                //   - remove from BEsubscriptionsByKey
                if (backendSubscription?.listeners.length === 0) {
                    this.backendSubscriptions.delete(key);

                    await backendSubscription.unsubscribe();
                }
            },
        };
    }
}
