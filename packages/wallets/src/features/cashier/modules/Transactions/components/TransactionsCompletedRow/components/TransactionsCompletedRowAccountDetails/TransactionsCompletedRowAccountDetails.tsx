import React from 'react';
import {
    WalletCurrencyCard,
    WalletListCardBadge,
    WalletMarketCurrencyIcon,
    WalletText,
} from '../../../../../../../../components';
import { THooks, TPlatforms, TWalletLandingCompanyName } from '../../../../../../../../types';
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
    landingCompanyName?: TWalletLandingCompanyName;
    mt5Group?: string;
    mt5LandingCompanyName?: string;
};

const TransactionsCompletedRowAccountDetails: React.FC<TProps> = ({
    accountType,
    actionType,
    currency,
    displayAccountName,
    displayActionType,
    isDemo,
    isInterWallet = false,
    landingCompanyName,
    mt5Group,
    mt5LandingCompanyName,
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
                    {!isDemo && <WalletListCardBadge label={mt5LandingCompanyName ?? landingCompanyName} />}
                </div>
            </div>
        </div>
    );
};

export default TransactionsCompletedRowAccountDetails;
