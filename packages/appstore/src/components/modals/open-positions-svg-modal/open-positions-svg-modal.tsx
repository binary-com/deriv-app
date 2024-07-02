import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { Jurisdiction, MT5_ACCOUNT_STATUS, getMT5AccountTitle } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Localize, useLocalize } from '@deriv/translations';
import { TTradingPlatformAvailableAccount } from '../account-type-modal/types';
import { TMarketType } from '../../../types/common.types';

type TOpenPositionsSVGModal = {
    market_type: NonNullable<TTradingPlatformAvailableAccount['market_type']> | TMarketType;
    status: string;
    is_modal_open: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OpenPositionsSVGModal = ({ market_type, status, is_modal_open, setModalOpen }: TOpenPositionsSVGModal) => {
    const { localize } = useLocalize();
    const { client } = useStore();
    const { mt5_login_list } = client;
    const eligible_accounts = mt5_login_list?.filter(
        account => account?.market_type === market_type && account.landing_company_short !== Jurisdiction.SVG
    );

    const eligible_accounts_label = eligible_accounts.map(account =>
        getMT5AccountTitle({
            account_type: market_type,
            jurisdiction: account.landing_company_short,
        })
    );

    const is_migrated_with_position = status === MT5_ACCOUNT_STATUS.MIGRATED_WITH_POSITION;

    return (
        <Modal
            is_open={is_modal_open}
            toggleModal={() => setModalOpen(is_modal_open => !is_modal_open)}
            small
            has_close_icon={false}
        >
            <Modal.Body>
                <Text as='h1' color='prominent' weight='bold' className='open-positions-svg__modal-title'>
                    {is_migrated_with_position ? (
                        <Localize i18n_default_text='No new positions' />
                    ) : (
                        <Localize i18n_default_text='Account closed' />
                    )}
                </Text>
                <Text as='p' color='prominent ' size='xs'>
                    {is_migrated_with_position ? (
                        <Localize
                            i18n_default_text='You can no longer open new positions with your {{from_account}} account. Please use your {{to_account}} account to open new positions.'
                            values={{
                                from_account: getMT5AccountTitle({
                                    account_type: market_type,
                                    jurisdiction: Jurisdiction.SVG,
                                }),
                                to_account: eligible_accounts_label.join(localize(' or ')),
                            }}
                        />
                    ) : (
                        <Localize
                            i18n_default_text='Your {{from_account}} account will be archived after 30 days of inactivity. You can still access your trade history until the account is archived.'
                            values={{
                                from_account: getMT5AccountTitle({
                                    account_type: market_type,
                                    jurisdiction: Jurisdiction.SVG,
                                }),
                            }}
                        />
                    )}
                </Text>
            </Modal.Body>
            <Modal.Footer className='open-positions-svg__modal-footer'>
                <Button has_effect onClick={() => setModalOpen(false)} secondary large>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OpenPositionsSVGModal;
