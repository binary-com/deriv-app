import React, { useEffect } from 'react';
import { Popover, Icon, Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat';
import useFreshChat from 'App/Components/Elements/LiveChat/use-freshchat';

const LiveChat = observer(({ showPopover }: { showPopover?: boolean }) => {
    const { client } = useStore();
    const { has_cookie_account, loginid, accounts } = client;
    const { isDesktop } = useDevice();

    const active_account = accounts?.[loginid ?? ''];
    const token = active_account ? active_account.token : null;
    // const language = localStorage.getItem('i18n_language')?.toLowerCase() || 'en';

    const liveChat = useLiveChat(has_cookie_account, loginid);
    const freshChat = useFreshChat(token);

    const [enable_freshworks_live_chat] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_freshworks_live_chat',
        defaultValue: true,
    });

    const chat = enable_freshworks_live_chat ? freshChat : liveChat;
    // useEffect(() => {
    //     //chat is ready
    // }, [chat.isReady]);

    if (!chat.isReady) return null;

    const liveChatClickHandler = () => {
        enable_freshworks_live_chat ? freshChat.widget.open() : liveChat.widget?.call('maximize');
    };

    if (isDesktop)
        return (
            <div onKeyDown={liveChatClickHandler} onClick={liveChatClickHandler}>
                {showPopover ? (
                    <Popover
                        className='footer__link'
                        classNameBubble='help-centre__tooltip'
                        alignment='top'
                        message={<Localize i18n_default_text='Live chat' />}
                        zIndex='9999'
                    >
                        <Icon icon='IcLiveChat' className='footer__icon gtm-deriv-livechat' />
                    </Popover>
                ) : (
                    <div className='footer__link'>
                        <Icon icon='IcLiveChat' className='footer__icon gtm-deriv-livechat' />
                    </div>
                )}
            </div>
        );

    return (
        <div className='livechat gtm-deriv-livechat' onKeyDown={liveChatClickHandler} onClick={liveChatClickHandler}>
            <div className='livechat__icon-wrapper'>
                <Icon icon='IcLiveChat' className='livechat__icon' />
            </div>
            <Text size='xs'>
                <Localize i18n_default_text='Live chat' />
            </Text>
        </div>
    );
});

export default LiveChat;
