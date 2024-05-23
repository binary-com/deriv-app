import React from 'react';
import { Localize } from '@deriv/translations';

type TDisplayAccountType = {
    account_type: string;
    is_eu: boolean;
};

const DisplayAccountType = ({ account_type, is_eu }: TDisplayAccountType) => {
    if (account_type === 'financial') {
        return <Localize i18n_default_text='Multipliers' />;
    } else if (account_type === 'gaming') {
        if (is_eu) {
            return <Localize i18n_default_text='Options' />;
        }
        return <Localize i18n_default_text='Derived' />;
    }
    return null;
};

export default DisplayAccountType;
