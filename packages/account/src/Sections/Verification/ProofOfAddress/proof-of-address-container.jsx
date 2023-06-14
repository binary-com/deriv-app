import React from 'react';
import PropTypes from 'prop-types';
import { Button, Loading, useStateCallback } from '@deriv/components';
import { WS, getPlatformRedirect, platforms } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import PoaExpired from 'Components/poa/status/expired';
import PoaNeedsReview from 'Components/poa/status/needs-review';
import PoaNotRequired from 'Components/poa/status/not-required';
import PoaStatusCodes from 'Components/poa/status/status-codes';
import PoaSubmitted from 'Components/poa/status/submitted';
import PoaVerified from 'Components/poa/status/verified';
import PoaUnverified from 'Components/poa/status/unverified';
import ProofOfAddressForm from './proof-of-address-form.jsx';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfAddressContainer = ({
    is_mx_mlt,
    is_switching,
    has_restricted_mt5_account,
    refreshNotifications,
    app_routing_history,
}) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [authentication_status, setAuthenticationStatus] = useStateCallback({
        allow_document_upload: false,
        allow_poi_resubmission: false,
        needs_poi: false,
        needs_poa: false,
        has_poi: false,
        resubmit_poa: false,
        has_submitted_poa: false,
        document_status: null,
        is_age_verified: false,
        poa_address_mismatch: false,
    });

    React.useEffect(() => {
        if (!is_switching) {
            WS.authorized.getAccountStatus().then(response => {
                const { get_account_status } = response;
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

                setAuthenticationStatus(
                    {
                        ...authentication_status,
                        ...{
                            allow_document_upload,
                            allow_poa_resubmission,
                            needs_poi,
                            needs_poa,
                            document_status,
                            has_submitted_poa,
                            is_age_verified,
                            poa_address_mismatch,
                        },
                    },
                    () => {
                        setIsLoading(false);
                        refreshNotifications();
                    }
                );
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    const handleResubmit = () => {
        setAuthenticationStatus({ ...authentication_status, ...{ resubmit_poa: true } });
    };

    const onSubmit = ({ needs_poi }) => {
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

    const should_show_redirect_btn = Object.keys(platforms).includes(from_platform.ref);

    const redirect_button = should_show_redirect_btn ? (
        <Button
            primary
            className='proof-of-identity__redirect'
            onClick={() => {
                const url = platforms[from_platform.ref]?.url;
                window.location.href = url;
                window.sessionStorage.removeItem('config.platform');
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
        return <PoaNotRequired />;
    if (has_submitted_poa && !poa_address_mismatch)
        return <PoaSubmitted needs_poi={needs_poi} redirect_button={redirect_button} />;
    if (
        resubmit_poa ||
        allow_poa_resubmission ||
        (has_restricted_mt5_account && ['expired', 'rejected', 'suspected'].includes(document_status)) ||
        poa_address_mismatch
    ) {
        return <ProofOfAddressForm is_resubmit onSubmit={() => onSubmit({ needs_poi })} />;
    }

    switch (document_status) {
        case PoaStatusCodes.none:
            return <ProofOfAddressForm onSubmit={() => onSubmit({ needs_poi })} />;
        case PoaStatusCodes.pending:
            return <PoaNeedsReview needs_poi={needs_poi} redirect_button={redirect_button} />;
        case PoaStatusCodes.verified:
            return <PoaVerified needs_poi={needs_poi} redirect_button={redirect_button} />;
        case PoaStatusCodes.expired:
            return <PoaExpired onClick={handleResubmit} />;
        case PoaStatusCodes.rejected:
            return <PoaUnverified onClick={handleResubmit} />;
        case PoaStatusCodes.suspected:
            return <PoaUnverified onClick={handleResubmit} />;
        default:
            return null;
    }
};

ProofOfAddressContainer.propTypes = {
    is_mx_mlt: PropTypes.bool,
    has_restricted_mt5_account: PropTypes.bool,
    is_switching: PropTypes.bool,
    refreshNotifications: PropTypes.func,
};

export default ProofOfAddressContainer;
