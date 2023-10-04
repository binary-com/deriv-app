import React from 'react';
import { Icon, Text, WalletCard } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { LeftContentWithLink } from '../left-content-with-link';
import { RightContentWithLink } from '../right-content-with-link';
import WalletAccount from '../wallet-account/wallet-account';
import './wallet-link-wrapper.scss';
import { useStore } from '@deriv/stores';
import { TitleText } from '../title-text';

export type TWalletLinkWrapper = {
    wallet_details: React.ComponentProps<typeof WalletCard>['wallet'];
    account_list: {
        balance: number;
        currency: string;
        account_name: string;
        icon: string;
    }[];
};

const WalletLinkWrapper = ({ wallet }: { wallet: TWalletLinkWrapper }) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <div className='wallet-link-wrapper'>
            <div className='wallet-link-wrapper__left'>
                <div className='wallet-link-wrapper__accounts'>
                    <LeftContentWithLink show_fork={wallet.account_list.length > 1}>
                        <React.Fragment>
                            {is_mobile && (
                                <TitleText className='wallet-link-wrapper__heading wallet-link-wrapper__heading--top'>
                                    <Localize i18n_default_text='Your current trading account(s)' />
                                </TitleText>
                            )}
                            {wallet.account_list.map(account => {
                                return (
                                    <WalletAccount
                                        key={`${account.account_name}-${account.currency}}`}
                                        balance={account.balance}
                                        currency={account.currency}
                                        icon={account.icon}
                                        name={account.account_name}
                                        is_mobile={is_mobile}
                                    />
                                );
                            })}
                        </React.Fragment>
                    </LeftContentWithLink>
                </div>
            </div>
            <div className='wallet-link-wrapper__center'>
                <Icon icon='IcAppstoreWalletsLink' size={40} />
            </div>
            <div className='wallet-link-wrapper__right'>
                <RightContentWithLink>
                    <div className='wallet-link-wrapper__right-content'>
                        <WalletCard wallet={wallet.wallet_details} size='large' state='default' />
                        {is_mobile && (
                            <TitleText className='wallet-link-wrapper__heading wallet-link-wrapper__heading--bottom'>
                                <Localize i18n_default_text='Your new Wallet' />
                            </TitleText>
                        )}
                    </div>
                </RightContentWithLink>
            </div>
        </div>
    );
};

export default WalletLinkWrapper;
