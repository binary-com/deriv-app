import React from 'react';
import { Text } from '@deriv/components';
import PropTypes from 'prop-types';
import ChatMessage from 'Utils/chat-message';

const ChatMessageText = React.memo(({ children, color, type = '' }) => (
    <div className={`order-chat__messages-item-message`}>
        <Text
            as='p'
            color={color}
            line_height={type === ChatMessage.TYPE_ADMIN ? 'xl' : 'm'}
            size={type === ChatMessage.TYPE_ADMIN ? 'xxs' : 'xs'}
        >
            {children}
        </Text>
    </div>
));

ChatMessageText.displayName = 'ChatMessageText';
ChatMessageText.propTypes = {
    children: PropTypes.any,
    color: PropTypes.string,
    type: PropTypes.string,
};

export default ChatMessageText;
