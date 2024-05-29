import React, { useEffect, useState } from 'react';
import { Button, Loading } from '@deriv/components';
import { getPlatformRedirect, platforms, AUTH_STATUS_CODES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import Expired from '../../../Components/poa/status/expired';
import NeedsReview from '../../../Components/poa/status/needs-review';
import ProofOfAddressForm from './proof-of-address-form';
import Unverified from '../../../Components/poa/status/unverified';
import Verified from '../../../Components/poa/status/verified';
import { useKycAuthStatus } from '../../../hooks';

type TProofOfAddressContainer = {
    onSubmit?: () => void;
};

const ProofOfAddressContainer = observer(({ onSubmit }: TProofOfAddressContainer) => {
    const [resubmit_poa, setResubmitPOA] = useState(false);

    const { kyc_auth_status, isLoading, isSuccess, reFetchKycAuthStatus } = useKycAuthStatus();

    const { common, ui, notifications } = useStore();

    const { app_routing_history } = common;
    const { is_verification_modal_visible } = ui;
    const { refreshNotifications } = notifications;

    useEffect(() => {
        if (isSuccess) refreshNotifications();
    }, [isSuccess, refreshNotifications]);

    if (isLoading || !kyc_auth_status) return <Loading is_fullscreen={false} className='account__initial-loader' />;

    const {
        address: { status },
        identity: { status: poi_status },
    } = kyc_auth_status;

    const needs_poi = !(poi_status === AUTH_STATUS_CODES.VERIFIED || poi_status === AUTH_STATUS_CODES.PENDING);

    const poa_status = resubmit_poa ? AUTH_STATUS_CODES.NONE : status;

    const onSubmitDocument = () => {
        reFetchKycAuthStatus();
        if (is_verification_modal_visible) {
            onSubmit?.();
        }
    };

    const from_platform = getPlatformRedirect(app_routing_history);

    const should_show_redirect_btn = Object.keys(platforms).includes(from_platform?.ref ?? '');

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

    switch (poa_status) {
        case AUTH_STATUS_CODES.PENDING:
            return <NeedsReview needs_poi={needs_poi} redirect_button={redirect_button} />;
        case AUTH_STATUS_CODES.VERIFIED:
            return <Verified needs_poi={needs_poi} redirect_button={redirect_button} />;
        case AUTH_STATUS_CODES.EXPIRED:
            return <Expired onClick={() => setResubmitPOA(true)} />;
        case AUTH_STATUS_CODES.REJECTED:
            return <Unverified onClick={() => setResubmitPOA(true)} />;
        default:
            return <ProofOfAddressForm is_resubmit={resubmit_poa} onSubmit={onSubmitDocument} />;
    }
});

export default ProofOfAddressContainer;
