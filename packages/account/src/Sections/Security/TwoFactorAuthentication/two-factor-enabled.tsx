import React from 'react';
import { Icon, ThemedScrollbars, Text } from '@deriv/components';
import DigitForm from './digit-form';
import { isMobile } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const TwoFactorEnabled = () => {
    return (
        <ThemedScrollbars is_bypassed={isMobile()} className='two-factor__scrollbars'>
            <div className='two-factor__wrapper--enabled'>
                <Icon icon='IcQrPhone' className='two-factor__icon' />
                <Text as='h3' align='center' weight='bold' color='prominent' className='two-factor__qr--title'>
                    <Localize i18n_default_text='2FA enabled' />
                </Text>
                <Text as='h4' size='xs' align='center' className='two-factor__qr--message'>
                    <Localize i18n_default_text='You have enabled 2FA for your Deriv account.' />
                </Text>
                <Text as='h4' size='xs' align='center' className='two-factor__qr--message'>
                    <Localize i18n_default_text='To disable 2FA, please enter the six-digit authentication code generated by your 2FA app below:' />
                </Text>
                <div data-testid='digitform_2fa_enabled'>
                    <DigitForm />
                </div>
            </div>
        </ThemedScrollbars>
    );
};

export default TwoFactorEnabled;
