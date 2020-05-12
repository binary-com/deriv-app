import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon } from '@deriv/components';
import { getDerivComLink } from '_common/url';
import { Localize } from '@deriv/translations';

const SignupErrorContent = ({ message, code, onConfirm }) => {
    return (
        <div className='account-wizard--error'>
            <Icon icon='IcAccountError' size={115} />
            <h1>
                <Localize i18n_default_text='Whoops!' />
            </h1>
            <p>{message}</p>
            {code !== 'InvalidPhone' && (
                <a
                    href={getDerivComLink('help-centre')}
                    type='button'
                    className='dc-btn dc-btn--primary dc-btn__medium'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <span className='dc-btn__text'>
                        <Localize i18n_default_text='Go To Help Centre' />
                    </span>
                </a>
            )}
            {code === 'InvalidPhone' && (
                <Button primary onClick={onConfirm}>
                    <Localize i18n_default_text='Try again using a different number' />
                </Button>
            )}
        </div>
    );
};

SignupErrorContent.propTypes = {
    code: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
};

export default SignupErrorContent;
