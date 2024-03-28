import React from 'react';
import { FullPageMobileWrapper, LightDivider } from '@/components';
import { useExtendedOrderDetails, useSendbird } from '@/hooks';
import { Loader, useDevice } from '@deriv-com/ui';
import { ChatError, ChatFooter, ChatHeader, ChatMessages } from '../../components';
import './OrdersChatSection.scss';

type TOrdersChatSectionProps = {
    id: string;
    isInactive: boolean;
    onReturn?: () => void;
    otherUserDetails: ReturnType<typeof useExtendedOrderDetails>['data']['otherUserDetails'];
};

const OrdersChatSection = ({ id, isInactive, onReturn, otherUserDetails }: TOrdersChatSectionProps) => {
    const { isMobile } = useDevice();
    const { is_online: isOnline, last_online_time: lastOnlineTime, name } = otherUserDetails ?? {};
    const { activeChatChannel, isChatLoading, isError, messages, refreshChat, sendFile, sendMessage, userId } =
        useSendbird(id);

    if (isError) {
        return (
            <div className='p2p-v2-orders-chat-section flex flex-col justify-center items-center h-[70vh]'>
                <ChatError onClickRetry={refreshChat} />
            </div>
        );
    }

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className='p2p-v2-orders-chat-section__full-page'
                //TODO: handle goback based on route
                onBack={onReturn}
                renderFooter={() => (
                    <ChatFooter
                        isClosed={isInactive || !!activeChatChannel?.isFrozen}
                        sendFile={sendFile}
                        sendMessage={sendMessage}
                    />
                )}
                renderHeader={() => <ChatHeader isOnline={isOnline} lastOnlineTime={lastOnlineTime} nickname={name} />}
            >
                {isChatLoading ? (
                    <Loader isFullScreen={false} />
                ) : (
                    <ChatMessages chatChannel={activeChatChannel} chatMessages={messages} userId={userId} />
                )}
            </FullPageMobileWrapper>
        );
    }
    return (
        <div className='p2p-v2-orders-chat-section flex flex-col justify-center items-center h-[70vh]'>
            {isChatLoading ? (
                <Loader isFullScreen={false} />
            ) : (
                <>
                    <ChatHeader isOnline={isOnline} lastOnlineTime={lastOnlineTime} nickname={name} />
                    <LightDivider className='w-full' />
                    <ChatMessages chatChannel={activeChatChannel} chatMessages={messages} userId={userId} />
                    <LightDivider className='w-full' />
                    <ChatFooter
                        isClosed={!!otherUserDetails?.isInactive || !!activeChatChannel?.isFrozen}
                        sendFile={sendFile}
                        sendMessage={sendMessage}
                    />
                </>
            )}
        </div>
    );
};

export default OrdersChatSection;
