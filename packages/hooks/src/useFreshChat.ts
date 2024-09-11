import { useStore } from '@deriv/stores';
import { useLayoutEffect } from 'react';
import { useScript } from 'usehooks-ts';

const useFreshChat = () => {
    useScript('https://fw-cdn.com/11706964/4344125.js');

    const { client } = useStore();
    const { getFreshworksToken, is_logged_in, loginid, email, account_settings, currency, residence, user_id } = client;

    const setDefaultSettings = () => {
        window.fcWidgetMessengerConfig = {
            config: {
                headerProperty: {
                    hideChatButton: true,
                },
            },
        };

        window.fcSettings = {
            onInit() {
                window.fcWidget.on('widget:loaded', async () => {
                    if (is_logged_in && loginid) {
                        let uuid = '';
                        try {
                            const res = await window.fcWidget.user.getUUID();
                            uuid = res.data.uuid;
                        } catch (error) {
                            // eslint-disable-next-line no-console
                            console.log('something wrong with UUID. Error = ', error);
                        }

                        const token = await getFreshworksToken({
                            freshchat_uuid: uuid,
                            user_id,
                            email,
                            first_name: account_settings.first_name ?? '',
                            last_name: account_settings.last_name ?? '',
                            loginid,
                            currency,
                            residence,
                        });
                        window.fcWidget.authenticate(token);
                        // window.fcWidget.user.setProperties({ cf_user_jwt: token });
                    }
                });
            },
        };
    };

    useLayoutEffect(() => {
        setDefaultSettings();
    }, []);
};

export default useFreshChat;
