import React from 'react';
import { Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import BalanceText from 'Components/elements/text/balance-text';
import { observer, useStore } from '@deriv/stores';
import './asset-summary.scss';
import TotalAssetsLoader from 'Components/pre-loader/total-assets-loader';
import {
    useTotalAccountBalance,
    useCFDAccounts,
    usePlatformAccounts,
    useTotalAssetCurrency,
    useExchangeRate,
} from '@deriv/hooks';
import { isRatesLoaded } from '../../helpers';

const AssetSummary = observer(() => {
    const { isDesktop } = useDevice();
    const {
        traders_hub,
        client,
        common,
        modules,
        gtm: { pushDataLayer },
    } = useStore();

    const { selected_account_type, is_eu_user, no_CR_account, no_MF_account } = traders_hub;
    const {
        is_logging_in,
        is_switching,
        default_currency,
        is_landing_company_loaded,
        is_mt5_allowed,
        is_populating_account_list,
        is_populating_mt5_account_list,
        is_populating_dxtrade_account_list,
        is_populating_ctrader_account_list,
    } = client;
    const { account_transfer, general_store } = modules.cashier;
    const { is_transfer_confirm } = account_transfer;
    const { is_loading } = general_store;
    const { current_language } = common;
    const { real: platform_real_accounts, demo: platform_demo_account } = usePlatformAccounts();
    const { real: cfd_real_accounts, demo: cfd_demo_accounts } = useCFDAccounts();

    const is_still_waiting_for_loading_accounts =
        is_populating_account_list ||
        is_populating_mt5_account_list ||
        is_populating_dxtrade_account_list ||
        is_populating_ctrader_account_list;

    const platform_real_balance = useTotalAccountBalance(platform_real_accounts);
    const cfd_real_balance = useTotalAccountBalance(cfd_real_accounts);
    const cfd_demo_balance = useTotalAccountBalance(cfd_demo_accounts);
    const total_assets_real_currency = useTotalAssetCurrency();
    const { exchange_rates } = useExchangeRate();

    const is_real = selected_account_type === 'real';

    const real_total_balance = platform_real_balance.balance + cfd_real_balance.balance;
    const demo_total_balance = (platform_demo_account?.balance || 0) + cfd_demo_balance.balance;

    const has_active_related_deriv_account = !((no_CR_account && !is_eu_user) || (no_MF_account && is_eu_user)); // if selected region is non-eu, check active cr accounts, if selected region is eu- check active mf accounts
    const eu_account = is_eu_user && !no_MF_account;
    const cr_account = !is_eu_user && !no_CR_account;

    const eu_mt5_allowed_total_assets = is_mt5_allowed
        ? localize('Total assets in your Deriv Apps and Deriv MT5 CFDs demo account.')
        : localize('Total assets in your account.');

    const should_show_loader =
        ((is_switching || is_logging_in) && (eu_account || cr_account)) ||
        !is_landing_company_loaded ||
        is_loading ||
        is_transfer_confirm ||
        is_still_waiting_for_loading_accounts ||
        !isRatesLoaded(is_real, total_assets_real_currency, platform_real_accounts, cfd_real_accounts, exchange_rates);

    React.useEffect(() => {
        if (!should_show_loader && is_real) {
            if (real_total_balance == 0) {
                pushDataLayer({ event: 'balance', value: false });
            } else if (real_total_balance > 0) {
                pushDataLayer({ event: 'balance', value: true });
            }
        }
    }, [should_show_loader, is_real, pushDataLayer, real_total_balance]);

    if (should_show_loader) {
        return (
            <React.Fragment>
                <div className='asset-summary__container content-loader'>
                    <TotalAssetsLoader />
                </div>
            </React.Fragment>
        );
    }

    return (
        <div className='asset-summary'>
            {has_active_related_deriv_account || selected_account_type === 'demo' ? (
                <React.Fragment>
                    {isDesktop ? (
                        <Text align='right' key={`asset-summary--key-${current_language}`} size='xs' line_height='s'>
                            {localize('Total assets')}
                        </Text>
                    ) : null}
                    <Popover
                        alignment={isDesktop ? 'left' : 'top'}
                        message={
                            is_eu_user ? eu_mt5_allowed_total_assets : localize('Total assets in all your accounts')
                        }
                        zIndex={9999}
                        is_bubble_hover_enabled
                    >
                        <BalanceText
                            currency={
                                is_real
                                    ? platform_real_balance.currency || ''
                                    : platform_demo_account?.currency || default_currency
                            }
                            balance={is_real ? real_total_balance : demo_total_balance}
                            underline_style='dotted'
                        />
                    </Popover>
                </React.Fragment>
            ) : null}
        </div>
    );
});

export default AssetSummary;
