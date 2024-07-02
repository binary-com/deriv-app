import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon, MobileFullPageModal, ThemedScrollbars } from '@deriv/components';
import { routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import PageReturn from 'Components/page-return';
import { useStores } from 'Stores';
import OrderDetailsFooter from 'Components/order-details/order-details-footer.jsx';

const OrderDetailsWrapper = ({ children, page_title }) => {
    const { isDesktop } = useDevice();
    const { order_store, sendbird_store } = useStores();
    const history = useHistory();

    const pageHeaderReturnHandler = () => {
        order_store.onPageReturn();

        if (order_store.should_navigate_to_buy_sell) {
            history.push(routes.p2p_buy_sell);
            order_store.setShouldNavigateToBuySell(false);
        }
    };

    return isDesktop ? (
        <React.Fragment>
            <PageReturn onClick={pageHeaderReturnHandler} page_title={page_title} />
            <ThemedScrollbars height='70vh'>{children}</ThemedScrollbars>
        </React.Fragment>
    ) : (
        <div data-testid='order-details-wrapper-mobile'>
            <MobileFullPageModal
                className='order-details'
                body_className='order-details__body'
                height_offset='80px'
                is_flex
                is_modal_open
                pageHeaderReturnFn={pageHeaderReturnHandler}
                page_header_text={page_title}
                renderPageHeaderTrailingIcon={() => (
                    <Icon
                        data_testid='testid'
                        icon='IcChat'
                        height={15}
                        width={16}
                        onClick={() => sendbird_store.setShouldShowChatModal(true)}
                    />
                )}
                renderPageFooterChildren={
                    order_store.order_information.should_show_order_footer
                        ? () => <OrderDetailsFooter order_information={order_store.order_information} />
                        : null
                }
            >
                {children}
            </MobileFullPageModal>
        </div>
    );
};

OrderDetailsWrapper.propTypes = {
    children: PropTypes.any,
    page_title: PropTypes.string,
};

export default OrderDetailsWrapper;
