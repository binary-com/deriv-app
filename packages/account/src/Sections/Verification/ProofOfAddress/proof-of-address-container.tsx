import React from 'react';
import { AccountStatusResponse, GetAccountStatus } from '@deriv/api-types';
import { Button, Loading } from '@deriv/components';
import { WS, getPlatformRedirect, platforms } from '@deriv/shared';
import { TCoreStores } from '@deriv/stores/types';
import { Localize } from '@deriv/translations';
import Expired from '../../../Components/poa/status/expired';
import NeedsReview from '../../../Components/poa/status/needs-review';
import NotRequired from '../../../Components/poa/status/not-required';
import PoaStatusCodes from '../../../Components/poa/status/status-codes';
import ProofOfAddressForm from './proof-of-address-form';
import Submitted from '../../../Components/poa/status/submitted';
import Unverified from '../../../Components/poa/status/unverified';
import Verified from '../../../Components/poa/status/verified';
import { populateVerificationStatus } from '../Helpers/verification';

type TProofOfAddressContainer = {
    is_mx_mlt?: boolean;
    is_switching?: boolean;
    has_restricted_mt5_account?: boolean;
    refreshNotifications: TCoreStores['notifications']['refreshNotifications'];
    app_routing_history: TCoreStores['portfolio']['error']['app_routing_history'];
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
    | 'resubmit_poa',
    boolean
> & { document_status?: DeepRequired<GetAccountStatus>['authentication']['document']['status'] };

const ProofOfAddressContainer = ({
    is_mx_mlt,
    is_switching,
    has_restricted_mt5_account,
    refreshNotifications,
    app_routing_history,
}: TProofOfAddressContainer) => {
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
    });

    // authentication_status

    React.useEffect(() => {
        if (!is_switching) {
            WS.authorized.getAccountStatus().then((response: AccountStatusResponse) => {
                const { get_account_status } = response;
                if (get_account_status) {
                    const {
                        allow_document_upload,
                        allow_poa_resubmission,
                        needs_poi,
                        needs_poa,
                        document_status,
                        is_age_verified,
                        poa_address_mismatch,
                    } = populateVerificationStatus(get_account_status);
                    const has_submitted_poa = document_status === PoaStatusCodes.pending && !allow_poa_resubmission;

                    setAuthenticationStatus({
                        ...authentication_status,
                        allow_document_upload,
                        allow_poa_resubmission,
                        needs_poi,
                        needs_poa,
                        document_status,
                        has_submitted_poa,
                        is_age_verified,
                        poa_address_mismatch,
                    });
                    setIsLoading(false);
                    refreshNotifications();
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    const handleResubmit = () => {
        setAuthenticationStatus({ ...authentication_status, ...{ resubmit_poa: true } });
    };

    const onSubmit = (needs_poi: boolean) => {
        setAuthenticationStatus({ ...authentication_status, ...{ has_submitted_poa: true, needs_poi } });
    };

    const {
        allow_document_upload,
        allow_poa_resubmission,
        document_status,
        needs_poi,
        resubmit_poa,
        has_submitted_poa,
        is_age_verified,
        poa_address_mismatch,
    } = authentication_status;

    const from_platform = getPlatformRedirect(app_routing_history);

    const should_show_redirect_btn = Object.keys(platforms).includes(from_platform?.ref ?? '');

    const redirect_button = should_show_redirect_btn ? (
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
    ) : null;

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (
        !allow_document_upload ||
        (!is_age_verified && !allow_poa_resubmission && document_status === 'none' && is_mx_mlt)
    )
        return <NotRequired />;
    if (has_submitted_poa && !poa_address_mismatch)
        return <Submitted needs_poi={needs_poi} redirect_button={redirect_button} />;
    if (
        resubmit_poa ||
        allow_poa_resubmission ||
        (has_restricted_mt5_account &&
            (['expired', 'rejected', 'suspected'] as TAuthenticationStatus['document_status'][]).includes(
                document_status
            )) ||
        poa_address_mismatch
    ) {
        return <ProofOfAddressForm is_resubmit onSubmit={onSubmit} />;
    }

    switch (document_status) {
        case PoaStatusCodes.none:
            return <ProofOfAddressForm onSubmit={onSubmit} />;
        case PoaStatusCodes.pending:
            return <NeedsReview needs_poi={needs_poi} redirect_button={redirect_button} />;
        case PoaStatusCodes.verified:
            return <Verified needs_poi={needs_poi} redirect_button={redirect_button} />;
        case PoaStatusCodes.expired:
            return <Expired onClick={handleResubmit} />;
        case PoaStatusCodes.rejected:
        case PoaStatusCodes.suspected:
            return <Unverified onClick={handleResubmit} />;
        default:
            return null;
    }
};

export default ProofOfAddressContainer;
