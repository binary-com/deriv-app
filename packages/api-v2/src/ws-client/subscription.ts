import request from './request';
import {
    TSocketResponse,
    TSocketRequestPayload,
    TSocketSubscribableEndpointNames,
    TSocketError,
    TSocketResponseData,
} from '../../types';

/**
 * Subscribes directly to backend stream
 * WARNING: it does not check for dubplicates, its just
 */
export default class Subscription {
    ws: WebSocket;
    name: TSocketSubscribableEndpointNames;
    payload: TSocketRequestPayload<TSocketSubscribableEndpointNames>['payload'];

    reqId: number | null;
    subscriptionId: string | null;

    lastData: TSocketResponse<TSocketSubscribableEndpointNames> | null;

    boundOnWsMessage: (messageEvent: MessageEvent) => void;
    boundOnWsClose: () => void;

    listeners: Array<(data: TSocketResponse<TSocketSubscribableEndpointNames>) => void>;

    constructor(
        ws: WebSocket,
        name: TSocketSubscribableEndpointNames,
        payload: TSocketRequestPayload<TSocketSubscribableEndpointNames>['payload']
    ) {
        this.ws = ws;
        this.name = name;
        this.payload = payload;

        this.reqId = null;
        this.subscriptionId = null;

        this.lastData = null;

        this.boundOnWsMessage = this.onWsMessage.bind(this);
        this.boundOnWsClose = this.onWsClose.bind(this);

        this.listeners = [];
    }

    async unsubscribe() {
        this.ws.removeEventListener('message', this.boundOnWsMessage);
        this.ws.removeEventListener('close', this.boundOnWsClose);
        await request(this.ws, 'forget', { forget: this.subscriptionId });
    }

    onWsClose() {
        this.ws.removeEventListener('message', this.boundOnWsMessage);
        this.ws.removeEventListener('close', this.boundOnWsClose);
    }

    async subscribe() {
        this.ws.addEventListener('message', this.boundOnWsMessage);
        this.ws.addEventListener('close', this.boundOnWsClose);

        const data: TSocketResponseData<TSocketSubscribableEndpointNames> = await request(this.ws, this.name, {
            subscribe: 1,
            ...this.payload,
        });

        // @ts-expect-error due to incorrect type defintion, to be fixed later
        this.reqId = data.req_id;
        // @ts-expect-error due to incorrect type definition, to be fixed later
        this.subscriptionId = data.subscription.id;
        this.lastData = data;

        this.listeners.forEach(listener => listener(data));
    }

    addListener(onData: (data: TSocketResponse<TSocketSubscribableEndpointNames>) => void) {
        this.listeners.push(onData);
    }

    removeListener(onData: (data: TSocketResponse<TSocketSubscribableEndpointNames>) => void) {
        this.listeners = this.listeners.filter(listener => listener !== onData);
    }

    onWsMessage<T extends TSocketSubscribableEndpointNames>(messageEvent: MessageEvent) {
        const data = JSON.parse(messageEvent.data) as TSocketResponse<T> & TSocketError<T>;

        if (data.req_id !== this.reqId) {
            return;
        }

        this.lastData = data;
        this.listeners.forEach(listener => listener(data));
    }
}
