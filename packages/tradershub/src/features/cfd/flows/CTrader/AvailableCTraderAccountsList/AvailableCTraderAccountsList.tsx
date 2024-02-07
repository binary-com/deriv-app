import React, { useEffect } from 'react';
import {
    PlatformIcon,
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '@/components';
import { getStaticUrl } from '@/helpers';
import { PlatformDetails } from '@cfd/constants';
import { CTraderSuccessModal } from '@cfd/modals';
import { useActiveTradingAccount, useCreateOtherCFDAccount } from '@deriv/api';
import { Provider } from '@deriv/library';

const LeadingIcon = () => (
    <PlatformIcon
        icon='CTrader'
        onClick={() => {
            window.open(getStaticUrl('/deriv-ctrader'));
        }}
    />
);

const AvailableCTraderAccountsList = () => {
    const { mutate, status } = useCreateOtherCFDAccount();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { show } = Provider.useModal();

    const accountType = activeTradingAccount?.is_virtual ? 'demo' : 'real';

    const onSubmit = () => {
        mutate({
            payload: {
                account_type: accountType,
                market_type: 'all',
                platform: PlatformDetails.ctrader.platform,
            },
        });
    };

    useEffect(() => {
        if (status === 'success') {
            show(<CTraderSuccessModal isDemo={accountType === 'demo'} />);
        }
    }, [accountType, show, status]);

    return (
        <div>
            <TradingAccountCard
                leading={LeadingIcon}
                trailing={() => <TradingAccountCardLightButton onSubmit={onSubmit} />}
            >
                <TradingAccountCardContent title={PlatformDetails.ctrader.title}>
                    This account offers CFDs on a feature-rich trading platform.
                </TradingAccountCardContent>
            </TradingAccountCard>
        </div>
    );
};

export default AvailableCTraderAccountsList;
