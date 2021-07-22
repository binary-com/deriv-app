import PropTypes from 'prop-types';
import React from 'react';
import SuccessDialog from 'App/Containers/Modals/success-dialog.jsx';
import { Icon, Modal, Button, Money, Text } from '@deriv/components';
import { getCFDPlatformLabel } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getTopUpConfig } from '../Helpers/constants';

const CFDTopUpDemoModal = ({
    dxtrade_companies,
    mt5_companies,
    current_account,
    closeSuccessTopUpModal,
    closeTopUpModal,
    is_top_up_virtual_open,
    is_top_up_virtual_in_progress,
    is_top_up_virtual_success,
    platform,
    topUpVirtual,
}) => {
    const getAccountTitle = React.useCallback(() => {
        if ((!mt5_companies && !dxtrade_companies) || !current_account) return '';
        return mt5_companies[current_account.category][current_account.type].title;
    }, [mt5_companies, dxtrade_companies, current_account]);

    const onCloseSuccess = () => {
        closeSuccessTopUpModal();
    };

    const platform_title = getCFDPlatformLabel(platform);

    if ((!mt5_companies && !dxtrade_companies) || !current_account) return null;

    const { currency, minimum_amount, additional_amount } = getTopUpConfig();

    return (
        <React.Fragment>
            <Modal
                toggleModal={closeTopUpModal}
                is_open={is_top_up_virtual_open}
                className='top-up-virtual'
                title={localize('Fund top up')}
                width='384px'
            >
                <div className='dc-modal__container_top-up-virtual__body'>
                    <Text
                        as='p'
                        align='center'
                        size='xxs'
                        line_height='xs'
                        className='dc-modal__container_top-up-virtual__description'
                    >
                        <Localize
                            i18n_default_text='You can top up your demo account with an additional <0></0> if your balance is <1></1> or less.'
                            components={[
                                <Money key={0} amount={additional_amount} currency={currency} show_currency />,
                                <Money key={1} amount={minimum_amount} currency={currency} show_currency />,
                            ]}
                        />
                    </Text>
                    <h4 className='dc-modal__container_top-up-virtual--h4'>
                        <Localize
                            i18n_default_text='{{ platform }} {{ account_title }} account'
                            values={{
                                platform: platform_title,
                                account_title: getAccountTitle(),
                            }}
                        />
                    </h4>
                    <div>
                        <Text as='p' align='center' size='xxs'>
                            <Localize i18n_default_text='Current balance' />
                        </Text>
                        <div className='dc-modal__container_top-up-virtual--balance'>
                            <Money
                                amount={current_account.display_balance}
                                currency={current_account.currency}
                                has_sign={current_account.balance < 0}
                            />
                        </div>
                    </div>
                    <div className='dc-modal__container_top-up-virtual--button'>
                        <Button
                            is_disabled={current_account.balance > 1000 || is_top_up_virtual_in_progress}
                            type='button'
                            is_loading={is_top_up_virtual_in_progress}
                            onClick={() => topUpVirtual(platform)}
                            primary
                            large
                        >
                            {!is_top_up_virtual_in_progress && (
                                <Localize
                                    i18n_default_text='Top up &nbsp;<0></0>'
                                    components={[
                                        <Money key={0} amount={additional_amount} currency={currency} show_currency />,
                                    ]}
                                />
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
            <SuccessDialog
                is_open={is_top_up_virtual_success}
                toggleModal={onCloseSuccess}
                has_close_icon
                title={localize('Fund top up')}
                icon={<Icon icon='IcCashierWallet' size={128} />}
                heading={
                    <h3 className='cfd-success-topup__heading'>
                        <Localize
                            i18n_default_text='<0></0> has been credited into your {{platform}} {{title}} account.'
                            values={{ platform: platform_title, title: getAccountTitle() }}
                            components={[
                                <Money key={0} amount={additional_amount} currency={currency} show_currency />,
                            ]}
                        />
                    </h3>
                }
                message={
                    <div className='cfd-success-topup__description'>
                        <p>
                            <Localize i18n_default_text='New current balance' />
                        </p>
                        <div className='dc-modal__container_top-up-virtual--balance'>
                            <Money amount={current_account.balance} currency={current_account.currency} />
                        </div>
                    </div>
                }
                icon_size='large'
                has_cancel={false}
                has_submit={false}
                width='384px'
            />
        </React.Fragment>
    );
};

CFDTopUpDemoModal.propTypes = {
    account_title: PropTypes.string,
    closeSuccessTopUpModal: PropTypes.func,
    closeTopUpVirtual: PropTypes.func,
    currency: PropTypes.string,
    display_balance: PropTypes.string,
    is_top_up_virtual_open: PropTypes.bool,
    is_top_up_virtual_in_progress: PropTypes.bool,
    is_top_up_virtual_success: PropTypes.bool,
    topUpVirtual: PropTypes.func,
};

export default connect(({ ui, modules }) => ({
    is_top_up_virtual_open: ui.is_top_up_virtual_open,
    is_top_up_virtual_in_progress: ui.is_top_up_virtual_in_progress,
    is_top_up_virtual_success: ui.is_top_up_virtual_success,
    closeTopUpModal: ui.closeTopUpModal,
    closeSuccessTopUpModal: ui.closeSuccessTopUpModal,
    current_account: modules.cfd.current_account,
    dxtrade_companies: modules.cfd.dxtrade_companies,
    mt5_companies: modules.cfd.mt5_companies,
    topUpVirtual: modules.cfd.topUpVirtual,
}))(CFDTopUpDemoModal);
