import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { Icon, Checklist, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import CashierLocked from './cashier-locked.jsx';

const WithdrawalLocked = ({ account_status, is_10K_limit, is_withdrawal_lock, is_ask_financial_risk_approval }) => {
    const { document, identity, needs_verification } = account_status.authentication;

    const is_poi_needed = needs_verification.includes('identity') || (is_10K_limit && identity.status !== 'verified');
    const has_poi_submitted = identity.status !== 'none';
    const poi_text = has_poi_submitted
        ? localize('Check proof of identity document verification status')
        : localize('Upload a proof of identity to verify your identity');

    const is_poa_needed = (is_10K_limit && needs_verification.includes('document')) || document?.status !== 'verified';
    const has_poa_submitted = document?.status !== 'none';
    const poa_text = has_poa_submitted
        ? localize('Check proof of address document verification status')
        : localize('Upload a proof of address to verify your address');
    const history = useHistory();

    const items = [
        ...(is_poi_needed
            ? [
                  {
                      content: poi_text,
                      status: 'action',
                      onClick: () => history.push(routes.proof_of_identity),
                  },
              ]
            : []),
        ...(is_poa_needed
            ? [
                  {
                      content: poa_text,
                      status: 'action',
                      onClick: () => history.push(routes.proof_of_address),
                  },
              ]
            : []),
        ...(is_ask_financial_risk_approval
            ? [
                  {
                      content: localize('Complete the financial assessment form'),
                      status: 'action',
                      onClick: () => history.push(routes.financial_assessment),
                  },
              ]
            : []),
    ];
    return (
        <React.Fragment>
            {items.length || is_withdrawal_lock ? (
                <div className='cashier-locked'>
                    <Icon icon='IcCashierWithdrawalLock' className='cashier-locked__icon' />
                    <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                        {is_10K_limit
                            ? localize(
                                  'You have reached the withdrawal limit. Please upload your proof of identity and address to lift your withdrawal limit and proceed with your withdrawal.'
                              )
                            : localize('Withdrawals are locked')}
                    </Text>
                    {is_withdrawal_lock ? (
                        <p className='cashier-locked__desc'>{localize('Please check your email for more details.')}</p>
                    ) : (
                        <React.Fragment>
                            {!is_10K_limit && (
                                <p className='cashier-locked__desc'>
                                    {localize('To enable this feature you must complete the following:')}
                                </p>
                            )}
                            <Checklist className='cashier-locked__checklist' items={items} />
                        </React.Fragment>
                    )}
                </div>
            ) : (
                <CashierLocked />
            )}
        </React.Fragment>
    );
};

WithdrawalLocked.propTypes = {
    account_status: PropTypes.object,
    is_10K_limit: PropTypes.bool,
    is_withdrawal_lock: PropTypes.bool,
    is_ask_financial_risk_approval: PropTypes.bool,
};

export default connect(({ modules, client }) => ({
    account_status: client.account_status,
    is_withdrawal_lock: client.is_withdrawal_lock,
    is_ask_financial_risk_approval: modules.cashier.general.config.withdraw.error.is_ask_financial_risk_approval,
}))(WithdrawalLocked);
