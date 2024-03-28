import React from 'react';
import { useHistory } from 'react-router-dom';
import { DerivLightApprovedPoiIcon, DerivLightWaitingPoiIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import { IconWithMessage } from '../../components/IconWithMessage';
import { ACCOUNT_V2_ROUTES, AUTH_STATUS_CODES, POI_SERVICE } from '../../constants';
import { TPOIStatus, TSupportedPOIServices } from '../../types';

type TVerificationStatusProps = {
    isPOARequired?: boolean;
    service: TSupportedPOIServices;
    status: TPOIStatus;
};

const ContinueToPOA = () => {
    const history = useHistory();
    return <Button onClick={() => history.push(ACCOUNT_V2_ROUTES.ProofOfAddress)}>Submit proof of address</Button>;
};

const ContinueTradingButton = () => {
    const history = useHistory();
    return <Button onClick={() => history.push('/')}>Submit proof of address</Button>;
};

export const VerificationStatus = ({ isPOARequired, service, status }: TVerificationStatusProps) => {
    if (status === AUTH_STATUS_CODES.PENDING) {
        return (
            <IconWithMessage
                actionButton={isPOARequired ? <ContinueToPOA /> : <ContinueTradingButton />}
                icon={<DerivLightWaitingPoiIcon height='128px' />}
                title='Your proof of identity was submitted successfully'
            >
                <Text align='center' size='xs'>
                    {service === POI_SERVICE.manual
                        ? "We'll review your documents and notify you of its status within 1-3 days."
                        : "We'll review your documents and notify you of its status within 5 minutes."}
                </Text>
            </IconWithMessage>
        );
    }
    return (
        <IconWithMessage
            actionButton={isPOARequired ? <ContinueToPOA /> : <ContinueTradingButton />}
            icon={<DerivLightApprovedPoiIcon />}
            title='ID verification passed'
        />
    );
};
