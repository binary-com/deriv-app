import React from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { connect } from 'Stores/connect';
import { Popover, Icon } from '@deriv/components';
import { deriv_urls } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { liveChatInitialization } from './live-chat';

const LiveChat = ({ is_mobile_drawer, has_cookie_account }) => {
    const [is_livechat_interactive, setLiveChatInteractive] = React.useState(false);
    const [reload, setReload] = React.useState(false);
    const history = useHistory();

    React.useEffect(() => {
        history.listen(handleHistoryChange);
        if (window.LiveChatWidget) {
            window.LiveChatWidget.on('ready', () => {
                setLiveChatInteractive(true);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (has_cookie_account) {
            liveChatSetup(true);
        } else {
            liveChatSetup(false);
        }
    }, [has_cookie_account]);

    React.useEffect(() => {
        if (reload === true) {
            if (has_cookie_account) {
                liveChatSetup(true);
            } else {
                liveChatSetup(false);
            }
            setReload(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]);

    const liveChatSetup = is_logged_in => {
        if (window.LiveChatWidget) {
            window.LiveChatWidget.on('ready', () => {
                let client_first_name = '';
                let client_last_name = '';
                const domain = window.location.hostname.includes('deriv') ? deriv_urls.DERIV_HOST_NAME : 'binary.sx';
                const client_information = Cookies.getJSON('client_information', {
                    domain,
                });
                const utm_data = Cookies.getJSON('utm_data', { domain });

                const { utm_source, utm_medium, utm_campaign } = utm_data || {};

                const { loginid, email, landing_company_shortcode, currency, residence, first_name, last_name } =
                    client_information || {};

                client_first_name = first_name ?? ' ';
                client_last_name = last_name ?? ' ';

                /* the session variables are sent to CS team dashboard to notify user has logged in
                and also acts as custom variables to trigger targeted engagement */
                const session_variables = {
                    is_logged_in: !!is_logged_in,
                    loginid: loginid ?? '',
                    landing_company_shortcode: landing_company_shortcode ?? '',
                    currency: currency ?? '',
                    residence: residence ?? '',
                    email: email ?? ' ',
                    utm_source: utm_source ?? '',
                    utm_medium: utm_medium ?? '',
                    utm_campaign: utm_campaign ?? '',
                };
                window.LiveChatWidget.call('set_session_variables', session_variables);

                if (is_logged_in) {
                    // client logged in
                    // prepfill name and email
                    window.LiveChatWidget.call('set_customer_email', session_variables.email);
                    window.LiveChatWidget.call('set_customer_name', `${client_first_name} ${client_last_name}`);

                    // prefill name and email fields after chat has ended
                    window.LC_API.on_chat_ended = () => {
                        window.LiveChatWidget.call('set_customer_email', session_variables.email);
                        window.LiveChatWidget.call('set_customer_name', `${client_first_name} ${client_last_name}`);
                    };
                } else {
                    // client not logged in
                    // clear name and email fields
                    window.LiveChatWidget.call('set_customer_email', ' ');
                    window.LiveChatWidget.call('set_customer_name', ' ');
                    // clear name and email fields after chat has ended
                    window.LC_API.on_chat_ended = () => {
                        window.LiveChatWidget.call('set_customer_email', ' ');
                        window.LiveChatWidget.call('set_customer_name', ' ');
                    };
                }
            });
        }
    };

    const livechatDeletion = () =>
        new Promise(resolve => {
            if (window.LiveChatWidget) {
                window.LiveChatWidget.on('ready', () => {
                    try {
                        if (window.LiveChatWidget.get('customer_data').status !== 'chatting') {
                            window.LiveChatWidget.call('destroy');
                            resolve();
                        }
                    } catch (e) {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });

    const handleHistoryChange = () => {
        livechatDeletion().then(() => {
            liveChatInitialization().then(() => {
                setReload(true);
                setLiveChatInteractive(true);
                setReload(false);
            });
        });
    };

    return (
        <React.Fragment>
            {is_livechat_interactive && (
                <React.Fragment>
                    {is_mobile_drawer ? (
                        <div
                            className='livechat gtm-deriv-livechat'
                            onClick={() => {
                                window.LiveChatWidget.call('maximize');
                            }}
                        >
                            <div className='livechat__icon-wrapper'>
                                <Icon icon='IcLiveChat' className='livechat__icon' />
                            </div>
                            <p className='livechat__title'>{localize('Live chat')}</p>
                        </div>
                    ) : (
                        <div
                            onClick={() => {
                                window.LiveChatWidget.call('maximize');
                            }}
                        >
                            <Popover
                                className='footer__link'
                                classNameBubble='help-centre__tooltip'
                                alignment='top'
                                message={localize('Live chat')}
                            >
                                <Icon icon='IcLiveChat' className='footer__icon gtm-deriv-livechat' />
                            </Popover>
                        </div>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default connect(({ client }) => ({
    has_cookie_account: client.has_cookie_account,
}))(LiveChat);
