import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const IdvRejected = ({ handleRequireSubmission, rejected_reasons }) => {
    return (
        <div className='proof-of-identity__container'>
            <Icon icon='IcPoiFailed' className='icon btm-spacer' size={128} />
            <Text className='proof-of-identity__status-header' align='center' weight='bold'>
                {localize('Verification of document number failed')}
            </Text>
            {rejected_reasons &&
                rejected_reasons.map((r, index) => {
                    return (
                        <Text key={index} className='proof-of-identity__status-header' align='center' size='xs'>
                            {localize(r)}
                        </Text>
                    );
                })}
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
