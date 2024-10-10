import React from 'react';
import { Breadcrumbs } from '@deriv-com/ui';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../stores/useCashierStores';

const CashierBreadcrumb = () => {
    const { general_store } = useCashierStore();
    const { is_crypto, is_deposit, setIsDeposit } = general_store;
    const is_deposit_crypto = is_deposit && is_crypto;

    const deposit_crypto_crumbs: React.ComponentProps<typeof Breadcrumbs>['items'] = [
        { value: 0, text: localize('Cashier') },
        { value: 1, text: localize('Deposit cryptocurrencies') },
    ];

    const deposit_fiat_crumbs: React.ComponentProps<typeof Breadcrumbs>['items'] = [
        { value: 0, text: localize('Cashier') },
        { value: 1, text: localize('Deposit via bank wire, credit card, and e-wallet') },
    ];

    const onBreadcrumbHandler: React.ComponentProps<typeof Breadcrumbs>['handleOnClick'] = item => {
        switch (item.value) {
            case 0:
                setIsDeposit(false);
                break;
            default:
        }
    };

    return (
        <Breadcrumbs
            handleOnClick={onBreadcrumbHandler}
            items={is_deposit_crypto ? deposit_crypto_crumbs : deposit_fiat_crumbs}
        />
    );
};

export default CashierBreadcrumb;
