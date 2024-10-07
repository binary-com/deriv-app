declare global {
    interface Window {
        clipboardData: DataTransfer;
        LiveChatWidget: {
            init: () => void;
            on: (key: string, callback: VoidFunction) => void;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            get: (key: string) => any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            call: (key: string, value?: any) => void;
        };
        LC_API: {
            on_chat_ended: VoidFunction;
            open_chat_window: VoidFunction;
        };
        TrackJS: { console: { log: (arg0: unknown[]) => void }; track: (arg0: object) => void };
        Blockly;
        Onfido: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            init: (args: any) => any;
        };
        DD_RUM: object | undefined;
        dataLayer: object[];
    }
}

export {};
