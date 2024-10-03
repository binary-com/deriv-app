import { useStore } from '@deriv/stores';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

const useFreshChat = () => {
    const scriptStatus = useScript('https://static.deriv.com/scripts/freshchat-temp.js');
    const [isReady, setIsReady] = useState(false);

    const { client } = useStore();
    const { loginid, accounts } = client;
    const active_account = accounts?.[loginid ?? ''];
    const token = active_account ? active_account.token : null;

    useEffect(() => {
        const initFreshChat = async () => {
            if (scriptStatus === 'ready') {
                if (window.FreshChat && window.fcSettings) {
                    window.FreshChat.initialize({
                        token,
                        locale: 'en',
                        hideButton: true,
                    });
                    window.fcSettings = {
                        onInit() {
                            window.fcWidget.on('widget:loaded', () => {
                                // eslint-disable-next-line no-console
                                console.log('widget loaded');
                                setIsReady(true);
                            });
                        },
                    };
                }
            }
        };
        initFreshChat();
    }, [scriptStatus, token]);

    return {
        isReady,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
