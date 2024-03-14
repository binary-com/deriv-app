import React from 'react';
import { Button, Loader, Text, useDevice } from '@deriv-com/ui';
import { CurrencyIcon, ReceiptScreen, TradingAppIcon } from '../../../../components';
import { getLandingCompanyNameOfMT5Account, getMarketType } from '../../../../helpers';
import { TTransferableAccounts, TTransferReceipt } from '../../types';
import styles from './TransferReceipt.module.scss';

const TransferReceipt: React.FC<TTransferReceipt> = ({ amount, fromAccount, toAccount }) => {
    const { isMobile } = useDevice();

    if (!amount || !fromAccount || !toAccount) return <Loader />;

    const getAccountName = (account: TTransferableAccounts[number]) => {
        if (account.account_type === 'binary') return account.currency;

        if (account.account_type === 'dxtrade') return 'Deriv X';

        if (account.account_type === 'ctrader') return 'cTrader';

        if (account.account_type === 'mt5') {
            const marketType = getMarketType(account.mt5_group)
                .split('')
                .map((char, i) => (i === 0 ? char.toUpperCase() : char))
                .join('');
            return `${marketType} 
        ${getLandingCompanyNameOfMT5Account(account.mt5_group).toUpperCase()}`;
        }
    };

    const getIcon = (account: TTransferableAccounts[number]) => {
        if (account.account_type === 'binary' && account.currency)
            return <CurrencyIcon currency={account.currency} size={isMobile ? 'sm' : 'md'} />;

        if (account.account_type === 'dxtrade') return <TradingAppIcon name='DERIVX' size={isMobile ? 'sm' : 'md'} />;

        if (account.account_type === 'mt5')
            return (
                <TradingAppIcon
                    name={`${account.account_type.toUpperCase()}_${getMarketType(account.mt5_group).toUpperCase()}`}
                    size={isMobile ? 'sm' : 'md'}
                />
            );
    };

    return (
        <ReceiptScreen
            actionButtons={
                <div className={styles.actions}>
                    <Button size='lg' textSize='sm' variant='outlined'>
                        View transaction history
                    </Button>
                    <Button size='lg' textSize='sm'>
                        Make a new withdrawal
                    </Button>
                </div>
            }
            amount={`${amount} ${fromAccount?.currency}`}
            fromElement={
                <>
                    <div className={styles['account-info']}>
                        {getIcon(fromAccount)}
                        <Text weight='bold'>{getAccountName(fromAccount)}</Text>
                    </div>
                    <div className={styles['account-id']}>
                        <Text color='less-prominent' size={isMobile ? 'md' : 'sm'}>
                            {fromAccount?.loginid}
                        </Text>
                    </div>
                </>
            }
            title='Your funds have been transferred'
            toElement={
                <>
                    <div className={styles['account-info']}>
                        {getIcon(toAccount)}
                        <Text weight='bold'>{getAccountName(toAccount)}</Text>
                    </div>
                    <div className={styles['account-id']} data-testid='dt_withdrawal_crypto_receipt_address'>
                        <Text color='less-prominent' size={isMobile ? 'md' : 'sm'}>
                            {toAccount.loginid}
                        </Text>
                    </div>
                </>
            }
        />
    );
};

export default TransferReceipt;
