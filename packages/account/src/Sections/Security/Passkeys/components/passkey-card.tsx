import React from 'react';
import { Icon, Text } from '@deriv/components';
import { getLongDate } from '@deriv/shared';
import { Localize } from '@deriv/translations';

// TODO: remove here types and grab from API after implementation
type TPasskeyCard = {
    id?: number;
    name: string;
    last_used: number;
    created_at?: number;
    stored_on?: string;
    passkey_id?: string;
    icon?: string;
};

const PasskeyCard = ({ name, last_used, stored_on, icon }: TPasskeyCard) => {
    // TODO: add revoke and rename flow as the next step. 'IcContextMenu' is supposed to be used here

    return (
        <div className='passkeys-card__wrapper'>
            <Icon icon='IcPasskey' size={24} />
            <div>
                <Text as='p' weight='bold' line_height='l'>
                    {name}
                </Text>
                {stored_on && (
                    <div>
                        <Text as='p' size='xs'>
                            <Localize i18n_default_text='Stored on: ' /> {stored_on}
                        </Text>
                    </div>
                )}
                <div>
                    <Text as='p' size='xs'>
                        <Localize i18n_default_text='Last used: ' />{' '}
                        {last_used ? getLongDate(last_used) : <Localize i18n_default_text='Never' />}
                    </Text>
                </div>
                {icon && <Icon icon={icon} size={24} className='passkeys-card__passkey-type-icon' />}
            </div>
        </div>
    );
};

export default PasskeyCard;
