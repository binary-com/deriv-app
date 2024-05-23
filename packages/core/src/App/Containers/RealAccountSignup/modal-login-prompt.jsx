import React from 'react';
import { Button, Text } from '@deriv/components';
import { getLanguage, localize } from '@deriv/translations';
import { redirectToLogin, redirectToSignUp } from '@deriv/shared';
import 'Sass/modal-login-prompt.scss';

const ModalLoginPrompt = () => {
    return (
        <div className='modal-login-prompt'>
            <Text as='h2' weight='bold' styles={{ lineHeight: '24px' }}>
                {localize('This is only available for existing clients.')}
            </Text>
            <p>{localize('If you have an active account, please log in to continue. Otherwise, please sign up.')}</p>

            <div>
                <Button secondary text={localize('Log In')} onClick={() => redirectToLogin(false, getLanguage())} />
                <Button primary text={localize('Sign Up')} onClick={() => redirectToSignUp()} />
            </div>
        </div>
    );
};

export default ModalLoginPrompt;
