import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, Dropdown, MobileWrapper, SelectNative, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import PaymentAgentCard from '../payment-agent-card';
import PaymentAgentWithdrawConfirm from '../payment-agent-withdraw-confirm';
import PaymentAgentWithdrawForm from '../payment-agent-withdraw-form';
import PaymentAgentReceipt from '../payment-agent-receipt';
import PaymentAgentDisclaimer from '../payment-agent-disclaimer';

const PaymentAgentDepositWithdrawContainer = ({
    app_contents_scroll_ref,
    is_dark_mode_on,
    is_deposit,
    is_try_withdraw_successful,
    is_withdraw_successful,
    onChangePaymentMethod,
    payment_agent_list,
    resetPaymentAgent,
    selected_bank,
    supported_banks,
    verification_code,
}) => {
    React.useEffect(() => {
        return () => {
            if (!is_deposit) {
                resetPaymentAgent();
            }
        };
    }, [resetPaymentAgent]);

    React.useEffect(() => {
        return () => {
            onChangePaymentMethod({ target: { value: '0' } });
        };
    }, []);

    React.useEffect(() => {
        if (app_contents_scroll_ref.current) app_contents_scroll_ref.current.scrollTop = 0;
    }, [is_try_withdraw_successful, is_withdraw_successful]);

    const [is_unlisted_withdraw, setIsUnlistedWithdraw] = React.useState(false);

    const list_with_default = [
        { text: <Localize i18n_default_text='All payment methods' />, value: 0 },
        ...supported_banks,
    ];

    if (is_try_withdraw_successful) {
        return <PaymentAgentWithdrawConfirm verification_code={verification_code} />;
    }

    if (is_withdraw_successful) {
        return <PaymentAgentReceipt />;
    }

    if (is_unlisted_withdraw) {
        return (
            <PaymentAgentWithdrawForm
                verification_code={verification_code}
                setIsUnlistedWithdraw={setIsUnlistedWithdraw}
            />
        );
    }

    return (
        <React.Fragment>
            <MobileWrapper>
                <PaymentAgentDisclaimer />
            </MobileWrapper>
            <div className='payment-agent-list__list-header'>
                {is_deposit ? (
                    <Text as='p' line_height='s' size='xs'>
                        <Localize i18n_default_text='Contact your preferred payment agent for payment instructions and make your deposit.' />
                    </Text>
                ) : (
                    <Text as='p' line_height='s' size='xs'>
                        <Localize
                            i18n_default_text='Choose your preferred payment agent and enter your withdrawal amount. If your payment agent is not listed, <0>search for them using their account number</0>.'
                            components={[
                                <span
                                    data-testid='dt_withdrawal_link'
                                    key={0}
                                    className='link'
                                    onClick={() => setIsUnlistedWithdraw(!is_unlisted_withdraw)}
                                />,
                            ]}
                        />
                    </Text>
                )}
            </div>
            <div className='payment-agent-list__list-selector'>
                {supported_banks.length > 1 && (
                    <React.Fragment>
                        <DesktopWrapper>
                            <Dropdown
                                id='payment_methods'
                                classNameItems='cashier__drop-down-items'
                                list={list_with_default}
                                name='payment_methods'
                                value={selected_bank}
                                onChange={onChangePaymentMethod}
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <SelectNative
                                placeholder={localize('All payment methods')}
                                name='payment_methods'
                                list_items={supported_banks}
                                value={selected_bank === 0 ? '' : selected_bank.toString()}
                                label={selected_bank === 0 ? localize('All payment methods') : localize('Type')}
                                onChange={e =>
                                    onChangePaymentMethod({
                                        target: {
                                            name: 'payment_methods',
                                            value: e.target.value ? e.target.value.toLowerCase() : 0,
                                        },
                                    })
                                }
                                use_text={false}
                            />
                        </MobileWrapper>
                    </React.Fragment>
                )}
            </div>
            {payment_agent_list.map((payment_agent, idx) => {
                return (
                    <PaymentAgentCard
                        key={idx}
                        is_dark_mode_on={is_dark_mode_on}
                        is_deposit={is_deposit}
                        payment_agent={payment_agent}
                    />
                );
            })}
        </React.Fragment>
    );
};

PaymentAgentDepositWithdrawContainer.propTypes = {
    app_contents_scroll_ref: PropTypes.object,
    is_dark_mode_on: PropTypes.bool,
    is_deposit: PropTypes.bool,
    is_try_withdraw_successful: PropTypes.bool,
    is_withdraw_successful: PropTypes.bool,
    onChangePaymentMethod: PropTypes.func,
    payment_agent_list: PropTypes.array,
    resetPaymentAgent: PropTypes.func,
    selected_bank: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    supported_banks: MobxPropTypes.arrayOrObservableArray,
    verification_code: PropTypes.string,
};

export default connect(({ modules, ui }) => ({
    is_dark_mode_on: ui.is_dark_mode_on,
    is_try_withdraw_successful: modules.cashier.payment_agent.is_try_withdraw_successful,
    is_withdraw_successful: modules.cashier.payment_agent.is_withdraw_successful,
    onChangePaymentMethod: modules.cashier.payment_agent.onChangePaymentMethod,
    payment_agent_list: modules.cashier.payment_agent.filtered_list,
    resetPaymentAgent: modules.cashier.payment_agent.resetPaymentAgent,
    selected_bank: modules.cashier.payment_agent.selected_bank,
    supported_banks: modules.cashier.payment_agent.supported_banks,
    app_contents_scroll_ref: ui.app_contents_scroll_ref,
}))(PaymentAgentDepositWithdrawContainer);
