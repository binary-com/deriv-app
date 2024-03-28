import React from 'react';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { Modal, Text, Money, Icon } from '@deriv/components';

const CTraderTransferModal = observer(() => {
    const {
        modules: { cfd },
        client,
        traders_hub,
    } = useStore();

    const { ctrader_accounts_list } = client;
    const { toggleAccountTransferModal, setSelectedAccount } = traders_hub;
    const { is_ctrader_transfer_modal_visible, toggleCTraderTransferModal } = cfd;

    return (
        <Modal
            width='408px'
            should_header_stick_body={false}
            exit_classname='cfd-modal--custom-exit'
            toggleModal={toggleCTraderTransferModal}
            is_open={is_ctrader_transfer_modal_visible}
            title={localize('Choose a cTrader account to transfer')}
        >
            <div className='ctrader-transfer-modal'>
                {ctrader_accounts_list
                    .filter(ctrader_account => ctrader_account.account_type === 'real')
                    .map(ctrader_account => {
                        return (
                            <button
                                key={ctrader_account.login}
                                className='ctrader-transfer-modal__accounts-list'
                                onClick={() => {
                                    toggleCTraderTransferModal();
                                    toggleAccountTransferModal();
                                    setSelectedAccount(ctrader_account);
                                }}
                            >
                                <Text size='xxs'>{ctrader_account.login}</Text>
                                <Text
                                    size='xxs'
                                    weight='bold'
                                    className='ctrader-transfer-modal__accounts-list--balance'
                                >
                                    <Money
                                        amount={ctrader_account.balance}
                                        currency={ctrader_account.currency}
                                        has_sign={!!ctrader_account.balance && ctrader_account.balance < 0}
                                        show_currency
                                    />
                                    <Icon icon='IcChevronRight' />
                                </Text>
                            </button>
                        );
                    })}
            </div>
        </Modal>
    );
});

export default CTraderTransferModal;
