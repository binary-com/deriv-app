import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { LabelPairedChevronDownLgFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import useAllBalanceSubscription from '../../hooks/useAllBalanceSubscription';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { THooks } from '../../types';
import { WalletTextField } from '../Base';
import { WalletCurrencyIcon } from '../WalletCurrencyIcon';
import './WalletListCardDropdown.scss';

type WalletList = {
    currency: THooks.WalletAccountsList['currency'];
    currencyConfig: THooks.WalletAccountsList['currency_config'];
    loginid: THooks.WalletAccountsList['loginid'];
    text: string;
}[];

const WalletListCardDropdown = () => {
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const switchWalletAccount = useWalletAccountSwitcher();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: balanceData, isLoading: isBalanceLoading } = useAllBalanceSubscription();
    const loginId = activeWallet?.loginid;
    const [inputWidth, setInputWidth] = useState('auto');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    const generateTitleText = useCallback((wallet: THooks.WalletAccountsList) => {
        return `${wallet?.currency} Wallet`;
    }, []);

    const walletList: WalletList = useMemo(() => {
        return (
            wallets
                ?.filter(wallet => !wallet.is_virtual)
                .map(wallet => ({
                    currency: wallet.currency,
                    currencyConfig: wallet.currency_config,
                    loginid: wallet.loginid,
                    text: generateTitleText(wallet),
                })) ?? []
        );
    }, [generateTitleText, wallets]);

    useOnClickOutside(dropdownRef, () => {
        setIsOpen(false);
    });

    useEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
        }
    });

    const handleInputClick = useCallback(() => {
        setIsOpen(prevIsOpen => !prevIsOpen);
    }, []);

    const handleItemClick = (value: string, text: string) => {
        switchWalletAccount(value);
        setSelectedText(text);
        setIsOpen(false);
    };

    useEffect(() => {
        if (loginId && wallets) {
            const selectedWallet = wallets.find(wallet => wallet.loginid === loginId);
            if (selectedWallet) {
                const titleText = generateTitleText(selectedWallet);
                setSelectedText(titleText);
                setInputWidth(`${titleText.length * 10 - 20}px`);
            }
        }
    }, [generateTitleText, loginId, wallets]);

    return (
        <React.Fragment>
            {walletList.length > 0 && (
                <div className='wallets-listcard-dropdown' ref={dropdownRef}>
                    <WalletTextField
                        data-testid='dt_wallets_listcard_dropdown'
                        inputWidth={inputWidth}
                        name='wallets-list-card-dropdown'
                        onClickCapture={handleInputClick}
                        readOnly
                        renderRightIcon={() => (
                            <button
                                className={classNames('wallets-listcard-dropdown__button', {
                                    'wallets-listcard-dropdown__button--active': isOpen,
                                })}
                                onClick={handleInputClick}
                            >
                                <LabelPairedChevronDownLgFillIcon />
                            </button>
                        )}
                        showMessageContainer={false}
                        type='text'
                        typeVariant='listcard'
                        value={selectedText}
                    />
                    {isOpen && (
                        <ul className='wallets-listcard-dropdown__items'>
                            <div className='wallets-listcard-dropdown__items-header'>
                                <Text size='sm' weight='bold'>
                                    <Localize i18n_default_text='Select Wallet' />
                                </Text>
                            </div>
                            {walletList.map((wallet, index) => (
                                <li
                                    className={classNames('wallets-listcard-dropdown__item', {
                                        'wallets-listcard-dropdown__item--active': loginId === wallet.loginid,
                                    })}
                                    id={`wallets-listcard-dropdown__item-${index}`}
                                    key={wallet.loginid}
                                    onClick={() => handleItemClick(wallet.loginid, wallet.text)}
                                >
                                    <div className='wallets-listcard-dropdown__list-item'>
                                        <WalletCurrencyIcon currency={wallet.currency ?? 'USD'} rounded />
                                        <div className='wallets-listcard-dropdown__list-content'>
                                            <Text size='2xs'>{wallet.currency} Wallet</Text>
                                            {isBalanceLoading ? (
                                                <div
                                                    className='wallets-skeleton wallets-list-card-dropdown__balance-loader'
                                                    data-testid='dt_wallets_list_card_dropdown_balance_loader'
                                                />
                                            ) : (
                                                <Text size='sm' weight='bold'>
                                                    {displayMoney(
                                                        balanceData?.[wallet.loginid]?.balance,
                                                        wallet?.currency,
                                                        {
                                                            fractional_digits:
                                                                wallet?.currencyConfig?.fractional_digits,
                                                        }
                                                    )}
                                                </Text>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </React.Fragment>
    );
};

export default WalletListCardDropdown;
