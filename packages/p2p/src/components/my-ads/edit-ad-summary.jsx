import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Text } from '@deriv/components';
import { buy_sell } from 'Constants/buy-sell';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { roundOffDecimal, setDecimalPlaces } from 'Utils/format-value.js';

const EditAdSummary = ({ market_feed, offer_amount, price_rate, type }) => {
    const { general_store } = useStores();
    const { currency, local_currency_config } = general_store.client;
    const decimal_places = setDecimalPlaces(market_feed, 6);

    const is_amount_and_rate_available = offer_amount && price_rate;

    const display_offer_amount = offer_amount ? formatMoney(currency, offer_amount, true) : '';
    let display_price_rate = '';
    let display_total = '';

    if (market_feed && price_rate) {
        display_price_rate = formatMoney(
            local_currency_config.currency,
            roundOffDecimal(parseFloat(market_feed * (1 + price_rate / 100)), decimal_places),
            true,
            decimal_places
        );
    } else if (price_rate) {
        display_price_rate = formatMoney(local_currency_config.currency, price_rate, true);
    }

    if (market_feed && is_amount_and_rate_available) {
        display_total = formatMoney(
            local_currency_config.currency,
            offer_amount * roundOffDecimal(parseFloat(market_feed * (1 + price_rate / 100))),
            true
        );
    } else if (is_amount_and_rate_available) {
        display_total = formatMoney(local_currency_config.currency, offer_amount * price_rate, true);
    }

    if (offer_amount) {
        const components = [
            <Text key={0} weight='bold' size='xs' color='status-info-blue' />,
            <Text key={1} weight='normal' size='xs' color='status-info-blue' />,
        ];
        const values = { target_amount: display_offer_amount, target_currency: currency };

        if (price_rate) {
            Object.assign(values, {
                local_amount: display_total,
                local_currency: local_currency_config.currency,
                price_rate: display_price_rate,
            });

            if (type === buy_sell.BUY) {
                return (
                    <Localize
                        i18n_default_text="You're editing an ad to buy <0>{{ target_amount }} {{ target_currency }}</0> for <0>{{ local_amount }} {{ local_currency }}</0> <1>({{ price_rate }} {{local_currency}}/{{ target_currency }})</1>"
                        components={components}
                        values={values}
                    />
                );
            }

            return (
                <Localize
                    i18n_default_text="You're editing an ad to sell <0>{{ target_amount }} {{ target_currency }}</0> for <0>{{ local_amount }} {{ local_currency }}</0> <1>({{ price_rate }} {{local_currency}}/{{ target_currency }})</1>"
                    components={components}
                    values={values}
                />
            );
        }

        if (type === buy_sell.BUY) {
            return (
                <Localize
                    i18n_default_text="You're editing an ad to buy <0>{{ target_amount }} {{ target_currency }}</0>..."
                    components={components}
                    values={values}
                />
            );
        }

        return (
            <Localize
                i18n_default_text="You're editing an ad to sell <0>{{ target_amount }} {{ target_currency }}</0>..."
                components={components}
                values={values}
            />
        );
    }

    return type === buy_sell.BUY ? (
        <Localize i18n_default_text="You're editing an ad to buy..." />
    ) : (
        <Localize i18n_default_text="You're editing an ad to sell..." />
    );
};

EditAdSummary.propTypes = {
    offer_amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    market_feed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.string,
};

export default observer(EditAdSummary);
