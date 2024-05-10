import React from 'react';
import classNames from 'classnames';
import { SideNote, Text, useDevice } from '@deriv-com/ui';

export const TwoFactorAuthenticationArticle = () => {
    const { isTablet } = useDevice();
    return (
        <SideNote
            className={classNames('py-16 px-24  h-fit md:w-[256px] sm:w-[calc(100%-32px)] sm:m-16', {
                'ml-12': isTablet,
            })}
            title='Two-factor authentication (2FA)'
            titleClassName='mb-8 text-default text-system-light-prominent-text leading-normal'
        >
            <Text align='start' className='text-system-light-prominent-text leading-normal' size='xs'>
                Protect your account with 2FA. Each time you log in to your account, you will need to enter your
                password and an authentication code generated by a 2FA app on your smartphone.
            </Text>
        </SideNote>
    );
};
