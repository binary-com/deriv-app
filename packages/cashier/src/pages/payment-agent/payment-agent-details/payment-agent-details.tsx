import classNames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import './payment-agent-details.scss';

type TDetailsProps = {
    action?: string;
    children?: Array<string> | string;
    icon?: string;
    rel?: string;
    target?: string;
    value?: string;
};

type TPaymentAgentDetailsProps = {
    className?: string;
    payment_agent_email?: string;
    payment_agent_phones?: string | Array<{ phone_number: string }>;
    payment_agent_urls?: string | Array<{ url: string }>;
};

const Detail = ({ action, icon, children, ...rest }: TDetailsProps) => {
    const detail = Array.isArray(children) ? children : children?.split(',');
    return (
        <div className='payment-agent-details__accordion-content-line'>
            <div>
                <Icon icon={`Ic${icon}`} className='payment-agent-details__accordion-content-icon' color='secondary' />
            </div>
            <div>
                {detail?.map((child, id) => (
                    <a
                        key={id}
                        className='payment-agent-details__contact cashier__paragraph'
                        href={`${action ? `${action}:` : ''}${child}`}
                        {...rest}
                    >
                        {child}
                        {id === detail?.length - 1 ? '' : ', '}
                    </a>
                ))}
            </div>
        </div>
    );
};

const PaymentAgentDetails = ({
    className,
    payment_agent_phones,
    payment_agent_urls,
    payment_agent_email,
}: TPaymentAgentDetailsProps) => {
    // TODO: Once telephone, url removed from paymentagent_list.list we can remove isArray conditions and only use the array
    return (
        <div className={classNames('payment-agent-details__accordion-content', className)}>
            {payment_agent_phones?.length && (
                <Detail action='tel' icon='Phone'>
                    {Array.isArray(payment_agent_phones)
                        ? payment_agent_phones.map(phone => phone.phone_number)
                        : payment_agent_phones}
                </Detail>
            )}
            {payment_agent_urls?.length && (
                <Detail icon='Website' target='_blank' rel='noopener noreferrer'>
                    {Array.isArray(payment_agent_urls) ? payment_agent_urls.map(url => url.url) : payment_agent_urls}
                </Detail>
            )}
            {payment_agent_email && (
                <Detail action='mailto' icon='EmailOutline' target='_blank' rel='noopener noreferrer'>
                    {payment_agent_email}
                </Detail>
            )}
        </div>
    );
};

export default PaymentAgentDetails;
