import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { Loading, Tabs, Text } from '@deriv/components';
import { isDesktop, isMobile, website_name } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { RootStore } from 'Types';
import VerificationEmail from 'Components/verification-email';
import PaymentAgentDeposit from '../payment-agent-deposit';
import PaymentAgentWithdrawForm from '../payment-agent-withdraw-form';
import PaymentAgentWithdrawalLocked from '../payment-agent-withdrawal-locked';
import './payment-agent-list.scss';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface HTMLAttributes<T> {
        label?: string;
    }
}

type TPaymentAgentListProps = {
    error?: {
        code: number | string;
    };
    is_email_sent?: boolean;
    is_loading?: boolean;
    is_payment_agent_withdraw?: boolean;
    is_resend_clicked?: boolean;
    onMount?: () => void;
    payment_agent_active_tab_index?: number;
    resendVerificationEmail?: () => void;
    setActiveTabIndex?: (index: number) => void;
    setIsResendClicked?: (status: boolean) => void;
    verification_code?: string;
};

const PaymentAgentList = ({
    error,
    is_email_sent,
    is_loading,
    is_resend_clicked,
    is_payment_agent_withdraw,
    onMount,
    payment_agent_active_tab_index,
    resendVerificationEmail,
    setActiveTabIndex,
    setIsResendClicked,
    verification_code,
}: TPaymentAgentListProps) => {
    React.useEffect(() => {
        onMount?.();
    }, [onMount]);

    return (
        <div className='cashier__wrapper--align-left cashier__wrapper-padding'>
            <React.Fragment>
                <Text
                    as='p'
                    align='center'
                    line_height='s'
                    size={isMobile() ? 'xxs' : 'xs'}
                    className='cashier__paragraph'
                >
                    <Localize i18n_default_text='Can’t find a suitable payment method for your country? Then try a payment agent.' />
                </Text>
                <div className='payment-agent-list__instructions'>
                    <Tabs
                        active_index={payment_agent_active_tab_index}
                        className='tabs--desktop'
                        onTabItemClick={setActiveTabIndex}
                        top
                        header_fit_content={isDesktop()}
                    >
                        <div label={localize('Deposit')}>
                            {is_loading ? <Loading is_fullscreen={false} /> : <PaymentAgentDeposit />}
                            <div className='payment-agent-list__disclaimer'>
                                <Text size='xs' lh='s' weight='bold' className='cashier__text'>
                                    <Localize i18n_default_text='DISCLAIMER' />
                                </Text>
                                :&nbsp;
                                <Text size='xxs'>
                                    <Localize
                                        i18n_default_text='{{website_name}} is not affiliated with any Payment Agent. Customers deal with Payment Agents at their sole risk. Customers are advised to check the credentials of Payment Agents, and check the accuracy of any information about Payments Agents (on Deriv or elsewhere) before transferring funds.'
                                        values={{ website_name }}
                                    />
                                </Text>
                            </div>
                        </div>
                        <div label={localize('Withdrawal')}>
                            {error?.code ? (
                                <PaymentAgentWithdrawalLocked error={error} />
                            ) : (
                                <div>
                                    {is_email_sent ? (
                                        <div className='cashier__wrapper'>
                                            <VerificationEmail
                                                is_resend_clicked={is_resend_clicked}
                                                resendVerificationEmail={resendVerificationEmail}
                                                setIsResendClicked={setIsResendClicked}
                                            />
                                        </div>
                                    ) : (
                                        (verification_code || is_payment_agent_withdraw) && (
                                            <PaymentAgentWithdrawForm verification_code={verification_code} />
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </Tabs>
                </div>
            </React.Fragment>
        </div>
    );
};

export default connect(({ modules }: RootStore) => ({
    error: modules.cashier.payment_agent.verification.error,
    is_email_sent: modules.cashier.payment_agent.verification.is_email_sent,
    is_loading: modules.cashier.general_store.is_loading,
    is_resend_clicked: modules.cashier.payment_agent.verification.is_resend_clicked,
    onMount: modules.cashier.payment_agent.onMountPaymentAgentList,
    payment_agent_active_tab_index: modules.cashier.payment_agent.active_tab_index,
    resend_timeout: modules.cashier.payment_agent.verification.resend_timeout,
    resendVerificationEmail: modules.cashier.payment_agent.verification.resendVerificationEmail,
    sendVerificationEmail: modules.cashier.payment_agent.verification.sendVerificationEmail,
    setActiveTabIndex: modules.cashier.payment_agent.setActiveTab,
    setIsResendClicked: modules.cashier.payment_agent.verification.setIsResendClicked,
}))(PaymentAgentList);
