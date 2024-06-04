import { useHistory } from 'react-router';
import { Button, Text } from '@deriv/components';
import { getCurrencyName, routes, isCryptocurrency, startPerformanceEventTimer } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import BalanceText from 'Components/elements/text/balance-text';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import { useStore, observer } from '@deriv/stores';
import { IsIconCurrency } from 'Assets/svgs/currency';

const default_balance = { balance: 0, currency: 'USD' };

const RealAccountCard = observer(() => {
    const history = useHistory();

    const { client, common, modules, traders_hub } = useStore();

    const { accounts, loginid } = client;
    const { current_language } = common;
    const { current_list } = modules.cfd;
    const { openModal, is_eu_user, selected_account_type } = traders_hub;

    const { balance, currency } = loginid ? accounts[loginid] : default_balance;

    const has_mf_mt5_account = Object.keys(current_list)
        .map(key => current_list[key])
        .some(account => account.landing_company_short === 'maltainvest');

    const uppercase_currency = currency?.toUpperCase();
    const get_currency = IsIconCurrency(uppercase_currency) ? uppercase_currency : 'Unknown';

    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            title={
                currency ? (
                    <BalanceText currency={get_currency} balance={Number(balance)} size='xs' />
                ) : (
                    'No currency assigned'
                )
            }
            icon={get_currency}
            onClick={() => {
                if (!is_eu_user && !has_mf_mt5_account) {
                    openModal('currency_selection');
                }
                return openModal('currency_selection');
            }}
            actions={
                currency && (
                    <Button
                        onClick={(e: MouseEvent) => {
                            Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                action: 'deposit_balance',
                                form_name: 'traders_hub_default',
                                account_mode: selected_account_type,
                            });
                            if (isCryptocurrency(currency))
                                startPerformanceEventTimer('load_crypto_deposit_cashier_time');
                            else startPerformanceEventTimer('load_fiat_deposit_cashier_time');
                            e.stopPropagation();
                            history.push(`${routes.cashier_deposit}#deposit`);
                        }}
                        secondary
                        className='currency-switcher__button'
                    >
                        <Localize
                            key={`currency-switcher__button-text-${current_language}`}
                            i18n_default_text='Deposit'
                        />
                    </Button>
                )
            }
            has_interaction
        >
            <Text color='primary' size='xs' line_height='s'>
                {getCurrencyName(currency)}
            </Text>
        </CurrencySwitcherContainer>
    );
});

export default RealAccountCard;
