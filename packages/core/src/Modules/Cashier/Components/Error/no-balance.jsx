import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Icon } from '@deriv/components';
import { routes, getCurrencyDisplayCode } from '@deriv/shared';

import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

class NoBalance extends React.Component {
    onClickDeposit = () => {
        // index of deposit tab in the cashier modal is 0
        this.props.setTabIndex(0);
        this.props.history.push(routes.cashier_deposit);
    };

    render = () => {
        return (
            <div className='cashier__wrapper cashier__no-balance'>
                <Icon icon='IcCashierNoBalance' className='cashier__no-balance-icon' size={116} />
                <h2 className='withdraw__header'>
                    <Localize
                        i18n_default_text='You have no funds in your {{currency}} account'
                        values={{ currency: getCurrencyDisplayCode(this.props.currency) }}
                    />
                </h2>

                <p className='cashier__text'>
                    <Localize i18n_default_text='Please make a deposit to use this feature.' />
                </p>

                <Button
                    className='cashier__no-balance-button'
                    has_effect
                    text={localize('Deposit now')}
                    onClick={this.onClickDeposit}
                    primary
                    large
                />
            </div>
        );
    };
}

NoBalance.propTypes = {
    currency: PropTypes.string,
    setTabIndex: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    currency: client.currency,
    setTabIndex: modules.cashier.setCashierTabIndex,
}))(withRouter(NoBalance));
