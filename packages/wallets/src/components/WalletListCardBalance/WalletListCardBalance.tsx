import React, { useEffect } from 'react';
import { useActiveWalletAccount, useBalanceSubscription } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { WalletText } from '../Base';
import './WalletListCardBalance.scss';

const WalletListCardBalance = () => {
    const { data: balanceData, isLoading: isBalanceLoading, subscribe, unsubscribe } = useBalanceSubscription();
    const { data: activeWallet, isInitializing: isActiveWalletInitializing } = useActiveWalletAccount();

    useEffect(() => {
        subscribe({ loginid: activeWallet?.loginid });
        return () => unsubscribe();
    }, [activeWallet?.loginid, subscribe, unsubscribe]);

    // ideally we should have one specific hook to use data & loading state together
    // as right now, we are using useBalance just to figure out if account data is complete
    // useActiveWalletAccount shouldn't return isLoading=false until the data is complete,
    // but its not the case at the moment,
    const showLoader = isBalanceLoading || isActiveWalletInitializing;

    return (
        <div className='wallets-balance__container'>
            {showLoader ? (
                <div
                    className='wallets-skeleton wallets-balance--loader'
                    data-testid='dt_wallet_list_card_balance_loader'
                />
            ) : (
                <WalletText align='right' size='xl' weight='bold'>
                    {displayMoney?.(balanceData?.balance ?? 0, activeWallet?.currency ?? '', {
                        fractional_digits: activeWallet?.currency_config?.fractional_digits,
                    })}
                </WalletText>
            )}
        </div>
    );
};

export default WalletListCardBalance;
