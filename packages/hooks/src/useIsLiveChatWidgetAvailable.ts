import { useEffect, useState } from 'react';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

const useIsLiveChatWidgetAvailable = () => {
    const [is_livechat_available, setIsLivechatAvailable] = useState(false);

    const [enable_freshworks_live_chat, isGBLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_freshworks_live_chat',
        defaultValue: true,
    });

    useEffect(() => {
        if (/*isGBLoaded && */ enable_freshworks_live_chat && !is_livechat_available) {
            const intervalId = setInterval(() => {
                if (window.fcWidget?.isLoaded()) {
                    setIsLivechatAvailable(true);

                    if (!window.LiveChatWidget) window.LiveChatWidget = {} as any;
                    window.LiveChatWidget.call = (method: string) => {
                        if (method === 'maximize') return window.fcWidget?.open();
                        if (method === 'minimize') return window.fcWidget?.close();
                        if (method === 'hide') return window.fcWidget?.hide();
                        if (method === 'destroy') return window.fcWidget?.destroy();
                    };
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
        window.LiveChatWidget.on('ready', data => {
            if (data.state.availability === 'online' && !is_livechat_available) setIsLivechatAvailable(true);
        });
    }, [is_livechat_available]);

    return {
        is_livechat_available,
    };
};

export default useIsLiveChatWidgetAvailable;
