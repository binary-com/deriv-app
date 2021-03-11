import { init } from '@livechat/customer-sdk';
import { removeCookies, livechat_client_id, livechat_license_id } from '@deriv/shared';
import SocketCache from '_common/base/socket_cache';
import WS from './ws-methods';

export const requestLogout = () => WS.logout().then(doLogout);

function endChat() {
    const session_variables = {
        loginid: '',
        landing_company_shortcode: '',
        currency: '',
        residence: '',
        email: '',
    };
    const customerSDK = init({
        licenseId: livechat_license_id,
        clientId: livechat_client_id,
    });

    window.LiveChatWidget.call('set_session_variables', session_variables);
    window.LiveChatWidget.call('set_customer_email', ' ');
    window.LiveChatWidget.call('set_customer_name', ' ');

    customerSDK.on('connected', () => {
        /* eslint-disable no-console */
        console.log('livechat:', !!window.LiveChatWidget._h);
        if (!!window.LiveChatWidget._h && window.LiveChatWidget.get('chat_data')) {
            const { chatId, threadId } = window.LiveChatWidget.get('chat_data');
            /* eslint-disable no-console */
            console.log('liveChat::', chatId, threadId);
            if (threadId) {
                customerSDK.deactivateChat({ chatId });
            }
        }
    });
}

const doLogout = response => {
    if (response.logout !== 1) return undefined;
    removeCookies('affiliate_token', 'affiliate_tracking', 'onfido_token');
    SocketCache.clear();
    sessionStorage.clear();
    endChat();
    return response;
};
