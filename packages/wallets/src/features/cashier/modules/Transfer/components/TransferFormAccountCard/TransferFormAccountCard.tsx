import React from 'react';
import classNames from 'classnames';
import {
    WalletCurrencyCard,
    WalletListCardBadge,
    WalletMarketCurrencyIcon,
    WalletText,
} from '../../../../../../components';
import useDevice from '../../../../../../hooks/useDevice';
import { TPlatforms } from '../../../../../../types';
import type { TAccount } from '../../types';
import './TransferFormAccountCard.scss';

type TProps = {
    account?: TAccount;
    type?: 'input' | 'modal';
};

const TransferFormAccountCard: React.FC<TProps> = ({ account, type = 'modal' }) => {
    const { isMobile } = useDevice();
    const isInput = type === 'input';
    const isModal = type === 'modal';
    const badgeLabel = account?.demo_account ? 'virtual' : account?.landingCompanyName;

    return (
        <div
            className={classNames('wallets-transfer-form-account-card', {
                'wallets-transfer-form-account-card--is-input': isInput,
                'wallets-transfer-form-account-card--is-modal': isModal,
            })}
        >
            <div className='wallets-transfer-form-account-card__icon-with-badge'>
                <div className='wallets-transfer-form-account-card__icon'>
                    {account?.account_category === 'wallet' ? (
                        <WalletCurrencyCard
                            currency={account?.currencyConfig?.display_code || 'USD'}
                            isDemo={Boolean(account?.demo_account)}
                            size='sm'
                        />
                    ) : (
                        <WalletMarketCurrencyIcon
                            currency={account?.currency ?? ''}
                            isDemo={Boolean(account?.demo_account)}
                            marketType={account?.market_type}
                            platform={account?.account_type as TPlatforms.All}
                            size='xs'
                        />
                    )}
                </div>
                {isInput && isMobile && (
                    <WalletListCardBadge isDemo={Boolean(account?.demo_account)} label={badgeLabel} />
                )}
            </div>

            <div className='wallets-transfer-form-account-card__content'>
                <WalletText as='p' size={isInput ? '2xs' : 'sm'} weight='bold'>
                    {account?.accountName}
                </WalletText>
                <WalletText size={isInput ? '2xs' : 'xs'}>Balance: {account?.displayBalance}</WalletText>
            </div>

            {isModal && (
                <div className='wallets-transfer-form-account-card__modal-badge'>
                    <WalletListCardBadge isDemo={Boolean(account?.demo_account)} label={badgeLabel} />
                </div>
            )}
        </div>
    );
};

export default TransferFormAccountCard;
