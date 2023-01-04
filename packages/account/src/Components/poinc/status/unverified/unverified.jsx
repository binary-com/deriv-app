import React from 'react';
import { Button, Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const PoincUnverified = ({ onReSubmit }) => (
    <IconMessageContent
        message={localize('Proof of income verification failed')}
        text={
            <Localize i18n_default_text='We are unable to verify your proof of income, please check your email inbox for more details.' />
        }
        icon={<Icon icon='IcPoincFailed' size={128} />}
    >
        <Button
            type='button'
            className='account-management__continue'
            onClick={() => onReSubmit('none')}
            large
            text={localize('Try Again')}
            primary
        />
    </IconMessageContent>
);
