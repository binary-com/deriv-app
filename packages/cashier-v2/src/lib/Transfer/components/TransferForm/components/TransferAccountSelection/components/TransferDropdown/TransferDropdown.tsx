import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Text, useOnClickOutside } from '@deriv-com/ui';
import { TGenericSizes } from '../../../../../../../../hooks/types';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../../../types';
import { TransferAccountTile, TransferDropdownList } from './components';
import styles from './TransferDropdown.module.scss';

type TProps = {
    disabled: boolean;
    icon?: React.ReactNode;
    isRequired?: boolean;
    label?: string;
    list: TTransferableAccounts;
    listHeight?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    message?: string;
    onChange?: (inputValue: string) => void;
    onSelect: (value: string) => void;
    typeVariant?: 'listcard' | 'normal';
    value: TTransferFormikContext['fromAccount'] | TTransferFormikContext['toAccount'];
    variant?: 'comboBox' | 'prompt';
};

const TransferDropdown: React.FC<TProps> = ({ label, list, message, onSelect, value }) => {
    const clickOutsideRef = useRef(null);
    const [items, setItems] = useState(list);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(currentValue => !currentValue);

    useOnClickOutside(clickOutsideRef, () => {
        setIsOpen(false);
    });

    const onSelectItem = (value: string) => {
        setIsOpen(false);
        return onSelect(value);
    };

    useEffect(() => {
        setItems(list);
    }, [list]);

    return (
        <div className={styles.container} ref={clickOutsideRef}>
            <button className={styles['selection-container']} onClick={toggleMenu}>
                <div className={styles['selection-label']}>
                    <Text size='xs'>{label}</Text>
                </div>
                <div className={styles['selection-content']}>
                    {value && <TransferAccountTile account={value} />}
                    <LabelPairedChevronDownMdRegularIcon
                        className={clsx(styles.arrow, {
                            [styles['arrow--flip']]: isOpen,
                        })}
                    />
                </div>
                <Text className={styles['helper-message']} color='less-prominent' size='xs'>
                    {message}
                </Text>
            </button>
            {isOpen && (
                <ul className={styles['items-container']}>
                    {items.find(item => item.account_type === 'mt5') && (
                        <TransferDropdownList
                            accounts={items.filter(item => item.account_type === 'mt5')}
                            header='Deriv MT5 accounts'
                            onSelect={onSelectItem}
                            value={value}
                        />
                    )}
                    {items.find(item => item.account_type === 'ctrader') && (
                        <TransferDropdownList
                            accounts={items.filter(item => item.account_type === 'ctrader')}
                            header='Deriv cTrader accounts'
                            onSelect={onSelectItem}
                            value={value}
                        />
                    )}
                    {items.find(item => item.account_type === 'dxtrade') && (
                        <TransferDropdownList
                            accounts={items.filter(item => item.account_type === 'dxtrade')}
                            header='Deriv X accounts'
                            onSelect={onSelectItem}
                            value={value}
                        />
                    )}
                    {items.find(item => item.account_type === 'binary') && (
                        <TransferDropdownList
                            accounts={items.filter(item => item.account_type === 'binary')}
                            header='Deriv accounts'
                            onSelect={onSelectItem}
                            value={value}
                        />
                    )}
                </ul>
            )}
        </div>
    );
};

export default TransferDropdown;
