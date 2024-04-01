import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../../../../../types';
import { TransferAccountTile } from '../TransferAccountTile';
import styles from './TransferDropdownList.module.scss';

type TProps = {
    accounts: TTransferableAccounts;
    header: string;
    onSelect: (account: TTransferableAccounts[number]) => void;
    value: TTransferFormikContext['fromAccount'] | TTransferFormikContext['toAccount'];
};

const TransferDropdownList: React.FC<TProps> = ({ accounts, header, onSelect, value }) => {
    return (
        <div className={styles['items-list']}>
            <div className={styles['item-header']}>
                <Text size='sm' weight='bold'>
                    {header}
                </Text>
            </div>
            {accounts.map(account => {
                return (
                    <button
                        className={clsx(styles.item, {
                            [styles['item--selected']]: account.loginid === value?.loginid,
                        })}
                        key={account.loginid}
                        onClick={() => onSelect(account)}
                    >
                        <TransferAccountTile account={account} isActive={account.loginid === value?.loginid} />
                    </button>
                );
            })}
        </div>
    );
};

export default TransferDropdownList;
