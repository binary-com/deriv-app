import React from 'react';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { Modal, MobileWrapper, DesktopWrapper, Text, Money, Icon } from '@deriv/components';

const CTraderTransferModal = observer(() => {
    const {
        modules: { cfd },
        client,
        traders_hub,
    } = useStore();

    const { toggleAccountTransferModal, setSelectedAccount } = traders_hub;
    const { ctrader_accounts_list } = client;
    const { is_ctrader_transfer_modal_visible, toggleCTraderTransferModal } = cfd;

    return (
        <Modal
            is_open={is_ctrader_transfer_modal_visible}
            title={localize('Choose a cTrader account to transfer')}
            toggleModal={toggleCTraderTransferModal}
            should_header_stick_body={false}
            width='600px'
            exit_classname='cfd-modal--custom-exit'
        >
            <div className='ctrader-transfer-modal'>
                {ctrader_accounts_list.map(ctrader_account => {
                    return (
                        <div
                            key={ctrader_account.name}
                            className='ctrader-transfer-modal__accounts-list'
                            onClick={() => {
                                toggleCTraderTransferModal();
                                toggleAccountTransferModal();
                                setSelectedAccount(ctrader_account);
                            }}
                        >
                            <Text>{ctrader_account.login}</Text>
                            <Text>
                                <Money
                                    amount={ctrader_account.balance}
                                    currency={ctrader_account.currency}
                                    has_sign={!!ctrader_account.balance && ctrader_account.balance < 0}
                                    show_currency
                                />
                                <Icon icon='IcChevronRight' />
                            </Text>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
});

export default CTraderTransferModal;
