declare global {
    interface Window {
        clipboardData: DataTransfer;
        LiveChatWidget: {
            init: () => void;
            on: (key: string, callback: VoidFunction) => void;
            get: (key: string) => any;
            call: (key: string, value?: any) => void;
        };
        LC_API: {
            on_chat_ended: VoidFunction;
            open_chat_window: VoidFunction;
        };
        TrackJS: { console: { log: (arg0: unknown[]) => void }; track: (arg0: object) => void };
        Blockly;
        Onfido: {
            init: (args: any) => any;
        };
        DD_RUM: object | undefined;
        fcWidget: {
            show: VoidFunction;
            hide: VoidFunction;
            open: VoidFunction;
            on: (key: string, callback: VoidFunction) => void;
            setConfig: (config: Record<string, Record<string, any>>) => void;
            isLoaded: () => boolean;
        };
        fcWidgetMessengerConfig: {
            config: Record<string, Record<string, any>>;
        };
        fcSettings: {
            [key: string]: any;
        };
        FreshChat: {
            initialize: (config: FreshChatConfig) => void;
        };
    }
    interface FreshChatConfig {
        token: string | null;
        locale: string;
        hideButton?: boolean;
    }
}

export {};
