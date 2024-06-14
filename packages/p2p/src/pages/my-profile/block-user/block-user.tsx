import React from 'react';
import { reaction } from 'mobx';
import { DesktopWrapper, MobileFullPageModal, MobileOrTabletWrapper } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { api_error_codes } from 'Constants/api-error-codes';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import { getErrorMessage, getErrorModalTitle, getWidth } from 'Utils/block-user';
import BlockUserList from './block-user-list';

const BlockUser = () => {
    const { buy_sell_store, general_store, my_profile_store } = useStores();
    const { block_unblock_user_error, error_code } = general_store;
    const { is_blocked, name } = my_profile_store.selected_trade_partner;
    const { hideModal, showModal, useRegisterModalProps } = useModalManagerContext();
    const is_invalid_advertiser_id = error_code === api_error_codes.INVALID_ADVERTISER_ID;

    reaction(
        () => block_unblock_user_error,
        () => {
            if (
                block_unblock_user_error &&
                general_store.active_index === 3 &&
                !buy_sell_store.show_advertiser_page &&
                error_code !== api_error_codes.TEMPORARY_BAR &&
                error_code !== api_error_codes.PERMISSION_DENIED
            ) {
                showModal({
                    key: 'ErrorModal',
                    props: {
                        error_message: getErrorMessage(
                            block_unblock_user_error,
                            is_blocked,
                            is_invalid_advertiser_id,
                            name
                        ),
                        error_modal_button_text: localize('Got it'),
                        error_modal_title: getErrorModalTitle(is_invalid_advertiser_id, name),
                        has_close_icon: false,
                        onClose: () => {
                            general_store.setBlockUnblockUserError('');
                            hideModal();
                        },
                        width: getWidth(),
                    },
                });
                general_store.setBlockUnblockUserError(null);
            }
        },
        { fireImmediately: true }
    );

    useRegisterModalProps({
        key: 'BlockUserModal',
        props: {
            advertiser_name: name,
            is_advertiser_blocked: !!is_blocked,
            onCancel: hideModal,
            onSubmit: my_profile_store.onSubmit,
        },
    });

    return (
        <React.Fragment>
            <DesktopWrapper>
                <BlockUserList />
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <MobileFullPageModal
                    body_className='block-user__modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open={my_profile_store.active_tab === my_profile_tabs.MY_COUNTERPARTIES}
                    onClickClose={() => {
                        // do nothing
                    }}
                    page_header_className='buy-sell__modal-header'
                    page_header_text={localize('My counterparties')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                >
                    <BlockUserList />
                </MobileFullPageModal>
            </MobileOrTabletWrapper>
        </React.Fragment>
    );
};

export default observer(BlockUser);
