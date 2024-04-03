import React from 'react';
import { Text, useDevice } from '@deriv-com/ui';
import { CurrencyIcon, TradingAppIcon } from '../../../../../../../../../../components';
import { TTransferableAccounts } from '../../../../../../../../types';
import styles from './TransferAccountTile.module.scss';

type TProps = {
    account: TTransferableAccounts[number];
    iconSize?: React.ComponentProps<typeof CurrencyIcon>['size'] | React.ComponentProps<typeof TradingAppIcon>['size'];
    isActive?: boolean;
};

// TODO: replace with correct data once it is available in backend and this function is untested for now
const getAccountName = (account: TTransferableAccounts[number]) => {
    if (!account.currency) return '';

    return account.currency;
};

const getIcon = (account: TTransferableAccounts[number], iconSize: NonNullable<TProps['iconSize']>) => {
    if (!account.currency) return null;

    if (account.account_type === 'binary') return <CurrencyIcon currency={account.currency} size={iconSize} />;

    if (account.account_type === 'dxtrade') return <TradingAppIcon name='DERIVX' size={iconSize} />;

    if (account.account_type === 'mt5') return <TradingAppIcon name='DMT5_DERIVED' size={iconSize} />;
};

const TransferAccountTile: React.FC<TProps> = ({ account, iconSize = 'sm', isActive = false }) => {
    const { isMobile } = useDevice();
    return (
        <div className={styles.container}>
            <div className={styles.account}>
                {getIcon(account, iconSize)}
                <div className={styles['account-info']}>
                    <Text size='sm' weight={isActive ? 'bold' : 'normal'}>
                        {getAccountName(account)}
                    </Text>
                    <Text color='less-prominent' size='2xs'>
                        {account.loginid}
                    </Text>
                </div>
            </div>
            <Text size={isMobile ? 'md' : 'sm'} weight={isActive ? 'bold' : 'normal'}>
                {account.displayBalance}
            </Text>
        </div>
    );
};

export default TransferAccountTile;
