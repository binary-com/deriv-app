import AccountLimits from 'Components/account-limits/account-limits.jsx';
import { connect } from 'Stores/connect';

export default connect(({ client, common, ui }) => ({
    account_limits: client.account_limits,
    currency: client.currency,
    getLimits: client.getLimits,
    is_fully_authenticated: client.is_fully_authenticated,
    is_navigated_from_deriv_go: common.is_navigated_from_deriv_go,
    is_virtual: client.is_virtual,
    is_switching: client.is_switching,
    should_show_article: true,
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(AccountLimits);
