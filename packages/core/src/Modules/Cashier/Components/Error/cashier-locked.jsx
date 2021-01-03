import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const CashierLocked = () => {
    return (
        <div className='cashier-locked'>
            <Icon icon='IcCashierLocked' className='cashier-locked__icon' />
            <Text as='h2' weight='bold' align='center' className='cashier-locked__title'>
                {localize('Cashier is locked')}
            </Text>
            <p className='cashier-locked__desc'>{localize('Please check your email for details')}</p>
        </div>
    );
};

export default CashierLocked;
