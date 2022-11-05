import { Button, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import PooRejectedIcon from '../../Assets/ic-poo-rejected.svg';

export const POORejetced = ({ onTryAgain }) => {
    return (
        <div className='proof-of-ownership__container'>
            <PooRejectedIcon className='icon' size={128} />
            <Text weight='bold'>{localize('Proof of ownership verification failed')}</Text>
            <Text size='xs'>{localize('We were unable to verify your proof of ownership.')}</Text>
            <Button
                type='button'
                className='proof-of-ownership__try-again-button'
                onClick={onTryAgain}
                large
                text={localize('Try again')}
                primary
                data-testid='try-again-button'
            />
        </div>
    );
};
