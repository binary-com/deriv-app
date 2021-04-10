import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { AppCard, Text, ThemedScrollbars, RealWalletCard } from '@deriv/components';
import { localize } from '@deriv/translations';
import GetWallet from 'Components/my-apps/get-wallet';
import TradingAppBanner from 'Components/my-apps/banner/app-banner/trading-app-banner';
import SwapFreeBanner from 'Components/my-apps/banner/app-banner/swap-free-banner';
import CFDsBanner from 'Components/my-apps/banner/app-banner/cfds-banner';
import WalletBanner from 'Components/my-apps/banner/wallet-banner';
import GetWalletModal from 'Components/modals/get-wallet-modal';
import { getWalletLabels, getAppCardLabels } from 'Constants/component-labels';
import AppSection from 'Components/my-apps/app-section';
import { response } from 'Components/my-apps/constants';
import { useStores } from 'Stores';

const Real: React.FC<TRealProps> = observer(({}) => {
    const { ui_store } = useStores();

    // TODO: Refactor all these methods to store once API is ready
    const real_wallet_accounts = !!response.authorize.account_list.some(account => account.wallet)
        ? response.authorize.account_list
              .map(account => {
                  if (account.wallet && !!!account.is_virtual) return account;
                  return;
              })
              .filter(account => account)
        : [];

    const real_trading_accounts = !!response.authorize.account_list.some(account => account.trading)
        ? response.authorize.account_list
              .map(account => {
                  if (account.trading && !!!account.is_virtual) return account;
                  return;
              })
              .filter(account => account)
        : [];

    const getLinkedWallet = (login_id: string | undefined) => {
        return real_wallet_accounts
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
                <ThemedScrollbars is_only_horizontal>
                    <div className='dw-my-apps__wallet-section-container'>
                        {real_wallet_accounts.length > 0 ? (
                            <React.Fragment>
                                {real_wallet_accounts.map(account => {
                                    return (
                                        <div>
                                            <RealWalletCard
                                                amount={response.authorize.balance}
                                                currency={response.authorize.currency}
                                                getWalletLabels={getWalletLabels}
                                                is_actions_footer={true}
                                                is_temporarily_unavailable={false}
                                                onClickDeposit={() => {
                                                    console.log('Deposit clicked!');
                                                }}
                                                onClickSettings={() => {
                                                    console.log('Settings clicked!');
                                                }}
                                                onClickTransactions={() => {
                                                    console.log('Transactions clicked!');
                                                }}
                                                onClickTransfer={() => {
                                                    console.log('Transfer clicked!');
                                                }}
                                                onClickWithdrawal={() => {
                                                    console.log('Withdrawal clicked!');
                                                }}
                                                wallet_name={account?.wallet[0].payment_method}
                                            />
                                        </div>
                                    );
                                })}
                                <GetWallet
                                    label={localize('Get more wallets')}
                                    onClickGetWallet={() => {
                                        console.log('Get more wallet clicked!');
                                    }}
                                />
                            </React.Fragment>
                        ) : (
                            <WalletBanner getWalletClick={ui_store.enableGetPasswordModal} />
                        )}
                    </div>
                </ThemedScrollbars>
            </div>
            {real_trading_accounts.length === 0 ? (
                <React.Fragment>
                    <div className='dw-app-section-container'>
                        <TradingAppBanner getTradingAppClick={() => console.log('Trading app clicked')} small={false} />
                        <CFDsBanner
                            getDmt5SyntheticsClick={() => console.log('DMT5 Synthetics clicked')}
                            getDmt5FinancialClick={() => console.log('DMT5 Financial clicked')}
                            getDmt5FinancialStpClick={() => console.log('DMT5FinancialSTP clicked')}
                            small={false}
                        />
                        <SwapFreeBanner
                            getDmt5SyntheticsClick={() => console.log('DMT5 Synthetics clicked')}
                            getDmt5FinancialClick={() => console.log('DMT5Financial clicked')}
                            small={false}
                        />
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className='dw-app-section'>
                        <AppSection title={localize('Options & Multipliers')} virtual={false}>
                            {real_trading_accounts.map(account => {
                                return (
                                    <AppCard
                                        amount={response.authorize.balance.toString()}
                                        app_icon='IcBrandDerivApps'
                                        app_name={localize('Deriv Apps')}
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
                                        server={localize('Deriv Server')}
                                        show_footer={true}
                                        show_hover_actions={true}
                                        variant='default'
                                    />
                                );
                            })}
                        </AppSection>
                    </div>
                    <div className='dw-app-section-container dw-app-section-container--banner'>
                        <CFDsBanner
                            getDmt5SyntheticsClick={() => console.log('DMT5 Synthetics clicked')}
                            getDmt5FinancialClick={() => console.log('DMT5 Financial clicked')}
                            getDmt5FinancialStpClick={() => console.log('DMT5FinancialSTP clicked')}
                            small={true}
                        />
                        <SwapFreeBanner
                            getDmt5SyntheticsClick={() => console.log('DMT5 Synthetics clicked')}
                            getDmt5FinancialClick={() => console.log('DMT5Financial clicked')}
                            small={true}
                        />
                    </div>
                    {
                        //TODO: Add logic for MT5 app cards once mt5_login_list API is ready
                    }
                </React.Fragment>
            )}
            <GetWalletModal app_title={localize('DMT5 Synthetic')} app_icon={'IcBrandDmt5Synthetics'} />
        </React.Fragment>
    );
});

type TRealProps = {};

export default Real;
