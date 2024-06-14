import React, { useEffect } from 'react';
import { observer, useStore } from '@deriv/stores';
import { Divider } from '../../components/divider';
import { PageContainer } from '../../components/page-container';
import { useCashierStore } from '../../stores/useCashierStores';
import { DepositCryptoCurrencyDetails, DepositCryptoSideNotes, DepositCryptoWalletAddress } from './components';
import DepositCryptoSideNoteTryFiatOnRamp from './components/deposit-crypto-side-notes/deposit-crypto-side-note-try-fiat-onramp';

const DepositCrypto: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile_or_tablet } = ui;
    const { general_store } = useCashierStore();
    const { setIsDeposit } = general_store;

    useEffect(() => {
        setIsDeposit(true);

        return () => {
            setIsDeposit(false);
        };
    }, [setIsDeposit]);

    return (
        <PageContainer
            // Hide the side note and render it in the page content on mobile to match the design,
            // Need to talk with the design team to put `DepositCryptoSideNoteTryFiatOnRamp` in the
            // side notes for consistency and then we can remove unnecessary components from the children.
            right={is_mobile_or_tablet ? undefined : <DepositCryptoSideNotes />}
        >
            <DepositCryptoCurrencyDetails />
            <DepositCryptoWalletAddress />
            <Divider />
            {is_mobile_or_tablet && <DepositCryptoSideNotes />}
            {is_mobile_or_tablet && <Divider />}
            {/* This should be in the side notes, Need to talk to the design team to change it */}
            <div style={{ alignSelf: is_mobile_or_tablet ? 'unset' : 'center' }}>
                <DepositCryptoSideNoteTryFiatOnRamp />
            </div>
        </PageContainer>
    );
});

export default DepositCrypto;
