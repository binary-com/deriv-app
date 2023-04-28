import React, { useState } from 'react';
import { useHasFiatCurrency, useHasUSDCurrency, useIsP2PEnabled } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useHistory } from 'react-router';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { CashierOnboardingCard } from '../cashier-onboarding-card';
import { SwitchToFiatAccountDialog } from '../switch-to-fiat-account-dialog';

const CashierOnboardingP2PCard: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const { is_crypto } = client;
    const { openRealAccountSignup } = ui;
    const { setDepositTarget } = general_store;
    const history = useHistory();
    const { data: is_p2p_enabled } = useIsP2PEnabled();
    const has_usd_currency = useHasUSDCurrency();
    const has_fiat_currency = useHasFiatCurrency();
    const should_show_p2p_card = is_p2p_enabled && has_usd_currency;
    const can_switch_to_fiat_account = is_crypto() && has_fiat_currency;
    const [is_dialog_visible, setIsDialogVisible] = useState(false);

    const onClick = () => {
        setDepositTarget(routes.cashier_p2p);

        if (can_switch_to_fiat_account) {
            setIsDialogVisible(true);
        } else if (is_crypto()) {
            openRealAccountSignup('add_fiat');
        } else {
            history.push(routes.cashier_p2p);
        }
    };

    const onSwitchDone = () => {
        history.push(routes.cashier_p2p);
        setIsDialogVisible(false);
    };

    if (!should_show_p2p_card) return null;

    return (
        <CashierOnboardingCard
            title={localize('Deposit with Deriv P2P')}
            description={localize(
                'Deposit with your local currency via peer-to-peer exchange with fellow traders in your country.'
            )}
            onClick={onClick}
        >
            {can_switch_to_fiat_account && (
                <SwitchToFiatAccountDialog
                    is_visible={is_dialog_visible}
                    onCancel={() => setIsDialogVisible(false)}
                    onSwitchDone={onSwitchDone}
                />
            )}
        </CashierOnboardingCard>
    );
});

export default CashierOnboardingP2PCard;
