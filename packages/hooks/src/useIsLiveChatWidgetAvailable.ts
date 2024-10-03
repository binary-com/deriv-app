import { useEffect, useState } from 'react';

const useIsLiveChatWidgetAvailable = () => {
    const [is_livechat_available, setIsLivechatAvailable] = useState(false);

    useEffect(() => {
        window.LiveChatWidget.on('ready', data => {
            if (data.state.availability === 'online') setIsLivechatAvailable(true);
        });
    }, []);

    return {
        is_livechat_available,
    };
};

export default useIsLiveChatWidgetAvailable;
