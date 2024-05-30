import React from 'react';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { SideNoteFAQ, SideNotePaymentMethodsLearnMore } from '../../../../components/side-notes';
import CashierOnboardingSideNoteCrypto from './cashier-onboarding-side-note-crypto';
import CashierOnboardingSideNoteFiat from './cashier-onboarding-side-note-fiat';

const CashierOnboardingSideNotes: React.FC = observer(() => {
    const currency_config = useCurrentCurrencyConfig();

    return (
        <>
            <SideNoteFAQ is_deposit />
            {currency_config?.is_crypto && <CashierOnboardingSideNoteCrypto />}
            {currency_config?.is_fiat && <CashierOnboardingSideNoteFiat />}
            <SideNotePaymentMethodsLearnMore />
        </>
    );
});

export default CashierOnboardingSideNotes;
