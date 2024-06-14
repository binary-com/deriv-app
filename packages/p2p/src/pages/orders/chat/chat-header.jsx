import React from 'react';
import { Text } from '@deriv/components';
import { isMobileOrTablet } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { OnlineStatusAvatar } from 'Components/online-status';
import { useStores } from 'Stores';
import { getLastOnlineLabel } from 'Utils/adverts';
import './chat-header.scss';

const ChatHeaderBody = observer(() => {
    const { order_store } = useStores();
    const { other_user_details } = order_store.order_information;
    const { is_online, last_online_time, name } = other_user_details;

    return (
        <React.Fragment>
            <div className='chat-header-icon'>
                <OnlineStatusAvatar is_online={is_online} nickname={name} size={40} text_size='s' />
            </div>
            <div className='chat-header-user'>
                <Text as='p' className='chat-header-user-name' color='prominent' weight='bold'>
                    {name}
                </Text>
                <Text
                    as='p'
                    className='chat-header-user-timestamp'
                    color='less-prominent'
                    size={isMobileOrTablet() ? 'xxs' : 'xs'}
                >
                    {getLastOnlineLabel(is_online, last_online_time)}
                </Text>
            </div>
        </React.Fragment>
    );
});

const ChatHeader = () => {
    if (isMobileOrTablet()) {
        return null; // Handled in chat-wrapper.jsx
    }

    return (
        <div className='chat-header'>
            <ChatHeaderBody />
        </div>
    );
};

ChatHeader.Body = ChatHeaderBody;
ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;
