import { Popover, Icon, Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { Localize } from '@deriv/translations';
import { useIsLiveChatWidgetAvailable } from '@deriv/hooks';

const LiveChat = ({ showPopover }: { showPopover?: boolean }) => {
    const { isDesktop } = useDevice();
    const { is_livechat_available } = useIsLiveChatWidgetAvailable();
    const liveChatClickHandler = () => window.LiveChatWidget.call('maximize');

    if (!is_livechat_available) return null;

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
};

export default LiveChat;
