import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { URLUtils } from '@deriv-com/utils';
import { useRemoteConfig } from '@deriv/api';

type TLiveChatClientInformation = {
    is_client_store_initialized: boolean;
    is_logged_in: boolean;
    loginid?: string;
    landing_company_shortcode?: string;
    currency?: string;
    residence?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
};

const useLiveChat = (client_information: TLiveChatClientInformation) => {
    const {
        is_client_store_initialized,
        landing_company_shortcode = ' ',
        currency = ' ',
        email = ' ',
        is_logged_in = ' ',
        loginid = ' ',
        residence = ' ',
        last_name = ' ',
        first_name = ' ',
    } = client_information;

    const url_query_string = window.location.search;
    const url_params = new URLSearchParams(url_query_string);
    const reset_password = URLUtils.getQueryParameter('action') === 'reset_password';
    const should_disable_livechat = url_params.get('code') && reset_password;

    const { data } = useRemoteConfig(true);
    const { cs_chat_livechat } = data;

    useEffect(() => {
        if (is_client_store_initialized && cs_chat_livechat) {
            window.LiveChatWidget.init();
        }
    }, [is_client_store_initialized, cs_chat_livechat]);

    useEffect(() => {
        if (!should_disable_livechat && is_client_store_initialized) {
            window.LiveChatWidget?.on('ready', data => {
                //hide red widget on responsive
                if (data.state.visibility === 'minimized') {
                    window.LiveChatWidget?.call('hide');
                }
                const utm_data = JSON.parse(Cookies.get('utm_data') || '{}');
                const { utm_source, utm_medium, utm_campaign } = utm_data;

                const session_variables = {
                    is_logged_in: String(is_logged_in),
                    utm_source: utm_source || ' ',
                    utm_medium: utm_medium || ' ',
                    utm_campaign: utm_campaign || ' ',
                    loginid: is_logged_in ? loginid : ' ',
                    landing_company_shortcode: is_logged_in ? landing_company_shortcode : ' ',
                    currency: is_logged_in ? currency : ' ',
                    residence: is_logged_in ? residence : ' ',
                    email: is_logged_in ? email : ' ',
                };

                window.LiveChatWidget?.call('set_session_variables', session_variables);

                if (is_logged_in) {
                    window.LiveChatWidget?.call('set_customer_email', email);
                    window.LiveChatWidget?.call('set_customer_name', `${first_name} ${last_name}`);
                } else {
                    window.LiveChatWidget?.call('set_customer_email', ' ');
                    window.LiveChatWidget?.call('set_customer_name', ' ');
                }
            });
        }
    }, [
        email,
        should_disable_livechat,
        loginid,
        is_logged_in,
        landing_company_shortcode,
        is_client_store_initialized,
        currency,
        first_name,
        last_name,
        residence,
    ]);
};

export default useLiveChat;
