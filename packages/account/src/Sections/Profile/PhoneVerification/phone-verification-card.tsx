import classNames from 'classnames';
import React from 'react';

type TPhoneVerificationCard = {
    is_small_card?: boolean;
};

const PhoneVerificationCard = ({ children, is_small_card }: React.PropsWithChildren<TPhoneVerificationCard>) => (
    <div className={classNames('phone-verification__card', { 'phone-verification__card--small-card': is_small_card })}>
        {children}
    </div>
);

export default PhoneVerificationCard;
