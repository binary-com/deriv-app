import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router';
import { Button, Text } from '@deriv/components';
import { isMobileOrTablet, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import PaymentAgentDetail from '../payment-agent-detail';
import PaymentAgentDisclaimer from '../payment-agent-disclaimer';
import SideNote from 'Components/side-note';
import { useCashierStore } from '../../../stores/useCashierStores';
import './payment-agent-receipt.scss';
import { BrowserHistory } from 'history';
import { TPaymentAgent } from '../../../types';

const openStatement = (history: BrowserHistory, resetPaymentAgent: VoidFunction) => {
    history.push(routes.statement);
    resetPaymentAgent();
};

type TPaymentAgentDetails = Pick<TPaymentAgent, 'email' | 'phone_numbers' | 'urls'>;

type TPaymentAgentReceipt = {
    history: BrowserHistory;
};

const PaymentAgentDetails = ({ email, phone_numbers, urls }: TPaymentAgentDetails) => {
    return (
        <div className='payment-agent-receipt__transferred-contact'>
            {phone_numbers && (
                <PaymentAgentDetail action='tel' icon='IcPhone'>
                    {phone_numbers.map(phone => phone.phone_number)}
                </PaymentAgentDetail>
            )}
            {email && (
                <PaymentAgentDetail action='mailto' icon='IcEmailOutlineNew' rel='noopener noreferrer' target='_blank'>
                    {email}
                </PaymentAgentDetail>
            )}
            {urls && (
                <PaymentAgentDetail icon='IcWebsite' is_link rel='noopener noreferrer' target='_blank'>
                    {urls.map(url => url.url)}
                </PaymentAgentDetail>
            )}
        </div>
    );
};

const PaymentAgentReceipt = observer(({ history }: TPaymentAgentReceipt) => {
    const { client, common } = useStore();
    const { payment_agent: payment_agent_store } = useCashierStore();
    const { currency } = client;
    const { is_from_derivgo } = common;
    const { receipt, resetPaymentAgent } = payment_agent_store;

    React.useEffect(() => {
        return () => resetPaymentAgent();
    }, [resetPaymentAgent]);

    return (
        <div className='cashier__wrapper--align-center payment-agent-receipt'>
            <SideNote className='payment-agent-list__side-note' is_mobile_or_tablet>
                <PaymentAgentDisclaimer />
            </SideNote>
            <Text
                as='h1'
                align='center'
                color='prominent'
                line_height='m'
                size={isMobileOrTablet() ? 'xsm' : 'sm'}
                weight='bold'
                className={classNames('payment-agent-receipt__header', {
                    'payment-agent-receipt__header-listed': receipt.payment_agent_name,
                    'payment-agent-receipt__header-unlisted': !receipt.payment_agent_name,
                })}
            >
                <Localize
                    i18n_default_text='You’ve transferred {{amount}} {{currency}}'
                    values={{ amount: receipt.amount_transferred, currency }}
                />
            </Text>
            <Text as='p' align='center' color='prominent' line_height='m' size='xs' weight='bold'>
                <Localize i18n_default_text='Important notice to receive your funds' />
            </Text>
            <Text
                as='p'
                align='center'
                color='prominent'
                size='xxs'
                line_height='m'
                className={classNames('payment-agent-receipt__explanation', {
                    'payment-agent-receipt__explanation-unlisted': !receipt.payment_agent_name,
                })}
            >
                <Localize
                    i18n_default_text='{{ text }}. <0></0>You can view the summary of this transaction in your email.'
                    components={!isMobileOrTablet() ? [<br key={0} />] : []}
                    values={{
                        text: receipt.payment_agent_name
                            ? localize('To receive your funds, contact the payment agent with the details below')
                            : localize('To receive your funds, contact the payment agent'),
                    }}
                    key={0}
                />
            </Text>
            {receipt.payment_agent_name && (
                <div className='payment-agent-receipt__transferred-contact-wrapper'>
                    <Text align='center' as='p' size='xxs' line_height='m' weight='bold'>
                        <Localize
                            i18n_default_text="<0>{{payment_agent}}</0><1>'s</1> contact details"
                            components={[<span key={0} />, <span key={1} />]}
                            values={{ payment_agent: receipt.payment_agent_name }}
                            options={{ interpolation: { escapeValue: false } }}
                        />
                    </Text>
                    {receipt.payment_agent_email && receipt.payment_agent_phone && receipt.payment_agent_url && (
                        <PaymentAgentDetails
                            email={receipt.payment_agent_email}
                            phone_numbers={receipt.payment_agent_phone}
                            urls={receipt.payment_agent_url}
                        />
                    )}
                </div>
            )}
            <div className='cashier__form-submit'>
                {!is_from_derivgo && (
                    <Button
                        className='cashier__form-submit-button'
                        has_effect
                        text={localize('View transaction')}
                        onClick={() => openStatement(history, resetPaymentAgent)}
                        secondary
                        large
                    />
                )}
                <Button
                    className='cashier__form-submit-button cashier__done-button'
                    has_effect
                    text={localize('Make a new withdrawal')}
                    onClick={resetPaymentAgent}
                    primary
                    large
                />
            </div>
        </div>
    );
});

export default withRouter(PaymentAgentReceipt);
