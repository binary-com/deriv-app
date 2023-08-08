import React from 'react';
import { useHistory } from 'react-router';
import { Button, Text } from '@deriv/components';
import { formatMoney, getCurrencyName, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import BalanceText from 'Components/elements/text/balance-text';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import { useStore, observer } from '@deriv/stores';
import { IsIconCurrency } from 'Assets/svgs/currency';
import { useWalletMigration } from '@deriv/hooks';

const default_balance = { balance: 0, currency: 'USD' };

const RealAccountCard = observer(() => {
    const history = useHistory();
    const { is_in_progress } = useWalletMigration();

    const { client, common, modules, traders_hub } = useStore();

    const { accounts, loginid, setWalletsMigrationInProgressPopup } = client;
    const { current_language } = common;
    const { current_list } = modules.cfd;
    const { openModal, is_eu_user } = traders_hub;

    const { balance, currency } = loginid ? accounts[loginid] : default_balance;

    const has_mf_mt5_account = Object.keys(current_list)
        .map(key => current_list[key])
        .some(account => account.landing_company_short === 'maltainvest');

    const get_currency = (IsIconCurrency(currency?.toUpperCase()) && currency) || 'USD';

    const onButtonAction = (e: React.MouseEvent) => {
        if (is_in_progress) {
            setWalletsMigrationInProgressPopup(true);
        } else {
            e.stopPropagation();
            history.push(`${routes.cashier_deposit}#deposit`);
        }
    };

    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            title={
                <Text size='xs' line_height='s'>
                    {getCurrencyName(currency)}
                </Text>
            }
            icon={get_currency}
            onClick={() => {
                if (!is_eu_user && !has_mf_mt5_account) {
                    openModal('currency_selection');
                }
                return openModal('currency_selection');
            }}
            actions={
                <Button
                    onClick={onButtonAction}
                    secondary
                    className='currency-switcher__button'
                    as_disabled={is_in_progress}
                >
                    <Localize key={`currency-switcher__button-text-${current_language}`} i18n_default_text='Deposit' />
                </Button>
            }
            has_interaction
        >
            <BalanceText currency={get_currency} balance={formatMoney(currency, balance, true)} size='xs' />
        </CurrencySwitcherContainer>
    );
});

export default RealAccountCard;
