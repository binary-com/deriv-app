import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

const IdvExpired = ({ handleRequireSubmission }) => {
    return (
        <div className='proof-of-identity__container'>
            <Icon icon='IcPoiFailed' className='icon' size={128} />
            <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                {isMobile() ? localize('ID verification failed') : localize('Verification of document number failed')}
            </Text>
            <Text className='proof-of-identity__text btm-spacer' align='center' size='xs'>
                {isMobile()
                    ? localize('The ID you submitted is expired.')
                    : localize(
                          'It looks like your identity document has expired. Please try again with a valid document.'
                      )}
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

export default IdvExpired;
