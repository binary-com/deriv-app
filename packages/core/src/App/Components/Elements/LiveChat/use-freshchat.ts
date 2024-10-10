import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

const useFreshChat = (token: string | null) => {
    const scriptStatus = useScript('https://static.deriv.com/scripts/freshchat.js');
    const [isReady, setIsReady] = useState(false);
    const language = localStorage.getItem('i18n_language') || 'EN';

    useEffect(() => {
        const checkFcWidget = (intervalId: NodeJS.Timeout) => {
            if (typeof window !== 'undefined') {
                // window.fcWidget.on('widget:loaded', () => {
                //     // eslint-disable-next-line no-console
                //     console.log('fc widget loaded');
                //     window.fcWidget?.user.setLocale(language.toLowerCase());
                //     setIsReady(true);
                //     clearInterval(intervalId);
                // });
                if (window.fcWidget?.isInitialized() == true && !isReady) {
                    // eslint-disable-next-line no-console
                    console.log('fc widget loaded');
                    window.fcWidget?.user.setLocale(language.toLowerCase());
                    // eslint-disable-next-line no-console
                    console.log('fc lang set to', language.toLowerCase());
                    setIsReady(true);
                    clearInterval(intervalId);
                }
            }
        };

        const initFreshChat = async () => {
            if (scriptStatus === 'ready' && window.FreshChat && window.fcSettings) {
                window.FreshChat.initialize({
                    token,
                    hideButton: true,
                });

                const intervalId = setInterval(() => checkFcWidget(intervalId), 500);

                return () => clearInterval(intervalId); // Cleanup interval on unmount or script change
            }
        };

        initFreshChat();
    }, [isReady, language, scriptStatus, token]);

    return {
        isReady,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
