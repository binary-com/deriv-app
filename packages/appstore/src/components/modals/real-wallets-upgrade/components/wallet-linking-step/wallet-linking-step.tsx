import React from 'react';
import { Text, ThemedScrollbars, WalletCard } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import WalletLinkWrapper from '../wallet-link/wallet-link-wrapper';
import './wallet-linking-step.scss';
import { TitleText } from '../title-text';

type TWalletLinkingStep = {
    data: {
        title: string;
        wallets: Array<{
            wallet_details: React.ComponentProps<typeof WalletCard>['wallet'];
            account_list: {
                balance: number;
                currency: string;
                account_name: string;
                icon: string;
            }[];
        }>;
    };
};

const WalletLinkingStep = observer(({ data }: TWalletLinkingStep) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <div className='wallet-linking-step'>
            <Text as='div' color='prominent' size={is_mobile ? 's' : 'm'} weight='bold'>
                {data.title}
            </Text>
            <Text as='div' className='wallet-linking-step__description' color='prominent' size={is_mobile ? 'xs' : 's'}>
                <Localize i18n_default_text='This is how we link your accounts with your new Wallet.' />
            </Text>
            <TitleText className='wallet-linking-step__note'>
                <Localize i18n_default_text='Your existing funds will remain in your trading account(s) and can be transferred to your Wallet after the upgrade.' />
            </TitleText>
            {!is_mobile && (
                <div className='wallet-linking-step__heading'>
                    {/* <Text className='wallet-linking-step__title-text' color='prominent' size='xxxs'>
                        <Localize i18n_default_text='Your current trading account(s)' />
                    </Text> */}
                    <TitleText className='wallet-linking-step__heading-text'>
                        <Localize i18n_default_text='Your current trading account(s)' />
                    </TitleText>
                    {/* <Text className='wallet-linking-step__title-text' color='prominent' size='xxxs'>
                        <Localize i18n_default_text='Your new Wallet(s)' />
                    </Text> */}
                    <TitleText className='wallet-linking-step__heading-text'>
                        <Localize i18n_default_text='Your new Wallet(s)' />
                    </TitleText>
                </div>
            )}
            <ThemedScrollbars className='wallet-linking-step__content'>
                {data.wallets.map(wallet => {
                    return <WalletLinkWrapper key={wallet.wallet_details.name} wallet={wallet} />;
                })}
            </ThemedScrollbars>
        </div>
    );
});

export default WalletLinkingStep;
