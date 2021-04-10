import * as React from 'react';
import { localize } from '@deriv/translations';
import { AppCard, Text, VirtualWalletCard } from '@deriv/components';
import { getAppCardLabels, getWalletLabels } from 'Constants/component-labels';
import AppSection from 'Components/my-apps/app-section';
import GetWallet from 'Components/my-apps/get-wallet';
import { response } from 'Components/my-apps/constants';
import CFDsBanner from 'Components/my-apps/banner/app-banner/cfds-banner';

const Demo: React.FC<TDemoProps> = ({}) => {
    // TODO: Refactor all these methods to store once API is ready
    const virtual_wallet_accounts = !!response.authorize.account_list.some(account => account.wallet)
        ? response.authorize.account_list
              .map(account => {
                  if (account.wallet && !!account.is_virtual) return account;
                  return;
              })
              .filter(account => account)
        : [];

    const virtual_trading_accounts = !!response.authorize.account_list.some(account => account.trading)
        ? response.authorize.account_list
              .map(account => {
                  if (account.trading && !!account.is_virtual) return account;
                  return;
              })
              .filter(account => account)
        : [];

    const virtual_mt5_accounts = [];

    const getLinkedWallet = (login_id: string | undefined) => {
        return virtual_wallet_accounts
            .map(account => {
                return account?.wallet.find(wallet => wallet.linked_id === login_id);
            })
            .filter(account => account)
            .map(wallet => {
                return wallet?.payment_method;
            });
    };

    return (
        <React.Fragment>
            <div className='dw-my-apps__wallet-section'>
                <Text size='m' weight='bold' line_height='xs'>
                    {localize('My Wallets')}
                </Text>
                <div className='dw-my-apps__wallet-section-container'>
                    {virtual_wallet_accounts.length > 0 ? (
                        virtual_wallet_accounts.map(account => {
                            return (
                                <VirtualWalletCard
                                    amount={response.authorize.balance}
                                    currency={response.authorize.currency}
                                    getWalletLabels={getWalletLabels}
                                    is_actions_footer={true}
                                    onClickReset={() => {
                                        console.log('Reset clicked!');
                                    }}
                                    onClickTransactions={() => {
                                        console.log('Transactions clicked!');
                                    }}
                                    wallet_name={account?.wallet[0].payment_method}
                                />
                            );
                        })
                    ) : (
                        <GetWallet
                            label={localize('Get a demo wallet')}
                            onClickGetWallet={() => {
                                console.log('Get demo wallet clicked!');
                            }}
                        />
                    )}
                </div>
            </div>
            <div className='dw-app-section'>
                <AppSection title={localize('Options & Multipliers')} virtual={true}>
                    {virtual_trading_accounts.map(account => {
                        return (
                            //TODO: Use values from API once ready
                            <AppCard
                                amount={response.authorize.balance.toString()}
                                app_icon='IcBrandDerivApps'
                                app_name='Deriv Apps'
                                broker={response.authorize.landing_company_fullname}
                                currency={response.authorize.currency.toString()}
                                getCardLabels={getAppCardLabels}
                                is_swap_free={false}
                                is_virtual={!!account?.is_virtual}
                                linked_wallet={getLinkedWallet(account?.loginid).toString()}
                                login_id={account?.loginid}
                                onAddRealClick={() => {
                                    console.log('Add real clicked!');
                                }}
                                onDepositClick={() => {
                                    console.log('Deposit clicked!');
                                }}
                                onPlayClick={() => {
                                    console.log('Play clicked!');
                                }}
                                onSettingsClick={() => {
                                    console.log('Settings clicked!');
                                }}
                                onTransactionsClick={() => {
                                    console.log('Transactions clicked!');
                                }}
                                onWithdrawClick={() => {
                                    console.log('Withdraw clicked!');
                                }}
                                server='Deriv Server'
                                show_footer={true}
                                show_hover_actions={true}
                                variant='default'
                            />
                        );
                    })}
                </AppSection>
            </div>
            <div className='dw-app-section'>
                {virtual_mt5_accounts.length > 0 ? (
                    <AppSection title={localize('CFDs')} virtual={true}>
                        {
                            //TODO: Add logic once mt5_login_list API is ready
                        }
                    </AppSection>
                ) : (
                    <CFDsBanner
                        getDmt5SyntheticsClick={() => console.log('DMT5 Synthetics clicked')}
                        getDmt5FinancialClick={() => console.log('DMT5 Financial clicked')}
                        getDmt5FinancialStpClick={() => console.log('DMT5FinancialSTP clicked')}
                        small={true}
                    />
                )}
            </div>
        </React.Fragment>
    );
};

type TDemoProps = {};

export default Demo;
