import React from 'react';
import PropTypes from 'prop-types';
import { Loading, useStateCallback } from '@deriv/components';
import { WS } from '@deriv/shared';
import PoincUnverified from 'Components/poinc/status/unverified';
import PoincReceived from 'Components/poinc/status/received';
import PoincLimited from 'Components/poinc/status/limited';
import PoincVerified from 'Components/poinc/status/verified';
import PoincNotRequired from 'Components/poinc/status/not-required';
import { populateVerificationStatus } from '../Helpers/verification';
import ProofOfIncomeForm from './proof-of-income-form.jsx';
import { income_status_codes, poinc_documents_list } from './proof-of-income-utils';

const ProofOfIncomeContainer = ({ is_switching, refreshNotifications }) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [authentication_status, setAuthenticationStatus] = useStateCallback({
        allow_document_upload: false,
        allow_poinc_resubmission: false,
        needs_poinc: false,
        income_status: null,
        is_age_verified: false,
    });

    React.useEffect(() => {
        if (!is_switching) {
            WS.authorized.getAccountStatus().then(response => {
                const { get_account_status } = response;
                const { allow_document_upload, allow_poinc_resubmission, income_status, needs_poinc, is_age_verified } =
                    populateVerificationStatus(get_account_status);

                setAuthenticationStatus(
                    {
                        ...authentication_status,
                        ...{
                            allow_document_upload,
                            allow_poinc_resubmission,
                            needs_poinc,
                            income_status,
                            is_age_verified,
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

    const handleSubmit = status => {
        setAuthenticationStatus({ ...authentication_status, ...{ income_status: status } });
    };

    const { allow_document_upload, allow_poinc_resubmission, income_status, needs_poinc, is_age_verified } =
        authentication_status;

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (
        allow_document_upload &&
        needs_poinc &&
        is_age_verified &&
        ((allow_poinc_resubmission && income_status === income_status_codes.locked) ||
            income_status === income_status_codes.none)
    ) {
        return <ProofOfIncomeForm onSubmit={handleSubmit} poinc_documents_list={poinc_documents_list} />;
    }
    if (!allow_document_upload || !needs_poinc || (!is_age_verified && income_status === income_status_codes.none)) {
        return <PoincNotRequired />;
    }
    if (income_status === income_status_codes.pending) return <PoincReceived />;
    if (income_status === income_status_codes.verified) return <PoincVerified />;
    if (income_status === income_status_codes.rejected) return <PoincUnverified onReSubmit={handleSubmit} />;
    if (income_status === income_status_codes.locked) return <PoincLimited />;

    return <React.Fragment />;
};

ProofOfIncomeContainer.propTypes = {
    is_switching: PropTypes.bool,
    refreshNotifications: PropTypes.func,
};

export default ProofOfIncomeContainer;
