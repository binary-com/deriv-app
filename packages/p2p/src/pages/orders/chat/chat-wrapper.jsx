import React from 'react';
import { MobileFullPageModal } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { useStores } from 'Stores';
import ChatHeader from './chat-header.jsx';

const ChatWrapper = observer(({ children, is_modal_open }) => {
    const { sendbird_store, order_store } = useStores();
    const { isDesktop } = useDevice();

    return !isDesktop ? (
        <MobileFullPageModal
            className='chat'
            height_offset='80px'
            is_flex
            is_modal_open={is_modal_open}
            page_header_className='chat__header'
            pageHeaderReturnFn={() => {
                sendbird_store.setShouldShowChatModal(false);
                sendbird_store.setShouldShowChatOnOrders(false);
                order_store.should_navigate_to_order_details && order_store.hideDetails(true);
                order_store.setShouldNavigateToOrderDetails(false);
            }}
            renderPageHeaderElement={<ChatHeader.Body />}
        >
            {children}
        </MobileFullPageModal>
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );
});

ChatWrapper.propTypes = {
    children: PropTypes.any,
    is_modal_open: PropTypes.bool,
};

export default ChatWrapper;
