import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, MobileFullPageModal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useStores } from 'Stores';
import OrderDetailsFooter from 'Components/order-details/order-details-footer.jsx';

const OrderDetailsWrapper = ({ children, onPageReturn, page_title }) => {
    const { order_store, sendbird_store } = useStores();

    return isMobile() ? (
        <MobileFullPageModal
            className='order-details'
            body_className='order-details--body'
            page_footer_className={classNames({
                'order-details--body-mobile-footer': order_store.order_information?.is_completed_order ?? false,
            })}
            height_offset='80px'
            is_flex
            is_modal_open
            pageHeaderReturnFn={onPageReturn}
            page_header_text={page_title}
            renderPageHeaderTrailingIcon={() => (
                <Icon
                    icon='IcChat'
                    height={15}
                    width={16}
                    onClick={() => sendbird_store.setShouldShowChatModal(true)}
                />
            )}
            renderPageFooterChildren={() => <OrderDetailsFooter order_information={order_store.order_information} />}
        >
            {children}
        </MobileFullPageModal>
    ) : (
        <React.Fragment>
            <PageReturn onClick={onPageReturn} page_title={page_title} />
            {children}
        </React.Fragment>
    );
};

OrderDetailsWrapper.propTypes = {
    children: PropTypes.any,
    onPageReturn: PropTypes.func,
    page_title: PropTypes.string,
};

export default OrderDetailsWrapper;
