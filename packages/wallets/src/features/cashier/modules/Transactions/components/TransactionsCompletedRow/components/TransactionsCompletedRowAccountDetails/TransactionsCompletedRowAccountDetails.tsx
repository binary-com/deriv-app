import React from 'react';
import { WalletCurrencyCard, WalletMarketCurrencyIcon, WalletText } from '../../../../../../../../components';
import { THooks, TPlatforms } from '../../../../../../../../types';
import { MARKET_TYPE } from '../../../../../../../cfd/constants';
import { getMarketType } from '../../../../../../helpers';
import './TransactionsCompletedRowAccountDetails.scss';

type TProps = {
    accountType: string;
    actionType: NonNullable<(THooks.InfiniteTransactions | THooks.Transactions)['action_type']>;
    currency: string;
    displayAccountName: string;
    displayActionType: string;
    isDemo: boolean;
    isInterWallet?: boolean;
    mt5Group?: string;
};

const TransactionsCompletedRowAccountDetails: React.FC<TProps> = ({
    accountType,
    actionType,
    currency,
    displayAccountName,
    displayActionType,
    isDemo,
    isInterWallet = false,
    mt5Group,
}) => {
    const marketType = getMarketType(mt5Group);

    return (
        <div className='wallets-transactions-completed-row-account-details'>
            {actionType !== 'transfer' || isInterWallet ? (
                <WalletCurrencyCard
                    className='wallets-transactions-completed-row-account-details__currency-card'
                    currency={currency}
                    isDemo={isDemo}
                    size='md'
                />
            ) : (
                <WalletMarketCurrencyIcon
                    currency={currency}
                    isDemo={isDemo}
                    marketType={marketType ?? MARKET_TYPE.ALL}
                    platform={accountType as TPlatforms.All}
                />
            )}
            <div className='wallets-transactions-completed-row-account-details__type-and-wallet-name'>
                <WalletText color='primary' size='xs'>
                    {displayActionType}
                </WalletText>
                <div className='wallets-transactions-completed-row-account-details__wallet-name'>
                    <WalletText color='general' size='xs' weight='bold'>
                        {displayAccountName}
                    </WalletText>
                </div>
            </div>
        </div>
    );
};

export default TransactionsCompletedRowAccountDetails;
