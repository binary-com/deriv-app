import React from 'react';
import { Icon, Text, WalletCard } from '@deriv/components';
import { localize } from '@deriv/translations';
import WalletAccount from '../wallet-account/wallet-account';
import './wallet-link-wrapper.scss';
import classNames from 'classnames';

export type TWalletLinkWrapper = {
    wallet_details: React.ComponentProps<typeof WalletCard>;
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
                <Text as='div' className='wallet-link-wrapper__title-text wallet-link-wrapper__accounts-title'>
                    {localize('Your current trading account(s)')}
                </Text>
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
                <Text className='wallet-link-wrapper__title-text wallet-link-wrapper__card-wrapper-title'>
                    {localize('Your new Wallet')}
                </Text>
                <WalletCard wallet={wallet_details} size='large' state='active' />
            </div>
        </div>
    );
};

export default WalletLinkWrapper;
