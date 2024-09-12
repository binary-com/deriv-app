import React, { useState } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useActiveLinkedToTradingAccount, useActiveWalletAccount, useAuthorize } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { LabelPairedArrowUpArrowDownSmBoldIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import useAllBalanceSubscription from '../../hooks/useAllBalanceSubscription';
import { TradingAccountCard } from '../TradingAccountCard';
import { WalletDisabledAccountModal } from '../WalletDisabledAccountModal';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletMarketIcon } from '../WalletMarketIcon';
import { WalletStatusBadge } from '../WalletStatusBadge';

const DerivAppsTradingAccount = () => {
    const [shouldShowDisabledAccountModal, setShouldShowDisabledAccountModal] = useState(false);
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const history = useHistory();
    const { data: authorizeData } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();
    const { data: balanceData, isLoading: isBalanceLoading } = useAllBalanceSubscription();
    const balance = balanceData?.[activeLinkedToTradingAccount?.loginid ?? '']?.balance;

    return (
        <>
            <TradingAccountCard
                className={classNames('wallets-deriv-apps-section wallets-deriv-apps-section__border', {
                    'wallets-deriv-apps-section--disabled': activeLinkedToTradingAccount?.is_disabled,
                })}
                onClick={() => {
                    if (activeLinkedToTradingAccount?.is_disabled) {
                        setShouldShowDisabledAccountModal(true);
                    }
                }}
            >
                <TradingAccountCard.Icon>
                    <WalletMarketIcon icon='standard' size={isDesktop ? 'lg' : 'md'} />
                </TradingAccountCard.Icon>
                <TradingAccountCard.Section>
                    <TradingAccountCard.Content>
                        <div className='wallets-deriv-apps-section__title-and-badge'>
                            <Text size='sm'>
                                <Localize i18n_default_text='Options' />
                            </Text>
                            {activeWallet?.is_virtual && <WalletListCardBadge />}
                        </div>
                        {isBalanceLoading ? (
                            <div
                                className='wallets-skeleton wallets-deriv-apps-balance-loader'
                                data-testid='dt_deriv-apps-balance-loader'
                            />
                        ) : (
                            <Text size='sm' weight='bold'>
                                {displayMoney(balance, activeLinkedToTradingAccount?.currency_config?.display_code, {
                                    fractional_digits: activeLinkedToTradingAccount?.currency_config?.fractional_digits,
                                    preferred_language: authorizeData?.preferred_language,
                                })}
                            </Text>
                        )}
                        <Text color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                            {activeLinkedToTradingAccount?.loginid}
                        </Text>
                    </TradingAccountCard.Content>
                    <TradingAccountCard.Button>
                        {activeLinkedToTradingAccount?.is_disabled ? (
                            <WalletStatusBadge status='disabled' />
                        ) : (
                            <button
                                className='wallets-deriv-apps-section__button'
                                data-testid='dt_deriv-apps-trading-account-transfer-button'
                                onClick={() => {
                                    history.push('/wallet/account-transfer', {
                                        toAccountLoginId: activeLinkedToTradingAccount?.loginid,
                                    });
                                }}
                            >
                                <LabelPairedArrowUpArrowDownSmBoldIcon />
                            </button>
                        )}
                    </TradingAccountCard.Button>
                </TradingAccountCard.Section>
            </TradingAccountCard>
            {shouldShowDisabledAccountModal && (
                <WalletDisabledAccountModal
                    accountType={localize('Options')}
                    isVisible={shouldShowDisabledAccountModal}
                    onClose={() => setShouldShowDisabledAccountModal(false)}
                />
            )}
        </>
    );
};

export { DerivAppsTradingAccount };
