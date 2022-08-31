import * as React from 'react';
import { Authorize } from '@deriv/api-types';
import { Localize, localize } from '@deriv/translations';
import { Icon, Money } from '@deriv/components';
import { Text, Accordion } from '@deriv/ui';
import { ArrayElement } from 'Types';
import WalletCard from 'Components/wallet';
import WalletActionButton from 'Components/wallet-action-button';
import AppsLauncher from 'Components/app-launcher';
import { WS } from '@deriv/shared';
import { useStores } from 'Stores';

type WalletAccountProps = {
    account: ArrayElement<Required<Authorize>['account_list']>;
};

const WalletAccount = ({ account }: WalletAccountProps) => {
    const { client } = useStores();

    // should we keep the api call here in the component or move it to Stores ?
    const addDemoDerivAppAccount = async () => {
        const demo_trading_account = await WS.authorized.storage.send({
            new_account_virtual: 1,
            type: 'trading',
        });

        if (!demo_trading_account.error) {
            const link_to_wallet = await WS.authorized.storage.send({
                link_wallet: 1,
                client_id: demo_trading_account.new_account_virtual.client_id,
                wallet_id: client.loginid,
            });
            alert('You have added a Demo Deriv App account');
            // we need to show a modal instead of alerting the user
        }
    };

    return (
        <>
            <Accordion
                expand_section
                elevation_type='xs'
                onToggle={() => {
                    /**do something */
                }}
                type='containerWithBorder'
                className='wallet-account'
            >
                <Icon className='wallet-account__background' icon='IcAppstoreDemoWallet' />
                <Accordion.Title size='medium'>
                    <div className='wallet-account__header'>
                        <div className='wallet-account__details'>
                            <div className='wallet-account__logo'>
                                <WalletCard wallet_name={account.is_virtual === 1 ? 'demo' : ''} size='sm' />
                            </div>
                            <div className='wallet-account__info'>
                                <Text bold type='subtitle-2'>
                                    <Localize
                                        i18n_default_text='Demo {{currency}} wallet'
                                        values={{ currency: account.currency }}
                                    />
                                </Text>
                                <div className='wallet-account__actions'>
                                    <WalletActionButton size='small' label='Reports' icon='icAppstoreTransfer' />
                                    <WalletActionButton size='small' label='Transaction' icon='icAppstoreTransaction' />
                                    <WalletActionButton
                                        size='small'
                                        label='Reset Balance'
                                        icon='icAppstoreResetBalance'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='wallet-account__balance'>
                            {account.is_virtual && (
                                <Text bold={false} type='small' align='right'>
                                    {localize('Virtual balance')}
                                </Text>
                            )}
                            <Text bold type='subtitle-1'>
                                <Money amount={account.wallet?.balance} currency={account.currency} show_currency />
                            </Text>
                        </div>
                    </div>
                </Accordion.Title>
                <Accordion.Content size='medium'>
                    <div className='wallet-account__content'>
                        <div>
                            <Text bold type='subtitle-1'>
                                {localize('CFDs')}
                            </Text>
                            <Text bold={false} type='paragraph-1'>
                                {localize(
                                    'Trade with leverage and tight spreads for better returns on successful trades. '
                                )}
                                <a href='#' style={{ color: '#FF444F' }}>
                                    {localize('Learn more')}
                                </a>
                            </Text>
                        </div>
                        <Text bold type='paragraph-1' style={{ marginTop: '2rem', marginBottom: '-1rem' }}>
                            {localize('Deriv MT5')}
                        </Text>
                        <div className='wallet-account__options'>
                            <AppsLauncher
                                app_name='Derived'
                                icon_name='TradingDerived'
                                is_app_installed={false}
                                button_className='wallet-account__app-launcher-button'
                                jurisdiction=''
                                description='Trade CFDs on MT5 with synthetic indices that simulate real-world market movements.'
                            />

                            <AppsLauncher
                                app_name='Financial'
                                icon_name='TradingFinancial'
                                is_app_installed={false}
                                button_className='wallet-account__app-launcher-button'
                                jurisdiction=''
                                description='Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'
                            />
                        </div>

                        <Text bold type='paragraph-1' style={{ marginBottom: '-1.5rem' }}>
                            {localize('Deriv X')}
                        </Text>
                        <AppsLauncher
                            app_name='Deriv X2'
                            icon_name='DerivX'
                            is_app_installed={false}
                            button_className='wallet-account__app-launcher-button'
                            jurisdiction=''
                            description='Trade CFDs on Deriv X with synthetic indices that simulate real-world market movements.'
                        />
                        <div>
                            <Text bold type='subtitle-1'>
                                {localize('Options & Multipliers')}
                            </Text>
                            <Text bold={false} type='paragraph-1'>
                                {localize('Earn fixed payouts by predicting price movements with ')}
                                <a href='#' style={{ color: '#FF444F' }}>
                                    {localize('Options')}
                                </a>
                                {localize(', or combine the upside of CFDs with the simplicity of Options with ')}

                                <a href='#' style={{ color: '#FF444F' }}>
                                    {localize('Multipliers')}
                                </a>
                            </Text>
                        </div>
                        <div className='wallet-account__deriv-apps'>
                            <AppsLauncher
                                className='wallet-account__app-launcher--full-width'
                                app_name='Deriv Apps'
                                icon_name='DerivApps'
                                is_app_installed={false}
                                button_className='wallet-account__app-launcher-button'
                                jurisdiction=''
                                handleClick={addDemoDerivAppAccount}
                                description='Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'
                            />
                            <div className='test'>apps</div>
                        </div>
                    </div>
                </Accordion.Content>
            </Accordion>
        </>
    );
};

export default WalletAccount;
