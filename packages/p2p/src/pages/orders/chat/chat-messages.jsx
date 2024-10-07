import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Text, ThemedScrollbars, Icon } from '@deriv/components';
import { formatMilliseconds } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import ChatMessageReceipt from 'Pages/orders/chat/chat-message-receipt.jsx';
import ChatMessageText from 'Pages/orders/chat/chat-message-text.jsx';
import { useStores } from 'Stores';
import ChatMessage from 'Utils/chat-message';
import { convertToMB, isImageType, isPDFType } from 'Utils/file-uploader';
import './chat-messages.scss';

const AdminMessage = () => (
    <div className='chat-messages-item chat-messages-item--admin'>
        <ChatMessageText color='general' type='admin'>
            <div className='chat-messages-item--admin-text'>
                <Localize
                    i18n_default_text='<0>Important:</0> Deriv will never contact you via WhatsApp to ask for your personal information. Always ignore any messages from numbers claiming to be from Deriv.'
                    components={[<strong key={0} />]}
                />
            </div>
            <Localize
                i18n_default_text="<0>Note:</0> In case of a dispute, we'll use this chat as a reference."
                components={[<strong key={0} />]}
            />
        </ChatMessageText>
    </div>
);
const ChatMessages = observer(() => {
    const { sendbird_store } = useStores();
    const scroll_ref = React.useRef(null);

    const onImageLoad = event => {
        // Height of element changes after the image is loaded. Accommodate
        // this extra height in the scroll.
        if (scroll_ref.current) {
            scroll_ref.current.scrollTop += event.target.parentNode.clientHeight;
        }
    };

    React.useEffect(() => {
        sendbird_store.setMessagesRef(scroll_ref);
        if (sendbird_store.chat_messages.length > 0 && scroll_ref.current) {
            // Scroll all the way to the bottom of the container.
            scroll_ref.current.scrollTop = scroll_ref.current.scrollHeight;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (sendbird_store.chat_messages.length) {
        let current_date = null;

        const getMessageFormat = (chat_message, message_color) => {
            const { file_type, url, size, name } = chat_message ?? {};
            if (isImageType(file_type))
                return (
                    <a className='chat-messages-item-image' href={url} rel='noopener noreferrer' target='_blank'>
                        <img src={url} onLoad={onImageLoad} />
                    </a>
                );
            else if (isPDFType(file_type)) {
                return (
                    <ChatMessageText color={message_color}>
                        <div className='chat-messages-item-pdf'>
                            <Icon icon='IcPdf' data_testid='dt_pdf_icon' size={20} />
                            <a href={url} rel='noopener noreferrer' target='_blank'>
                                {name}
                            </a>
                        </div>
                        {`${convertToMB(size).toFixed(2)}MB`}
                    </ChatMessageText>
                );
            }
            return (
                <ChatMessageText color={message_color}>
                    <a className='chat-messages-item-file' href={url} rel='noopener noreferrer' target='_blank'>
                        {name}
                    </a>
                </ChatMessageText>
            );
        };

        return (
            <ThemedScrollbars
                autohide
                className='chat-messages'
                height='unset'
                refSetter={scroll_ref}
                onScroll={event => sendbird_store.onMessagesScroll(event)}
            >
                <React.Fragment>
                    <AdminMessage />
                    {sendbird_store.chat_messages.map(chat_message => {
                        const is_my_message = chat_message.sender_user_id === sendbird_store.chat_info.user_id;
                        const message_date = formatMilliseconds(chat_message.created_at, 'MMMM D, YYYY');
                        const message_color = is_my_message ? 'colored-background' : 'general';
                        const should_render_date =
                            current_date !== message_date && Boolean((current_date = message_date));

                        return (
                            <React.Fragment key={chat_message.id}>
                                {should_render_date && (
                                    <div className='chat-messages-date'>
                                        <Text align='center' color='less-prominent' lh='m' size='xs' weight='bold'>
                                            {message_date}
                                        </Text>
                                    </div>
                                )}
                                <div
                                    className={classNames(
                                        'chat-messages-item',
                                        `chat-messages-item--${is_my_message ? 'outgoing' : 'incoming'}`
                                    )}
                                >
                                    {chat_message.message_type === ChatMessage.TYPE_USER && (
                                        <ChatMessageText color={message_color} type={chat_message.custom_type}>
                                            {chat_message.message}
                                        </ChatMessageText>
                                    )}
                                    {chat_message.message_type === ChatMessage.TYPE_FILE &&
                                        getMessageFormat(chat_message, message_color)}
                                    <div className={'order-chat__messages-item-timestamp'}>
                                        <Text color='less-prominent' line_height='s' size='xxxs'>
                                            {formatMilliseconds(chat_message.created_at, 'HH:mm', true)}
                                        </Text>
                                        {is_my_message && (
                                            <ChatMessageReceipt
                                                message={chat_message}
                                                chat_channel={sendbird_store.active_chat_channel}
                                                sendbird_user_id={sendbird_store.chat_info.user_id}
                                            />
                                        )}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </React.Fragment>
            </ThemedScrollbars>
        );
    }

    return (
        <div className='chat-messages'>
            <AdminMessage />
        </div>
    );
});

ChatMessages.displayName = 'ChatMessages';
ChatMessages.propTypes = {
    active_chat_channel: PropTypes.object,
    chat_messages: PropTypes.number,
    chat_info: PropTypes.shape({
        app_id: PropTypes.string,
        user_id: PropTypes.string,
        token: PropTypes.string,
    }),
};

export default ChatMessages;
