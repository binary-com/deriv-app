import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { isMobile, getSignupFormFields } from '@deriv/shared';
import { Button, Icon, StaticUrl, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const Heading = ({ code }) => {
    switch (code) {
        case 'DuplicateAccount':
            return (
                <Text as='h1' align='center' weight='bold'>
                    <Localize i18n_default_text='Account already exists' />
                </Text>
            );
        case 'InvalidAccount':
            return (
                <Text as='h2' size={isMobile() ? 'xs' : 's'} align='center' weight='bold' line_height='xxl'>
                    <Localize i18n_default_text='You can’t add another real account' />
                </Text>
            );
        case 'InputValidationFailed':
        case 'PoBoxInAddress':
        case 'InvalidPhone':
            return (
                <Text as='h1' align='center' weight='bold' line_height='xxl'>
                    <Localize i18n_default_text='Invalid inputs' />
                </Text>
            );

        default:
            return (
                <Text as='h1' align='center' weight='bold'>
                    <Localize i18n_default_text='Something’s not right' />
                </Text>
            );
    }
};

const Message = ({ code, message, details }) => {
    if (code === 'PoBoxInAddress') {
        details.error_details = { address_line_1: message };
    } else if (code === 'InvalidPhone') {
        details.error_details = { phone: message };
    }
    switch (code) {
        case 'DuplicateAccount':
            return (
                <p>
                    <Localize
                        i18n_default_text='Your details match an existing account. If you need help, contact us via <0>live chat</0>.'
                        components={[
                            <span
                                className='chat-inline'
                                key={0}
                                onClick={() => window.LiveChatWidget.call('maximize')}
                            />,
                        ]}
                    />
                </p>
            );
        case 'InvalidAccount':
            return (
                <Text size={isMobile() ? 'xxs' : 'xs'} align='center'>
                    {message}
                </Text>
            );
        case 'InputValidationFailed':
        case 'PoBoxInAddress':
        case 'InvalidPhone':
            return (
                <div className='input_validation_failed'>
                    <Text align='center' weight='normal' line_height='xxl'>
                        <Localize i18n_default_text='We don’t accept the following inputs for:' />
                    </Text>
                    {Object.keys(details?.error_details).map(item => (
                        <div key={item} className='invalid_fields_input'>
                            <Text size='xs' weight='bold'>
                                {getSignupFormFields()[item]}
                            </Text>
                            <Text size='xs' weight='bold'>
                                {' : '}
                            </Text>
                            <Text size='xs'>{details[item]}</Text>
                        </div>
                    ))}
                </div>
            );

        default:
            return <p>{message}</p>;
    }
};

const TryAgain = ({ text, onConfirm, ...rest }) => (
    <Button primary onClick={onConfirm} large {...rest}>
        {text}
    </Button>
);

const ErrorCTA = ({ code, onConfirm }) => {
    switch (code) {
        case 'DuplicateCurrency':
        case 'CurrencyTypeNotAllowed':
            return <TryAgain text={localize('Try a different currency')} onConfirm={onConfirm} />;
        case 'DuplicateAccount':
            return (
                <TryAgain text={localize('Go to live chat')} onConfirm={() => window.LiveChatWidget.call('maximize')} />
            );
        case 'InputValidationFailed':
        case 'PoBoxInAddress':
        case 'InvalidPhone':
            return <TryAgain text={localize('Let’s try again')} onConfirm={onConfirm} />;
        case 'InvalidAccount':
            return <TryAgain text={localize('OK')} onConfirm={onConfirm} />;

        default:
            return (
                <StaticUrl
                    href={`help-centre/${code === 'InvalidAccount' ? 'account#who-can-open-an-account' : ''}`}
                    type='button'
                    className='dc-btn dc-btn--primary'
                >
                    <Text weight='bold' color='white' size='xxs'>
                        <Localize i18n_default_text='OK' />
                    </Text>
                </StaticUrl>
            );
    }
};

const SignupErrorContent = ({ message, code, onConfirm, className, error_field = {} }) => {
    const is_invalid_field_error = ['InputValidationFailed', 'PoBoxInAddress', 'InvalidPhone'].includes(code);
    const getIconSize = () => {
        if (is_invalid_field_error) return '64';
        else if (code === 'InvalidAccount') return '96';
        return '115';
    };
    return (
        <div
            className={classNames('account-wizard--error', {
                [`account-wizard--error__${className}`]: className,
            })}
        >
            <Icon icon={is_invalid_field_error ? 'IcInvalidError' : 'IcAccountError'} size={getIconSize()} />
            <Heading code={code} />
            <Message code={code} message={message} details={error_field} />
            <div className='account-wizard--error__cta'>
                <ErrorCTA code={code} onConfirm={onConfirm} />
            </div>
        </div>
    );
};

SignupErrorContent.propTypes = {
    code: PropTypes.string,
    error_field: PropTypes.object,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    className: PropTypes.string,
};

export default SignupErrorContent;
