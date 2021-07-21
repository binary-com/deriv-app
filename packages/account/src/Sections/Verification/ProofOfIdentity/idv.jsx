import React from 'react';
import IdvSubmitComplete from 'Components/poi-idv-submit-complete';
import IdvExpired from 'Components/poi-idv-expired';
import IdvVerified from 'Components/poi-idv-verified';
import IdvRejected from 'Components/poi-idv-rejected';
import IdvNoSubmissions from 'Components/poi-idv-limited';
import { identity_status_codes } from './proof-of-identity-utils';

const Idv = ({ handleRequireSubmission, idv, redirect_button, verification_status, is_from_external }) => {
    const { status, submissions_left } = idv;
    const { needs_poa } = verification_status;

    switch (status) {
        case identity_status_codes.pending:
            return <IdvSubmitComplete is_from_external={is_from_external} needs_poa={needs_poa} />;
        case identity_status_codes.rejected:
        case identity_status_codes.suspected:
            if (Number(submissions_left) < 1)
                return <IdvNoSubmissions handleRequireSubmission={handleRequireSubmission} />;
            return <IdvRejected handleRequireSubmission={handleRequireSubmission} />;
        case identity_status_codes.verified:
            return (
                <IdvVerified
                    is_from_external={is_from_external}
                    needs_poa={needs_poa}
                    redirect_button={redirect_button}
                />
            );
        case identity_status_codes.expired:
            return <IdvExpired redirect_button={redirect_button} handleRequireSubmission={handleRequireSubmission} />;
        default:
            return null;
    }
};

export default Idv;
