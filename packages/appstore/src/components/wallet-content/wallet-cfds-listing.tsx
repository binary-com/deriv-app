import React from 'react';
import { Text, StaticUrl, Button } from '@deriv/components';
import { useActiveWallet } from '@deriv/hooks';
import { formatMoney, isCryptocurrency } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import TradingAppCard from 'Components/containers/trading-app-card';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import { getHasDivider } from 'Constants/utils';
import { useStore, observer } from '@deriv/stores';
import { TDetailsOfEachMT5Loginid } from 'Types';
import './wallet-content.scss';

type TProps = {
    fiat_wallet_currency?: string;
};

const CryptoCFDs = observer(({ fiat_wallet_currency }: TProps) => {
    const { traders_hub, ui } = useStore();
    const { setWalletModalActiveWalletID, setWalletModalActiveTab } = traders_hub;

    const { is_mobile, setIsWalletModalVisible } = ui;

    const wallet_account = useActiveWallet();
    if (!wallet_account) return null;

    return (
        <div className='wallet-content__cfd-crypto'>
            <Text
                size={is_mobile ? 'xs' : 's'}
                weight='bold'
                line_height={is_mobile ? 'xl' : 'xxl'}
                as='p'
                className='wallet-content__cfd-crypto-title'
            >
                <Localize
                    i18n_default_text='To trade CFDs, you’ll need to use your {{fiat_wallet_currency}} Wallet. Click Transfer to move your {{currency}} to your {{fiat_wallet_currency}} Wallet.'
                    values={{ fiat_wallet_currency, currency: wallet_account.currency }}
                />
            </Text>
            <Button
                onClick={() => {
                    setWalletModalActiveTab('Transfer');
                    setIsWalletModalVisible(true);
                    setWalletModalActiveWalletID(wallet_account.loginid);
                }}
                className='wallet-content__cfd-crypto-button'
                primary_light
            >
                <Localize i18n_default_text='Transfer' />
            </Button>
        </div>
    );
});

const FiatCFDs = observer(() => {
    const { traders_hub } = useStore();
    const {
        selected_region,
        getExistingAccounts,
        selected_account_type,
        available_dxtrade_accounts,
        combined_cfd_mt5_accounts,
    } = traders_hub;

    const wallet_account = useActiveWallet();
    if (!wallet_account) return null;

    const getMT5AccountAuthStatus = (current_acc_status: string) => {
        if (current_acc_status === 'proof_failed') {
            return 'failed';
        }
        if (current_acc_status === 'verification_pending') {
            return 'pending';
        }
        return null;
    };

    return (
        <React.Fragment>
            <div className='cfd-full-row'>
                <Text weight='bold' color='prominent'>
                    <Localize i18n_default_text='Deriv MT5' />
                </Text>
            </div>
            {combined_cfd_mt5_accounts.map((existing_account, index) => {
                const {
                    action_type,
                    description,
                    icon,
                    key,
                    landing_company_short,
                    market_type,
                    name,
                    platform,
                    status,
                    sub_title,
                } = existing_account;
                const list_size = combined_cfd_mt5_accounts.length;
                const mt5_account_status = status ? getMT5AccountAuthStatus(status) : null;
                return (
                    <TradingAppCard
                        action_type={action_type}
                        availability={selected_region}
                        clickable_icon
                        icon={icon}
                        sub_title={sub_title}
                        name={!mt5_account_status ? name : ''}
                        short_code_and_region={wallet_account.landing_company_name}
                        platform={platform}
                        description={description}
                        key={key}
                        has_divider={getHasDivider(index, list_size, 3)}
                        mt5_acc_auth_status={mt5_account_status}
                        selected_mt5_jurisdiction={{
                            platform,
                            category: selected_account_type,
                            type: market_type,
                            jurisdiction: landing_company_short,
                        }}
                        wallet_account={wallet_account}
                    />
                );
            })}
            {available_dxtrade_accounts?.length > 0 && (
                <div className='cfd-full-row'>
                    <Text weight='bold' color='prominent'>
                        <Localize i18n_default_text='Other CFDs' />
                    </Text>
                </div>
            )}
            {available_dxtrade_accounts?.map(account => {
                const existing_accounts = getExistingAccounts(account.platform ?? '', account.market_type ?? '');
                const has_existing_accounts = existing_accounts.length > 0;
                return has_existing_accounts ? (
                    existing_accounts.map((existing_account: TDetailsOfEachMT5Loginid) => (
                        <TradingAppCard
                            action_type='multi-action'
                            availability={selected_region}
                            clickable_icon
                            icon={account.icon}
                            sub_title={account.name}
                            name={`${formatMoney(existing_account.currency, existing_account.display_balance, true)} ${
                                existing_account.currency
                            }`}
                            description={existing_account.login}
                            platform={account.platform}
                            key={`trading_app_card_${existing_account.login}`}
                            wallet_account={wallet_account}
                        />
                    ))
                ) : (
                    <TradingAppCard
                        action_type='get'
                        availability={selected_region}
                        clickable_icon
                        icon={account.icon}
                        name={account.name}
                        platform={account.platform}
                        description={account.description}
                        key={`trading_app_card_${account.name}`}
                        wallet_account={wallet_account}
                    />
                );
            })}
        </React.Fragment>
    );
});

const WalletCFDsListing = observer(({ fiat_wallet_currency = 'USD' }: TProps) => {
    const {
        client,
        modules: { cfd },
        ui,
    } = useStore();

    const { toggleCompareAccountsModal } = cfd;
    const { is_landing_company_loaded, is_logging_in, is_switching } = client;
    const { is_mobile } = ui;

    const wallet_account = useActiveWallet();

    if (!wallet_account || !is_landing_company_loaded || is_switching || is_logging_in)
        return (
            <div className='wallet-content__loader'>
                <PlatformLoader />
            </div>
        );

    const { currency, landing_company_name, is_virtual } = wallet_account;
    const accounts_sub_text =
        landing_company_name === 'svg' || is_virtual ? (
            <Localize i18n_default_text='Compare accounts' />
        ) : (
            <Localize i18n_default_text='Account information' />
        );

    const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';

    return (
        <ListingContainer
            className='wallet-content__border-reset wallet-content__cfd'
            title={
                !is_mobile && (
                    <div className='cfd-accounts__title'>
                        <Text size='sm' weight='bold' color='prominent'>
                            <Localize i18n_default_text='CFDs' />
                        </Text>
                        <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                            <Text key={0} color='red' size='xxs' weight='bold' styles={{ marginLeft: '1rem' }}>
                                {accounts_sub_text}
                            </Text>
                        </div>
                    </div>
                )
            }
            description={
                <Text size='xs' line_height='s'>
                    <Localize
                        i18n_default_text={
                            'Trade with leverage and tight spreads for better returns on trades. <0>Learn more</0>'
                        }
                        components={[<StaticUrl key={0} className='options' href='/trade-types/cfds' />]}
                    />
                </Text>
            }
            is_outside_grid_container={!is_fiat}
        >
            {is_mobile && (
                <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                    <Text size='xs' color='red' weight='bold' line_height='s'>
                        {accounts_sub_text}
                    </Text>
                </div>
            )}
            {is_fiat ? <FiatCFDs /> : <CryptoCFDs fiat_wallet_currency={fiat_wallet_currency} />}
        </ListingContainer>
    );
});

export default WalletCFDsListing;
