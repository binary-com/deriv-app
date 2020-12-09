import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';

const AdSummary = observer(({ offer_amount, price_rate, type }) => {
    const { general_store } = useStores();
    const { currency, local_currency_config } = general_store.client;

    const display_offer_amount = offer_amount ? formatMoney(currency, offer_amount, true) : '';
    const display_price_rate = price_rate ? formatMoney(local_currency_config.currency, price_rate, true) : '';
    const display_total =
        offer_amount && price_rate ? formatMoney(local_currency_config.currency, offer_amount * price_rate, true) : '';
    return (
        // progressively build ad summary as form is filled in
        // e.g. "You're creating an ad to buy 100 USD for 1,400,000 IDR (14,000 IDR/USD)"
        <React.Fragment>
            <Localize
                i18n_default_text="You're creating an ad to {{buy_or_sell}}"
                values={{
                    buy_or_sell: type,
                }}
            />
            {!offer_amount ? '...' : ' '}
            {offer_amount && (
                <span className='p2p-my-ads__form-summary--bold'>
                    {display_offer_amount} {currency}
                </span>
            )}
            {offer_amount && !price_rate ? '...' : ' '}
            {offer_amount && price_rate && (
                <Localize
                    i18n_default_text='for <0>{{total_amount}} {{local_currency}}</0> ({{price_rate}} {{local_currency}}/{{currency}})'
                    values={{
                        total_amount: display_total,
                        local_currency: local_currency_config.currency,
                        price_rate: display_price_rate,
                        currency,
                    }}
                    components={[<span key={0} className='p2p-my-ads__form-summary--bold' />]}
                />
            )}
        </React.Fragment>
    );
});

AdSummary.propTypes = {
    client: PropTypes.object,
    offer_amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.string,
};

export default AdSummary;
