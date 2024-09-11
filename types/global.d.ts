import { TLiveChatWidget } from './livechat';

declare global {
    interface Window {
        clipboardData: DataTransfer;
        LiveChatWidget: TLiveChatWidget;
        TrackJS: { console: { log: (arg0: unknown[]) => void }; track: (arg0: object) => void };
        Blockly;
        Onfido: {
            init: (args: any) => any;
        };
        DD_RUM: object | undefined;
        fcWidget: {
            user: {
                setProperties: (values) => void;
                getUUID: () => Promise<Record<string, any>>;
            };
            show: VoidFunction;
            hide: VoidFunction;
            open: VoidFunction;
            destroy: VoidFunction;
            close: VoidFunction;
            on: (key: string, callback: VoidFunction) => void;
            setConfig: (config: Record<string, Record<string, any>>) => void;
            isLoaded: () => boolean;
            authenticate: (token: string) => void;
        };
        fcWidgetMessengerConfig: {
            config?: Record<string, Record<string, any>>;
            jwtAuthToken?: string;
        };
        fcSettings: {
            [key: string]: any;
        };
    }
}

export {};
