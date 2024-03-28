import React from 'react';
import { Localize } from '@deriv/translations';
import FormBody from '../../../../Components/form-body';
import PasskeyCard from './passkey-card';
import PasskeysFooterButtons from 'Sections/Security/Passkeys/components/passkeys-footer-buttons';

type TPasskeysList = {
    passkeys_list: React.ComponentProps<typeof PasskeyCard>[];
    onPrimaryButtonClick: React.MouseEventHandler<HTMLButtonElement>;
    onSecondaryButtonClick: React.MouseEventHandler<HTMLButtonElement>;
};

const PasskeysList = ({ passkeys_list, onPrimaryButtonClick, onSecondaryButtonClick }: TPasskeysList) => (
    <React.Fragment>
        <FormBody scroll_offset='16rem'>
            {passkeys_list.map(passkey => (
                <PasskeyCard {...passkey} key={passkey.passkey_id} />
            ))}
        </FormBody>
        <PasskeysFooterButtons
            onSecondaryButtonClick={onSecondaryButtonClick}
            onPrimaryButtonClick={onPrimaryButtonClick}
            primary_button_text={<Localize i18n_default_text='Create passkey' />}
            secondary_button_text={<Localize i18n_default_text='Learn more' />}
        />
    </React.Fragment>
);

export default PasskeysList;
