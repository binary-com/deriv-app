import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import './payment-agent-detail.scss';

const PaymentAgentDetail = ({ action, children, className, has_red_color, icon, is_link, title }) => {
    const detail = Array.isArray(children) ? children : [children];
    return (
        <div
            className={classNames('payment-agent-detail', {
                [className]: !!className,
            })}
        >
            {icon && (
                <div className='payment-agent-detail__icon-wrapper'>
                    <Icon icon={`IcCashier${icon}`} data_testid='dt_payment-agent-detail-icon' />
                </div>
            )}
            <div>
                {title && (
                    <Text as='p' line_height='s' size='xs'>
                        {title}
                    </Text>
                )}
                {detail.map((child, id) => (
                    <React.Fragment key={id}>
                        {action || is_link ? (
                            <Text
                                as='a'
                                color={has_red_color ? 'red' : 'prominent'}
                                data-testid='dt_payment_agent_detail_link'
                                href={`${action ? `${action}:` : ''}${child}`}
                                line_height='s'
                                size={!title ? 'xxs' : 'xs'}
                                weight='bold'
                                className='payment-agent-detail__link'
                            >
                                {child}
                                {id === detail.length - 1 ? '' : ', '}
                            </Text>
                        ) : (
                            <Text
                                as='p'
                                data-testid='dt_payment_agent_detail_paragraph'
                                line_height='s'
                                size='xs'
                                weight='bold'
                            >
                                {child}
                            </Text>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

PaymentAgentDetail.propTypes = {
    action: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element, PropTypes.string]),
    className: PropTypes.string,
    has_red_color: PropTypes.bool,
    icon: PropTypes.string,
    is_link: PropTypes.bool,
    title: PropTypes.string,
};

export default PaymentAgentDetail;
