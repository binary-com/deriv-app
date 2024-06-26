import React from 'react';
import { AccountStatusResponse, GetAccountStatus } from '@deriv/api-types';
import { Button, Loading } from '@deriv/components';
import { WS, getPlatformRedirect, platforms, routes, AUTH_STATUS_CODES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import Expired from '../../../Components/poa/status/expired';
import NeedsReview from '../../../Components/poa/status/needs-review';
import NotRequired from '../../../Components/poa/status/not-required';
import ProofOfAddressForm from './proof-of-address-form';
import Submitted from '../../../Components/poa/status/submitted';
import Unverified from '../../../Components/poa/status/unverified';
import Verified from '../../../Components/poa/status/verified';
import { populateVerificationStatus } from '../Helpers/verification.js';

type TProofOfAddressContainer = {
    onSubmit?: () => void;
};

type TAuthenticationStatus = Record<
    | 'allow_document_upload'
    | 'allow_poi_resubmission'
    | 'allow_poa_resubmission'
    | 'is_age_verified'
    | 'has_poi'
    | 'has_submitted_poa'
    | 'needs_poa'
    | 'needs_poi'
    | 'poa_address_mismatch'
    | 'resubmit_poa'
    | 'poa_expiring_soon'
    | 'poa_authenticated_with_idv'
    | 'has_submitted_duplicate_poa',
    boolean
> & { document_status?: DeepRequired<GetAccountStatus>['authentication']['document']['status'] };

const ProofOfAddressContainer = observer(({ onSubmit }: TProofOfAddressContainer) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [authentication_status, setAuthenticationStatus] = React.useState<TAuthenticationStatus>({
        allow_document_upload: false,
        allow_poi_resubmission: false,
        allow_poa_resubmission: false,
        needs_poi: false,
        needs_poa: false,
        has_poi: false,
        resubmit_poa: false,
        has_submitted_poa: false,
        document_status: undefined,
        is_age_verified: false,
        poa_address_mismatch: false,
        poa_expiring_soon: false,
        poa_authenticated_with_idv: false,
        has_submitted_duplicate_poa: false,
    });

    const { client, notifications, common, ui } = useStore();
    const { app_routing_history } = common;
    const { has_restricted_mt5_account, is_switching } = client;
    const { is_verification_modal_visible } = ui;
    const { refreshNotifications } = notifications;

    React.useEffect(() => {
        if (!is_switching) {
            WS.authorized.getAccountStatus().then((response: AccountStatusResponse) => {
                const { get_account_status } = response;
                if (get_account_status) {
                    const {
                        allow_document_upload,
                        allow_poa_resubmission,
                        document_status,
                        has_submitted_poa,
                        is_age_verified,
                        needs_poa,
                        needs_poi,
                        poa_address_mismatch,
                        poa_authenticated_with_idv,
                        poa_expiring_soon,
                    } = populateVerificationStatus(get_account_status);

                    setAuthenticationStatus(authentication_status => ({
                        ...authentication_status,
                        allow_document_upload,
                        allow_poa_resubmission,
                        document_status,
                        has_submitted_poa: has_submitted_poa as boolean,
                        is_age_verified,
                        needs_poa,
                        needs_poi,
                        poa_address_mismatch,
                        poa_authenticated_with_idv,
                        poa_expiring_soon,
                    }));
                    setIsLoading(false);
                    refreshNotifications();
                }
            });
        }
    }, [is_switching, refreshNotifications]);

    const handleResubmit = () => {
        setAuthenticationStatus(authentication_status => ({
            ...authentication_status,
            ...{ resubmit_poa: true },
        }));
    };

    const handleDuplicatePOASubmission = () => {
        setAuthenticationStatus(authentication_status => ({
            ...authentication_status,
            ...{ resubmit_poa: true, has_submitted_duplicate_poa: false, has_submitted_poa: false },
        }));
    };

    const onSubmitDocument = (needs_poi: boolean, has_submitted_duplicate_poa?: boolean) => {
        setAuthenticationStatus(authentication_status => ({
            ...authentication_status,
            ...{
                has_submitted_poa: true,
                needs_poi,
                poa_expiring_soon: false,
                has_submitted_duplicate_poa: has_submitted_duplicate_poa ?? false,
            },
        }));
        if (is_verification_modal_visible) {
            onSubmit?.();
        }
    };

    const {
        allow_document_upload,
        allow_poa_resubmission,
        document_status,
        needs_poi,
        resubmit_poa,
        has_submitted_poa,
        poa_address_mismatch,
        poa_expiring_soon,
        poa_authenticated_with_idv,
        has_submitted_duplicate_poa,
    } = authentication_status;

    const from_platform = getPlatformRedirect(app_routing_history);

    const should_show_redirect_btn = Object.keys(platforms).includes(from_platform?.ref ?? '');

    const should_allow_resubmit =
        resubmit_poa ||
        allow_poa_resubmission ||
        (has_restricted_mt5_account &&
            document_status &&
            ['expired', 'rejected', 'suspected'].includes(document_status)) ||
        poa_address_mismatch ||
        poa_expiring_soon ||
        (poa_authenticated_with_idv && from_platform?.route === routes.cashier_p2p);

    const redirect_button = should_show_redirect_btn && (
        <Button
            primary
            className='proof-of-identity__redirect'
            onClick={() => {
                const url = platforms[from_platform.ref as keyof typeof platforms]?.url;
                if (url) {
                    window.location.href = url;
                    window.sessionStorage.removeItem('config.platform');
                }
            }}
        >
            <Localize i18n_default_text='Back to {{platform_name}}' values={{ platform_name: from_platform.name }} />
        </Button>
    );

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (!allow_document_upload) return <NotRequired />;
    if (has_submitted_duplicate_poa)
        return (
            <Unverified
                title={<Localize i18n_default_text='Proof of address documents upload failed' />}
                description={
                    <Localize i18n_default_text='It seems you’ve submitted this document before. Upload a new document.' />
                }
                button_text={<Localize i18n_default_text='Try again' />}
                onClick={handleDuplicatePOASubmission}
            />
        );
    if (has_submitted_poa && !poa_address_mismatch)
        return <Submitted needs_poi={needs_poi} redirect_button={redirect_button} />;
    if (should_allow_resubmit) {
        return <ProofOfAddressForm is_resubmit={!poa_expiring_soon} onSubmit={onSubmitDocument} />;
    }

    switch (document_status) {
        case AUTH_STATUS_CODES.NONE:
            return <ProofOfAddressForm onSubmit={onSubmitDocument} />;
        case AUTH_STATUS_CODES.PENDING:
            return <NeedsReview needs_poi={needs_poi} redirect_button={redirect_button} />;
        case AUTH_STATUS_CODES.VERIFIED:
            return <Verified needs_poi={needs_poi} redirect_button={redirect_button} />;
        case AUTH_STATUS_CODES.EXPIRED:
            return <Expired onClick={handleResubmit} />;
        case AUTH_STATUS_CODES.REJECTED:
        case AUTH_STATUS_CODES.SUSPECTED:
            return <Unverified onClick={handleResubmit} />;
        default:
            return null;
    }
});

export default ProofOfAddressContainer;
