import React, { useMemo } from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import useIsRtl from '../../../../../hooks/useIsRtl';
import { calculateTotalByKey } from '../../../../../utils/calculate-total-by-key';
import { PlatformDetails } from '../../../constants';
import { MT5TradeModal } from '../../../modals';

const AddedCTraderAccountsList: React.FC = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const account = cTraderAccounts?.[0];
    const { show } = useModal();
    const isRtl = useIsRtl();

    const totalBalance = useMemo(() => {
        if (cTraderAccounts) {
            return calculateTotalByKey(cTraderAccounts, 'display_balance');
        }
        return 0;
    }, [cTraderAccounts]);

    const displayBalance = displayMoney(totalBalance, account?.currency || 'USD', {
        fractional_digits: account?.currency_config?.fractional_digits,
    });

    return (
        <React.Fragment>
            {cTraderAccounts?.map((account, index) => (
                <TradingAccountCard
                    key={`added-ctrader-${account.login}-${index}`}
                    onClick={() => show(<MT5TradeModal platform={PlatformDetails.ctrader.platform} />)}
                >
                    <TradingAccountCard.Icon>{PlatformDetails.ctrader.icon}</TradingAccountCard.Icon>
                    <TradingAccountCard.Content>
                        <LabelPairedChevronRightCaptionRegularIcon
                            data-testid='dt_wallets_trading_account_chevron_icon'
                            width={16}
                        />
                        <Text align='start' size='sm'>
                            {PlatformDetails.ctrader.title}
                        </Text>
                        {totalBalance !== undefined && (
                            <Text align='start' size='sm' weight='bold'>
                                {displayBalance}
                            </Text>
                        )}
                        <Text align='start' size='xs'>
                            {account.login}
                        </Text>
                    </TradingAccountCard.Content>
                    <TradingAccountCard.Button>
                        {isRtl ? (
                            <LabelPairedChevronLeftCaptionRegularIcon width={16} />
                        ) : (
                            <LabelPairedChevronRightCaptionRegularIcon width={16} />
                        )}
                    </TradingAccountCard.Button>
                </TradingAccountCard>
            ))}
        </React.Fragment>
    );
};

export default AddedCTraderAccountsList;
