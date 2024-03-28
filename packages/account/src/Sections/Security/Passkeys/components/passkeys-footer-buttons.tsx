import React from 'react';
import { Button } from '@deriv/components';
import FormFooter from '../../../../Components/form-footer';

type TPasskeysFooterButtons = {
    primary_button_text: React.ReactElement;
    onPrimaryButtonClick: React.MouseEventHandler<HTMLButtonElement>;
    secondary_button_text?: React.ReactElement;
    onSecondaryButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const PasskeysFooterButtons = ({
    primary_button_text,
    onPrimaryButtonClick,
    secondary_button_text,
    onSecondaryButtonClick,
}: TPasskeysFooterButtons) => (
    <FormFooter className='passkeys-status__footer'>
        {secondary_button_text && (
            <Button type='button' has_effect secondary onClick={onSecondaryButtonClick} large>
                {secondary_button_text}
            </Button>
        )}
        <Button type='button' has_effect primary onClick={onPrimaryButtonClick}>
            {primary_button_text}
        </Button>
    </FormFooter>
);

export default PasskeysFooterButtons;
