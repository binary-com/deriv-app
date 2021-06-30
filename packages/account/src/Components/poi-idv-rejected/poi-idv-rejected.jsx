import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

const IdvRejected = ({ handleRequireSubmission }) => {
    return (
        <div className='proof-of-identity__container'>
            <Icon icon='IcPoiFailed' className='icon' size={128} />
            <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                {isMobile() ? localize('ID verification failed') : localize('Verification of document number failed')}
            </Text>
            <Text className='proof-of-identity__text btm-spacer' align='center' size='xs'>
                {isMobile()
                    ? localize('We were unable to verify your ID with the details you provided.')
                    : localize('We were unable to verify your identity based on the details you entered.')}
            </Text>

            <Button
                type='button'
                className='account-management__continue'
                onClick={handleRequireSubmission}
                large
                text={localize('Try Again')}
                primary
            />
        </div>
    );
};

export default IdvRejected;
