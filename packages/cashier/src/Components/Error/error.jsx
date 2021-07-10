import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, ButtonLink, StaticUrl, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const ErrorComponent = ({ header, message, button_link, onClickButton, button_text, footer }) => (
    <div className='cashier__wrapper cashier__wrapper-error'>
        <Icon icon='IcCashierError' className='cashier-error__icon' />
        {header && (
            <Text as='h2' color='loss-danger' weight='bold' align='center' className='cashier-error__header'>
                {header}
            </Text>
        )}
        {message && (
            <Text as='p' align='center' size='xs' line_height='s' className='cashier__paragraph'>
                {message}
            </Text>
        )}
        {button_link && (
            <ButtonLink className='cashier-error__button' to={button_link} onClick={onClickButton} primary large>
                <span className='dc-btn__text'>{button_text}</span>
            </ButtonLink>
        )}
        {!button_link && button_text && (
            <Button className='cashier-error__button' onClick={onClickButton} text={button_text} primary large />
        )}
        {footer && (
            <Text as='h2' size='xxs'>
                {footer}
            </Text>
        )}
    </div>
);

const Error = ({ error, setErrorMessage }) => {
    const error_fields = {
        address_city: localize('Town/City'),
        address_line_1: localize('First line of home address'),
        address_postcode: localize('Postal Code/ZIP'),
        address_state: localize('State/Province'),
        email: localize('Email address'),
        phone: localize('Telephone'),
        residence: localize('Country of Residence'),
    };

    const onClickButton = () => {
        if (typeof error.onClickButton === 'function') {
            error.onClickButton();
        }
        clearErrorMessage();
    };

    const clearErrorMessage = () => {
        setErrorMessage('');
    };

    let AccountError;
    switch (error.code) {
        case 'InvalidToken':
            AccountError = (
                <ErrorComponent
                    header={localize('Email verification failed')}
                    message={
                        <Localize i18n_default_text='The verification link you used is invalid or expired. Please request for a new one.' />
                    }
                    onClickButton={onClickButton}
                    button_text={localize('Resend email')}
                />
            );
            break;
        case 'ASK_FIX_DETAILS':
            AccountError = (
                <ErrorComponent
                    header={localize('Update your personal details')}
                    message={
                        <React.Fragment>
                            <Localize
                                i18n_default_text={
                                    "We can't validate your personal details because there is some information missing."
                                }
                            />
                            &nbsp;
                            {error.fields ? (
                                <Localize
                                    i18n_default_text={'Please update your {{details}} to continue.'}
                                    values={{
                                        details: error.fields.map(field => error_fields[field] || field).join(', '),
                                        interpolation: { escapeValue: false },
                                    }}
                                />
                            ) : (
                                <Localize i18n_default_text={'Please update your details to continue.'} />
                            )}
                        </React.Fragment>
                    }
                    button_link='/account/personal-details'
                    onClickButton={onClickButton}
                    button_text={localize('Update my details')}
                    footer={
                        <Localize
                            i18n_default_text='Need help? <0>Contact us</0>.'
                            components={[<StaticUrl key={0} className='link' href='help-centre' />]}
                        />
                    }
                />
            );
            break;
        case 'WrongResponse':
            AccountError = (
                <ErrorComponent
                    header={error.message}
                    onClickButton={onClickButton}
                    button_text={localize('Try again')}
                />
            );
            break;
        case 'PaymentAgentWithdrawError':
            AccountError = (
                <ErrorComponent
                    header={error.message}
                    onClickButton={onClickButton}
                    button_text={localize('Back to payment agents')}
                />
            );
            break;
        default:
            AccountError = <ErrorComponent header={error.message} />;
            break;
    }
    return AccountError;
};

Error.propTypes = {
    error: PropTypes.object,
    setErrorMessage: PropTypes.func,
};

export default connect(({ modules }) => ({
    setErrorMessage: modules.cashier.general.setErrorMessage,
}))(Error);
