import { Tag } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
import { usePhoneNumberVerificationSessionTimer } from '@deriv/hooks';
import clsx from 'clsx';
import React from 'react';

type TPhoneVerificationCard = {
    is_small_card?: boolean;
};

const PhoneVerificationCard = ({ children, is_small_card }: React.PropsWithChildren<TPhoneVerificationCard>) => {
    const { formatted_time } = usePhoneNumberVerificationSessionTimer();
    return (
        <div className={clsx('phone-verification__card', { 'phone-verification__card--small-card': is_small_card })}>
            <div className='phone-verification__card--session-timeout-component'>
                <Tag
                    showIcon={false}
                    size='sm'
                    variant='custom'
                    color='#f5f5f5'
                    label={
                        <Localize
                            i18n_default_text='Time remaining: {{time_remaining}}'
                            values={{ time_remaining: formatted_time }}
                        />
                    }
                />
            </div>
            {children}
        </div>
    );
};

export default PhoneVerificationCard;
