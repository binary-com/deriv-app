import React from 'react';
import UploadComplete from 'Components/poi-upload-complete';
import Expired from 'Components/poi-expired';
import Verified from 'Components/poi-verified';
import RejectedReasons from 'Components/poi-rejected-reasons';
import Limited from 'Components/poi-limited';
import { identity_status_codes } from './proof-of-identity-utils';

const Onfido = ({ handleRequireSubmission, is_from_external, onfido, redirect_button, verification_status }) => {
    const { status, submissions_left, last_rejected: rejected_reasons } = onfido;
    const { needs_poa } = verification_status;

    switch (status) {
        case identity_status_codes.pending:
            return (
                <UploadComplete
                    is_from_external={is_from_external}
                    needs_poa={needs_poa}
                    redirect_button={redirect_button}
                />
            );
        case identity_status_codes.rejected:
        case identity_status_codes.suspected:
            if (Number(submissions_left) < 1) return <Limited handleRequireSubmission={handleRequireSubmission} />;
            return (
                <RejectedReasons
                    rejected_reasons={rejected_reasons}
                    handleRequireSubmission={handleRequireSubmission}
                />
            );
        case identity_status_codes.verified:
            return (
                <Verified is_from_external={is_from_external} needs_poa={needs_poa} redirect_button={redirect_button} />
            );
        case identity_status_codes.expired:
            return (
                <Expired
                    is_from_external={is_from_external}
                    redirect_button={redirect_button}
                    handleRequireSubmission={handleRequireSubmission}
                />
            );
        default:
            return null;
    }
};

export default Onfido;
