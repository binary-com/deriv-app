import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { formatMoney } from '@deriv/shared';

const Money = ({
    amount,
    className,
    currency = 'USD',
    has_sign,
    should_format = true,
    should_format_crypto = true,
}) => {
    let sign = '';
    if (+amount && (amount < 0 || has_sign)) {
        sign = amount > 0 ? '+' : '-';
    }

    // if it's formatted already then don't make any changes unless we should remove extra -/+ signs
    const value = has_sign || should_format ? Math.abs(amount) : amount;
    const final_amount = should_format
        ? formatMoney({
              currency_value: currency,
              amount: value,
              exclude_currency: true,
              should_format_crypto,
          })
        : value;

    return (
        <React.Fragment>
            {has_sign && sign}
            <span className={classNames(className, 'symbols', `symbols--${currency.toLowerCase()}`)} />
            {final_amount}
        </React.Fragment>
    );
};

Money.propTypes = {
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    currency: PropTypes.string,
    has_sign: PropTypes.bool,
    should_format: PropTypes.bool,
};

export default React.memo(Money);
