type TLiveChatState = { availability: 'online' | 'offline'; visibility: 'maximized' | 'minimized' | 'hidden' };
type TLiveChatChatData = { chatId: string; threadId: string };
type TLiveChatCustomerData = {
    id: string;
    name: string;
    email: string;
    isReturning: boolean;
    status: 'queued' | 'chatting' | 'browsing' | 'invited';
    sessionVariables: Record<string, string>;
};
type TLiveChatGetResponse = {
    state: TLiveChatState;
    customer_data: TLiveChatCustomerData;
    chat_data: TLiveChatChatData;
};
type TLiveChatGetKeys = 'state' | 'customer_data' | 'chat_data';
type TLiveChatCallKeys =
    | 'maximize'
    | 'minimize'
    | 'hide'
    | 'destroy'
    | 'hide_greeting'
    | 'set_session_variables'
    | 'update_session_variables'
    | 'set_customer_name'
    | 'set_customer_email';

export type TLiveChatWidget = {
    init: () => void;
    on: (key: string, callback: (data: { customerData: TLiveChatCustomerData; state: TLiveChatState }) => void) => void;
    get: <T extends TLiveChatGetKeys>(key: T) => TLiveChatGetResponse[T];
    call: (key: TLiveChatCallKeys, value?: string | Record<string, string>) => void;
};
