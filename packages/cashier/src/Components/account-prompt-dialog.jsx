import PropTypes from 'prop-types';
import React from 'react';
import { isCryptocurrency } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { Dialog } from '@deriv/components';
import { connect } from 'Stores/connect';

const AccountPromptDialog = ({
    accounts_list,
    continueRoute,
    currency,
    is_confirmed,
    last_location,
    onCancel,
    onConfirm,
    should_show,
}) => {
    React.useEffect(continueRoute, [is_confirmed, last_location]);

    const non_crypto_accounts = accounts_list.filter(x => !x.is_crypto);
    const non_crypto_currency = non_crypto_accounts.map(x => x.currency)[0];
    const is_crypto = !!currency && isCryptocurrency(currency);

    return (
        <Dialog
            className='acc-prompt-dialog'
            title={is_crypto ? localize('Switch account?') : localize('Switch to crypto account?')}
            confirm_button_text={is_crypto ? localize('Switch account') : localize('Switch to crypto account')}
            cancel_button_text={localize('Cancel')}
            onConfirm={onConfirm}
            onCancel={onCancel}
            is_visible={should_show}
        >
            {is_crypto ? (
                <Localize
                    i18n_default_text='To deposit money, please switch to your {{currency_symbol}} account.'
                    values={{
                        currency_symbol: non_crypto_currency?.toUpperCase(),
                    }}
                />
            ) : (
                <Localize i18n_default_text='To deposit cryptocurrency, switch your account.' />
            )}
        </Dialog>
    );
};

AccountPromptDialog.propTypes = {
    accounts_list: PropTypes.array,
    continueRoute: PropTypes.func,
    is_confirmed: PropTypes.bool,
    last_location: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    should_show: PropTypes.bool,
};

export default connect(({ client, modules }) => ({
    accounts_list: modules.cashier.config.account_transfer.accounts_list,
    continueRoute: modules.cashier.account_prompt_dialog.continueRoute,
    currency: client.currency,
    is_confirmed: modules.cashier.account_prompt_dialog.is_confirmed,
    last_location: modules.cashier.account_prompt_dialog.last_location,
    onCancel: modules.cashier.account_prompt_dialog.onCancel,
    onConfirm: modules.cashier.account_prompt_dialog.onConfirm,
    should_show: modules.cashier.account_prompt_dialog.should_show,
}))(AccountPromptDialog);
