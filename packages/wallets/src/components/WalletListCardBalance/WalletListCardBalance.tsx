import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { Text } from '@deriv-com/ui';
import useAllBalanceSubscription from '../../hooks/useAllBalanceSubscription';
import './WalletListCardBalance.scss';

const WalletListCardBalance = () => {
    const {
        data: activeWallet,
        isInitializing: isActiveWalletInitializing,
        isLoading: isActiveWalletLoading,
    } = useActiveWalletAccount();
    const { data: balanceData, isLoading: isBalanceLoading } = useAllBalanceSubscription();
    const showLoader = isBalanceLoading || isActiveWalletInitializing || isActiveWalletLoading;
    const balance = balanceData?.[activeWallet?.loginid ?? '']?.balance;

    return (
        <div className='wallets-balance__container'>
            {showLoader ? (
                <div
                    className='wallets-skeleton wallets-balance--loader'
                    data-testid='dt_wallet_list_card_balance_loader'
                />
            ) : (
                <Text align='end' data-testid='dt_wallets_list_card_balance' size='xl' weight='bold'>
                    {displayMoney(balance, activeWallet?.currency, {
                        fractional_digits: activeWallet?.currency_config?.fractional_digits,
                    })}
                </Text>
            )}
        </div>
    );
};

export default WalletListCardBalance;
