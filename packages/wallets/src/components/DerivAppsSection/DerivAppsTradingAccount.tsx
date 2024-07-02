import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveLinkedToTradingAccount, useActiveWalletAccount, useAuthorize } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { LabelPairedArrowUpArrowDownSmBoldIcon } from '@deriv/quill-icons';
import useDevice from '../../hooks/useDevice';
import { TSubscribedBalance } from '../../types';
import { WalletText } from '../Base';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletMarketIcon } from '../WalletMarketIcon';

const DerivAppsTradingAccount: React.FC<TSubscribedBalance> = ({ balance }) => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { data: authorizeData } = useAuthorize();
    const { data: balanceData, isLoading } = balance;
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();

    return (
        <div className='wallets-deriv-apps-section wallets-deriv-apps-section__border'>
            <div className={isMobile ? 'wallets-deriv-apps-section__icon-small' : 'wallets-deriv-apps-section__icon'}>
                <WalletMarketIcon icon='standard' size={isMobile ? 'md' : 'lg'} />
            </div>
            <div className='wallets-deriv-apps-section__details'>
                <div className='wallets-deriv-apps-section__title-and-badge'>
                    <WalletText size='sm'>Options</WalletText>
                    <WalletListCardBadge isDemo={activeWallet?.is_virtual} label={activeWallet?.landing_company_name} />
                </div>
                {isLoading ? (
                    <div className='wallets-skeleton wallets-deriv-apps-balance-loader' />
                ) : (
                    <WalletText size='sm' weight='bold'>
                        {displayMoney(
                            balanceData?.accounts?.[activeLinkedToTradingAccount?.loginid ?? '']?.balance || 0,
                            activeLinkedToTradingAccount?.currency_config?.display_code || 'USD',
                            {
                                fractional_digits: activeLinkedToTradingAccount?.currency_config?.fractional_digits,
                                preferred_language: authorizeData?.preferred_language,
                            }
                        )}
                    </WalletText>
                )}
                <WalletText color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                    {activeLinkedToTradingAccount?.loginid}
                </WalletText>
            </div>
            <button
                className='wallets-deriv-apps-section__button'
                onClick={() => {
                    history.push('/wallet/account-transfer', {
                        toAccountLoginId: activeLinkedToTradingAccount?.loginid,
                    });
                }}
            >
                <LabelPairedArrowUpArrowDownSmBoldIcon />
            </button>
        </div>
    );
};

export { DerivAppsTradingAccount };
