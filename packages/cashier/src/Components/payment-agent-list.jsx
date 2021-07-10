import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Accordion,
    DesktopWrapper,
    Dropdown,
    Loading,
    MobileWrapper,
    SelectNative,
    Tabs,
    Text,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, website_name } from '@deriv/shared';
import { connect } from 'Stores/connect';
import PaymentAgentDetails from './payment-agent-details.jsx';
import Error from './Error/error.jsx';
import EmailSent from './Email/email-sent.jsx';
import PaymentAgentWithdrawForm from './Form/payment-agent-withdraw-form.jsx';

const PaymentAgentList = ({
    error,
    is_email_sent,
    is_loading,
    is_resend_clicked,
    onChangePaymentMethod,
    onMount,
    payment_agent_list,
    resend_timeout,
    selected_bank,
    sendVerificationEmail,
    supported_banks,
    verification_code,
    is_payment_agent_withdraw,
    payment_agent_active_tab_index,
    setPaymentAgentActiveTabIndex,
}) => {
    React.useEffect(() => {
        onMount();
    }, [onMount]);

    const list_with_default = [
        { text: <Localize i18n_default_text='All payment agents' />, value: 0 },
        ...supported_banks,
    ];

    const setActiveTabIndex = index => {
        setPaymentAgentActiveTabIndex(index);

        if (index === 1) {
            sendVerificationEmail();
        }
    };

    return (
        <div className='cashier__wrapper--align-left cashier__wrapper-padding'>
            {error?.code ? (
                <Error error={error} />
            ) : (
                <React.Fragment>
                    <Text as='p' size='xs' line_height='s' className='cashier__paragraph'>
                        <Localize
                            i18n_default_text='A payment agent is authorised to process deposits and withdrawals for you if your local payment methods or currencies are not supported on {{website_name}}.'
                            values={{ website_name }}
                        />
                    </Text>
                    <div className='payment-agent__instructions'>
                        <Tabs
                            active_index={payment_agent_active_tab_index}
                            className='tabs--desktop'
                            onTabItemClick={setActiveTabIndex}
                            top
                            header_fit_content={isDesktop()}
                        >
                            <div label={localize('Deposit')}>
                                {is_loading ? (
                                    <Loading className='payment-agent__loader' />
                                ) : (
                                    <React.Fragment>
                                        <Text
                                            as='p'
                                            size='xs'
                                            weight='bold'
                                            color='prominent'
                                            className='cashier__header payment-agent__list-header'
                                        >
                                            <Localize i18n_default_text='Payment agents' />
                                        </Text>
                                        <div className='payment-agent__list-line' />
                                        <div className='payment-agent__list-selector'>
                                            <Text as='p' size='xs' line_height='s' className='cashier__paragraph'>
                                                <Localize i18n_default_text='Choose a payment agent and contact them for instructions.' />
                                            </Text>
                                            {supported_banks.length > 1 && (
                                                <div>
                                                    <DesktopWrapper>
                                                        <Dropdown
                                                            id='payment_methods'
                                                            className='payment-agent__drop-down payment-agent__filter'
                                                            classNameDisplay='cashier__drop-down-display payment-agent__filter-display'
                                                            classNameDisplaySpan='cashier__drop-down-display-span'
                                                            classNameItems='cashier__drop-down-items'
                                                            list={list_with_default}
                                                            name='payment_methods'
                                                            value={selected_bank}
                                                            onChange={onChangePaymentMethod}
                                                        />
                                                    </DesktopWrapper>
                                                    <MobileWrapper>
                                                        <SelectNative
                                                            placeholder={localize('Please select')}
                                                            name='payment_methods'
                                                            list_items={supported_banks}
                                                            value={selected_bank}
                                                            label={
                                                                selected_bank === 0
                                                                    ? localize('All payment agents')
                                                                    : localize('Type')
                                                            }
                                                            onChange={e =>
                                                                onChangePaymentMethod({
                                                                    target: {
                                                                        name: 'payment_methods',
                                                                        value: e.target.value.toLowerCase(),
                                                                    },
                                                                })
                                                            }
                                                            use_text={false}
                                                        />
                                                    </MobileWrapper>
                                                </div>
                                            )}
                                        </div>
                                        <Accordion
                                            className='payment-agent__accordion'
                                            list={payment_agent_list.map(payment_agent => ({
                                                header: payment_agent.name,
                                                content: (
                                                    <PaymentAgentDetails
                                                        payment_agent_email={payment_agent.email}
                                                        payment_agent_phone={payment_agent.phone}
                                                        payment_agent_url={payment_agent.url}
                                                    />
                                                ),
                                            }))}
                                        />
                                    </React.Fragment>
                                )}
                                <div className='payment-agent__disclaimer'>
                                    <Text size='xs' line_height='xs' weight='bold' className='cashier__text'>
                                        <Localize i18n_default_text='DISCLAIMER' />
                                    </Text>
                                    :&nbsp;
                                    <Localize
                                        i18n_default_text='{{website_name}} is not affiliated with any Payment Agent. Customers deal with Payment Agents at their sole risk. Customers are advised to check the credentials of Payment Agents, and check the accuracy of any information about Payments Agents (on Deriv or elsewhere) before transferring funds.'
                                        values={{ website_name }}
                                    />
                                </div>
                            </div>
                            <div label={localize('Withdrawal')}>
                                {is_email_sent ? (
                                    <div className='cashier__wrapper'>
                                        <EmailSent
                                            is_email_sent={is_email_sent}
                                            is_resend_clicked={is_resend_clicked}
                                            resend_timeout={resend_timeout}
                                        />
                                    </div>
                                ) : (
                                    (verification_code || is_payment_agent_withdraw) && (
                                        <PaymentAgentWithdrawForm verification_code={verification_code} />
                                    )
                                )}
                            </div>
                        </Tabs>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

PaymentAgentList.propTypes = {
    error: PropTypes.object,
    is_email_sent: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_resend_clicked: PropTypes.bool,
    onChangePaymentMethod: PropTypes.func,
    onMount: PropTypes.func,
    payment_agent_list: PropTypes.array,
    resend_timeout: PropTypes.number,
    selected_bank: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    sendVerificationEmail: PropTypes.func,
    supported_banks: MobxPropTypes.arrayOrObservableArray,
    verification_code: PropTypes.string,
    is_payment_agent_withdraw: PropTypes.bool,
    payment_agent_active_tab_index: PropTypes.number,
    setPaymentAgentActiveTabIndex: PropTypes.func,
};

export default connect(({ modules }) => ({
    error: modules.cashier.general.config.payment_agent.verification.error,
    is_email_sent: modules.cashier.general.config.payment_agent.verification.is_email_sent,
    is_resend_clicked: modules.cashier.general.config.payment_agent.verification.is_resend_clicked,
    is_loading: modules.cashier.general.is_loading,
    onChangePaymentMethod: modules.cashier.general.onChangePaymentMethod,
    onMount: modules.cashier.general.onMountPaymentAgentList,
    payment_agent_list: modules.cashier.general.config.payment_agent.filtered_list,
    resend_timeout: modules.cashier.general.config.payment_agent.verification.resend_timeout,
    selected_bank: modules.cashier.general.config.payment_agent.selected_bank,
    sendVerificationEmail: modules.cashier.general.sendVerificationEmail,
    supported_banks: modules.cashier.general.config.payment_agent.supported_banks,
    payment_agent_active_tab_index: modules.cashier.general.config.payment_agent.active_tab_index,
    setPaymentAgentActiveTabIndex: modules.cashier.general.config.payment_agent.setActiveTabIndex,
}))(PaymentAgentList);
