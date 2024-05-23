import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { useActiveWalletAccount, useBalanceSubscription } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import {
    LegacyClose2pxIcon,
    LegacyDepositIcon,
    LegacyPlus1pxIcon,
    LegacyStatementIcon,
    LegacyTransferIcon,
    LegacyWithdrawalIcon,
} from '@deriv/quill-icons';
import { WalletCurrencyIcon, WalletGradientBackground, WalletText } from '../../../../components';
import { WalletListCardBadge } from '../../../../components/WalletListCardBadge';
import useDevice from '../../../../hooks/useDevice';
import i18n from '../../../../translations/i18n';
import './WalletCashierHeader.scss';

type TProps = {
    hideWalletDetails: boolean;
};

const realAccountTabs = [
    {
        icon: <LegacyDepositIcon iconSize='xs' />,
        path: 'deposit',
        text: i18n.t('Deposit'),
    },
    {
        icon: <LegacyWithdrawalIcon iconSize='xs' />,
        path: 'withdraw',
        text: i18n.t('Withdraw'),
    },
    {
        icon: <LegacyTransferIcon iconSize='xs' />,
        path: 'transfer',
        text: i18n.t('Transfer'),
    },
    {
        icon: <LegacyStatementIcon iconSize='xs' />,
        path: 'transactions',
        text: i18n.t('Transactions'),
    },
] as const;

const virtualAccountTabs = [
    {
        icon: <LegacyTransferIcon iconSize='xs' />,
        path: 'transfer',
        text: i18n.t('Transfer'),
    },
    {
        icon: <LegacyPlus1pxIcon iconSize='xs' />,
        path: 'reset-balance',
        text: i18n.t('Reset Balance'),
    },
    {
        icon: <LegacyStatementIcon iconSize='xs' />,
        path: 'transactions',
        text: i18n.t('Transactions'),
    },
] as const;

const WalletCashierHeader: React.FC<TProps> = ({ hideWalletDetails }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: balanceData, subscribe, unsubscribe } = useBalanceSubscription();
    const { isMobile } = useDevice();
    const activeTabRef = useRef<HTMLButtonElement>(null);
    const history = useHistory();
    const location = useLocation();

    const tabs = activeWallet?.is_virtual ? virtualAccountTabs : realAccountTabs;

    useEffect(() => {
        if (isMobile && activeTabRef.current) {
            activeTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'center' });
        }
    }, [location.pathname, isMobile]);

    useEffect(() => {
        subscribe({
            loginid: activeWallet?.loginid,
        });
        return () => {
            unsubscribe();
        };
    }, [activeWallet?.loginid, subscribe, unsubscribe]);

    return (
        <WalletGradientBackground
            currency={activeWallet?.currency}
            device={isMobile ? 'mobile' : 'desktop'}
            isDemo={activeWallet?.is_virtual}
            theme='light'
            type='header'
        >
            <main className='wallets-cashier-header'>
                <section className='wallets-cashier-header__info'>
                    <div className='wallets-cashier-header__top-left-info'>
                        <div
                            className={classNames('wallets-cashier-header__details', {
                                'wallets-cashier-header__details--hide-details': hideWalletDetails,
                            })}
                        >
                            <WalletText
                                color={activeWallet?.is_virtual ? 'system-dark-2-general-text' : 'general'}
                                size='md'
                            >
                                {activeWallet?.currency} Wallet
                            </WalletText>
                            {activeWallet?.landing_company_name && (
                                <WalletListCardBadge
                                    isDemo={activeWallet?.is_virtual}
                                    label={activeWallet?.landing_company_name}
                                />
                            )}
                        </div>
                        <WalletText color={activeWallet?.is_virtual ? 'white' : 'general'} size='xl' weight='bold'>
                            {displayMoney?.(balanceData?.balance ?? 0, activeWallet?.currency || '', {
                                fractional_digits: activeWallet?.currency_config?.fractional_digits,
                            })}
                        </WalletText>
                    </div>
                    <div className='wallets-cashier-header__top-right-info'>
                        {activeWallet?.wallet_currency_type && (
                            <div
                                className={classNames('wallets-cashier-header__currency-icon', {
                                    'wallets-cashier-header__currency-icon--hide-currency-icon': hideWalletDetails,
                                })}
                            >
                                <WalletCurrencyIcon
                                    currency={
                                        activeWallet?.wallet_currency_type === 'Demo'
                                            ? 'DEMO'
                                            : activeWallet?.wallet_currency_type
                                    }
                                    size='xl'
                                />
                            </div>
                        )}
                        <LegacyClose2pxIcon
                            className={classNames('wallets-cashier-header__close-icon', {
                                'wallets-cashier-header__close-icon--white': activeWallet?.is_virtual,
                            })}
                            iconSize='xs'
                            onClick={() => history.push('/wallets')}
                        />
                    </div>
                </section>
                <section className='wallets-cashier-header__tabs'>
                    {tabs.map(tab => {
                        const isActiveTab =
                            location.pathname === `/wallets/cashier/on-ramp`
                                ? tab.path === 'deposit'
                                : location.pathname === `/wallets/cashier/${tab.path}`;
                        return (
                            <button
                                className={`wallets-cashier-header__tab ${
                                    isActiveTab ? 'wallets-cashier-header__tab--active' : ''
                                }`}
                                key={`cashier-tab-${tab.path}`}
                                onClick={() => history.push(`/wallets/cashier/${tab.path}`)}
                                ref={isActiveTab ? activeTabRef : null}
                            >
                                <div
                                    className={classNames('wallets-cashier-header__tab-icon', {
                                        'wallets-cashier-header__tab-icon--system-dark-2-general-text':
                                            activeWallet?.is_virtual && !isActiveTab,
                                    })}
                                >
                                    {tab.icon}
                                </div>
                                <WalletText
                                    color={
                                        activeWallet?.is_virtual && !isActiveTab
                                            ? 'system-dark-2-general-text'
                                            : 'general'
                                    }
                                    size='sm'
                                    weight={isActiveTab ? 'bold' : 'normal'}
                                >
                                    {tab.text}
                                </WalletText>
                            </button>
                        );
                    })}
                </section>
            </main>
        </WalletGradientBackground>
    );
};

export default WalletCashierHeader;
