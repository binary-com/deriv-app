import React, { useMemo } from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard } from '../../../../../components';
import { WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { calculateTotalByKey } from '../../../../../utils/calculate-total-by-key';
import { PlatformDetails } from '../../../constants';
import { MT5TradeModal } from '../../../modals';
import './AddedCTraderAccountsList.scss';

const AddedCTraderAccountsList: React.FC = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const account = cTraderAccounts?.[0];
    const { show } = useModal();

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
            {account && (
                <TradingAccountCard
                    leading={<div className='wallets-added-ctrader__icon'>{PlatformDetails.ctrader.icon}</div>}
                    onClick={() => show(<MT5TradeModal platform={PlatformDetails.ctrader.platform} />)}
                    trailing={
                        <div className='wallets-added-ctrader__icon'>
                            <LabelPairedChevronRightCaptionRegularIcon
                                data-testid='dt_wallets_trading_account_chevron_icon'
                                width={16}
                            />
                        </div>
                    }
                >
                    <div className='wallets-added-ctrader__details'>
                        <WalletText size='sm'>{PlatformDetails.ctrader.title}</WalletText>
                        {totalBalance !== undefined && (
                            <WalletText size='sm' weight='bold'>
                                {displayBalance}
                            </WalletText>
                        )}
                    </div>
                </TradingAccountCard>
            )}
        </React.Fragment>
    );
};

export default AddedCTraderAccountsList;
