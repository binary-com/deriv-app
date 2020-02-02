import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CurrencyUtils from '@deriv/shared/utils/currency';
import CryptoMoney from '../crypto-money';

const Money = ({
    amount,
    className,
    currency = 'USD',
    has_sign,
    should_format = true,
}) => {
    let sign = '';
    if (+amount && (amount < 0 || has_sign)) {
        sign = amount > 0 ? '+' : '-';
    }

    // if it's formatted already then don't make any changes unless we should remove extra -/+ signs
    const value = (has_sign || should_format) ? Math.abs(amount) : amount;
    const decimalPart = CurrencyUtils.getDecimalPart(amount);
    const needsCryptoToggle = CurrencyUtils.isCryptocurrency(currency) &&
        (decimalPart && decimalPart.length > CurrencyUtils.getDecimalPlaces(currency));
    let final_amount = null;
    if (needsCryptoToggle) {
        final_amount = CurrencyUtils.getCryptoFormat(value);
    } else {
        final_amount = should_format ? CurrencyUtils.formatMoney(currency, value, true) : value;
    }
    return (
        <React.Fragment>
            {has_sign && sign}
            <span
                className={classNames(className, 'symbols', `symbols--${currency.toLowerCase()}`)}
            />
            {needsCryptoToggle ? <CryptoMoney {...final_amount} /> : final_amount}
        </React.Fragment>
    );
};

Money.propTypes = {
    amount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    className    : PropTypes.string,
    currency     : PropTypes.string,
    has_sign     : PropTypes.bool,
    should_format: PropTypes.bool,
};

export default Money;
