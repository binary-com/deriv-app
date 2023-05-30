import React from 'react';
import classNames from 'classnames';
import { Icon, Text, WalletCard } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import WalletAccount from '../wallet-account/wallet-account';
import './wallet-link-wrapper.scss';

export type TWalletLinkWrapper = {
    wallet_details: React.ComponentProps<typeof WalletCard>['wallet'];
    account_list: {
        balance: string;
        currency: string;
        account_name: string;
        icon: string;
    }[];
};

const WalletLinkWrapper = ({ wallet_details, account_list }: TWalletLinkWrapper) => {
    return (
        <div className='wallet-link-wrapper'>
            <div className='wallet-link-wrapper__accounts'>
                {isMobile() && (
                    <Text
                        as='div'
                        className='wallet-link-wrapper__title-text wallet-link-wrapper__accounts-title'
                        color='prominent'
                        size='xxxs'
                    >
                        {localize('Your current trading account(s)')}
                    </Text>
                )}
                {account_list.map((account, index) => {
                    return (
                        <WalletAccount
                            key={index}
                            balance={account.balance}
                            currency={account.currency}
                            icon={account.icon}
                            name={account.account_name}
                        />
                    );
                })}
            </div>
            <div className='wallet-link-wrapper__link'>
                <div
                    className={classNames('wallet-link-wrapper__link-bracket', {
                        'wallet-link-wrapper__link-bracket--single': account_list.length === 1,
                    })}
                />
                <div className='wallet-link-wrapper__link-icon'>
                    <Icon icon='IcAppstoreWalletsLink' size={40} />
                </div>
            </div>
            <div className='wallet-link-wrapper__card-wrapper'>
                <WalletCard wallet={wallet_details} size='large' state='default' />
                {isMobile() && (
                    <Text
                        className='wallet-link-wrapper__title-text wallet-link-wrapper__card-wrapper-title'
                        color='prominent'
                        size='xxxs'
                    >
                        {localize('Your new Wallet')}
                    </Text>
                )}
            </div>
        </div>
    );
};

export default WalletLinkWrapper;
