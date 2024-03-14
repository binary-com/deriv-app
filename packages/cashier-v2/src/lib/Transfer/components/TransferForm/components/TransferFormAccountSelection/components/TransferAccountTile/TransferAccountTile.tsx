import React from 'react';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { Text } from '@deriv-com/ui';
import { CurrencyIcon, TradingAppIcon } from '../../../../../../../../components';
import { getLandingCompanyNameOfMT5Account, getMarketType } from '../../../../../../../../helpers';
import { TTransferableAccounts } from '../../../../../../types';
import styles from './TransferAccountTile.module.scss';

const getAccountName = (account: TTransferableAccounts[number]) => {
    if (account.account_type === 'binary') return account.currency;

    if (account.account_type === 'dxtrade') return 'Deriv X';

    if (account.account_type === 'ctrader') return 'cTrader';

    if (account.account_type === 'mt5') {
        const marketType = getMarketType(account.mt5_group)
            .split('')
            .map((char, i) => (i === 0 ? char.toUpperCase() : char))
            .join('');
        return `${marketType} ${getLandingCompanyNameOfMT5Account(account.mt5_group).toUpperCase()}`;
    }
};

const getIcon = (account: TTransferableAccounts[number]) => {
    if (account.account_type === 'binary') return <CurrencyIcon currency={account.currency} size='sm' />;

    if (account.account_type === 'dxtrade') return <TradingAppIcon name='DERIVX' size='sm' />;

    if (account.account_type === 'mt5') {
        return (
            <TradingAppIcon
                name={`${account.account_type.toUpperCase()}_${getMarketType(account.mt5_group).toUpperCase()}`}
                size='sm'
            />
        );
    }
};

const TransferAccountTile = ({ account }: { account: TTransferableAccounts[number] }) => {
    return (
        <div className={styles.container}>
            <div className={styles.account}>
                {getIcon(account)}
                <div className={styles['account-info']}>
                    <Text size='sm'>{getAccountName(account)}</Text>
                    <Text color='less-prominent' size='2xs'>
                        {account.loginid}
                    </Text>
                </div>
            </div>
            <Text size='sm'>{displayMoney(account.balance, account.currency)}</Text>
        </div>
    );
};

export default TransferAccountTile;
