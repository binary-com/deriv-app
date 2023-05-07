import React from 'react';
import { Icon, Text } from '@deriv/components';
import { getCurrencyDisplayCode, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';

const CashierOnboardingSideNoteCrypto: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const { currency, loginid } = client;
    const { openRealAccountSignup } = ui;
    const { setDepositTarget } = general_store;
    const currency_code = getCurrencyDisplayCode(currency);

    const onClick = () => {
        setDepositTarget(routes.cashier_deposit);
        openRealAccountSignup('add_crypto');
    };

    return (
        <>
            <Text className='cashier-onboarding-side-notes__text' color='prominent' weight='bold' size='xs' as='p'>
                {localize('This is your {{currency_code}} account {{loginid}}', { currency_code, loginid })}
            </Text>
            <Text className='cashier-onboarding-side-notes__text' size='xxs' as='p'>
                {localize("Don't want to trade in {{currency_code}}? You can open another cryptocurrency account.", {
                    currency_code,
                })}
            </Text>
            <div className='cashier-onboarding-side-notes__link' onClick={onClick}>
                <Text size='xxs' color='red'>
                    {localize('Manage your accounts ')}
                </Text>
                <Icon icon='IcChevronRight' color='red' />
            </div>
        </>
    );
});

export default CashierOnboardingSideNoteCrypto;
