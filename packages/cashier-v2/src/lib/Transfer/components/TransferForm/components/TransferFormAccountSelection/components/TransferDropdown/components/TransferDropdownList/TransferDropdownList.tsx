import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../../../../../types';
import { TransferAccountTile } from '../../../TransferAccountTile';
import styles from './TransferDropdownList.module.scss';

type TProps = {
    header: string;
    items: TTransferableAccounts;
    onSelect: (value: string) => void;
    value: TTransferFormikContext['fromAccount'] | TTransferFormikContext['toAccount'];
};

const TransferDropdownList: React.FC<TProps> = ({ header, items, onSelect, value }) => {
    return (
        <div className={styles['items-list']}>
            <li className={styles['item-header']}>
                <Text size='sm' weight='bold'>
                    {header}
                </Text>
            </li>
            {items.map(item => {
                return (
                    <li
                        className={clsx(styles.item, {
                            [styles['item--selected']]: item.loginid === value?.loginid,
                        })}
                        key={item.loginid}
                        onClick={() => onSelect(item.loginid ?? '')}
                    >
                        <TransferAccountTile account={item} />
                    </li>
                );
            })}
        </div>
    );
};

export default TransferDropdownList;
