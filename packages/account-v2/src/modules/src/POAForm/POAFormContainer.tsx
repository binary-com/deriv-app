import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { DerivLightApprovedPoaIcon, DerivLightDeclinedPoaIcon, DerivLightWaitingPoaIcon } from '@deriv/quill-icons';
import { Button, Loader, Text } from '@deriv-com/ui';
import { DemoMessage, IconWithMessage } from '../../../components';
import { ACCOUNT_V2_ROUTES, AUTH_STATUS_CODES, P2P_ROUTE } from '../../../constants';
import { AddressDetailsForm } from '../../../containers/POAForm/AddressDetailsForm';
import { usePOAInfo } from '../../../hooks/usePOAInfo';
import { isNavigationFromDerivGO, isNavigationFromP2P } from '../../../utils/platform';

export const POAFormContainer = () => {
    const { data: activeAccount } = useActiveTradingAccount();
    const { data: poaInfo, isLoading } = usePOAInfo();
    const [resubmitting, setResubmitting] = useState(false);
    const history = useHistory();

    const { documentNotRequired, documentStatus, documentSubmitted, isPOAResubmission, isPOINeeded } = poaInfo;

    const handleResubmit = () => {
        setResubmitting(true);
    };

    const p2pButton = () =>
        isNavigationFromP2P() ? (
            <Button
                onClick={() => {
                    history.push(P2P_ROUTE);
                    window.sessionStorage.removeItem('config.platform');
                }}
            >
                Back to P2P
            </Button>
        ) : null;

    const poiButton = () =>
        isPOINeeded ? (
            <Button
                onClick={() => {
                    history.push(ACCOUNT_V2_ROUTES.ProofOfIdentity);
                }}
            >
                Proof of identity
            </Button>
        ) : null;

    const continueTradingButton = () => {
        const isRedirectedFromPlatform = isNavigationFromP2P() || isNavigationFromDerivGO();
        return !isRedirectedFromPlatform ? (
            <Button
                onClick={() => {
                    history.push('/');
                }}
            >
                Continue trading
            </Button>
        ) : null;
    };

    const redirectionButton = poiButton() ?? p2pButton() ?? continueTradingButton();

    if (activeAccount?.is_virtual) return <DemoMessage />;

    if (isLoading)
        return (
            <div className='flex items-center justify-center h-full'>
                <Loader isFullScreen={false} />
            </div>
        );

    if (documentNotRequired)
        return (
            <IconWithMessage
                icon={<DerivLightApprovedPoaIcon width={128} />}
                title='Proof of address verification not required'
            >
                <Text align='center' size='sm'>
                    Your account does not need address verification at this time. We will inform you if address
                    verification is required in the future.
                </Text>
            </IconWithMessage>
        );

    if (documentSubmitted)
        return (
            <IconWithMessage
                actionButton={redirectionButton}
                icon={<DerivLightApprovedPoaIcon width={128} />}
                title='Your documents were submitted successfully'
            >
                <Text align='center' size='sm'>
                    We’ll review your documents and notify you of its status within 1 to 3 days.
                </Text>
                {isPOINeeded ? (
                    <Text align='center' size='sm'>
                        You must also submit a proof of identity.
                    </Text>
                ) : null}
            </IconWithMessage>
        );

    if (resubmitting || isPOAResubmission) {
        return <AddressDetailsForm resubmitting />;
    }

    switch (documentStatus) {
        case AUTH_STATUS_CODES.NONE:
            return <AddressDetailsForm />;
        case AUTH_STATUS_CODES.PENDING:
            return (
                <IconWithMessage
                    actionButton={redirectionButton}
                    icon={<DerivLightApprovedPoaIcon width={128} />}
                    title='Your proof of address was submitted successfully'
                >
                    <Text align='center' size='sm'>
                        Your document is being reviewed, please check back in 1-3 days.
                    </Text>
                    {isPOINeeded ? (
                        <Text align='center' size='sm'>
                            You must also submit a proof of identity.
                        </Text>
                    ) : null}
                </IconWithMessage>
            );
        case AUTH_STATUS_CODES.VERIFIED:
            return (
                <IconWithMessage
                    actionButton={redirectionButton}
                    icon={<DerivLightApprovedPoaIcon width={128} />}
                    title='Your proof of address is verified'
                >
                    {isPOINeeded ? (
                        <Text align='center' size='sm'>
                            To continue trading, you must also submit a proof of identity.
                        </Text>
                    ) : null}
                </IconWithMessage>
            );
        case AUTH_STATUS_CODES.EXPIRED:
            return (
                <IconWithMessage
                    actionButton={<Button onClick={handleResubmit}>Resubmit</Button>}
                    icon={<DerivLightWaitingPoaIcon width={128} />}
                    title='New proof of address is needed'
                >
                    <Text align='center' size='sm'>
                        Your document for proof of address is expired. <br />
                        Please submit again.
                    </Text>
                </IconWithMessage>
            );
        case AUTH_STATUS_CODES.REJECTED:
        case AUTH_STATUS_CODES.SUSPECTED:
            return (
                <IconWithMessage
                    actionButton={<Button onClick={handleResubmit}>Resubmit</Button>}
                    icon={<DerivLightDeclinedPoaIcon width={128} />}
                    title='We could not verify your proof of address'
                >
                    <Text align='center' size='sm'>
                        Please check your email for details.
                    </Text>
                </IconWithMessage>
            );
        default:
            return null;
    }
};
