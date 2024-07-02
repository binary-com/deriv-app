import React from 'react';
import { Button, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { DerivLightExclamationPoiIcon } from '@deriv/quill-icons';
import { POIContext } from '@deriv/shared';
import { submission_status_code } from '../../../../Sections/Verification/ProofOfIdentity/proof-of-identity-utils';

type TIdvLimited = {
    handleRequireSubmission: () => void;
};

const IdvLimited = ({ handleRequireSubmission }: TIdvLimited) => {
    const { setSubmissionStatus } = React.useContext(POIContext);

    return (
        <div className='proof-of-identity__container'>
            <DerivLightExclamationPoiIcon className='icon' />
            <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                {localize('ID verification failed')}
            </Text>
            <Text className='proof-of-identity__text btm-spacer' align='center' size='xs'>
                {localize('We were unable to verify your ID with the details you provided. ')}
                {localize('Please upload your identity document.')}
            </Text>
            <Button
                type='button'
                className='account-management__continue'
                onClick={() => {
                    handleRequireSubmission();
                    setSubmissionStatus(submission_status_code.selecting);
                }}
                large
                text={localize('Upload identity document')}
                primary
            />
        </div>
    );
};

export default IdvLimited;
