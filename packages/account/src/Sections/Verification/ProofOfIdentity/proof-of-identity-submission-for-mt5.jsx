/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { WS, Jurisdiction, IDV_NOT_APPLICABLE_OPTION } from '@deriv/shared';
import Unsupported from 'Components/poi/status/unsupported';
import OnfidoUpload from './onfido-sdk-view-container';
import { identity_status_codes, submission_status_code, service_code } from './proof-of-identity-utils';
import { IdvDocSubmitOnSignup } from 'Components/poi/poi-form-on-signup/idv-doc-submit-on-signup/idv-doc-submit-on-signup';
import { AutoHeightWrapper } from '@deriv/components';
import { makeSettingsRequest } from 'Helpers/utils';

const POISubmissionForMT5 = ({
    account_settings,
    getChangeableFields,
    idv,
    is_idv_disallowed,
    onfido,
    onStateChange,
    refreshNotifications,
    citizen_data,
    has_idv_error,
    jurisdiction_selected_shortcode,
}) => {
    const [submission_status, setSubmissionStatus] = React.useState(); // submitting
    const [submission_service, setSubmissionService] = React.useState();
    React.useEffect(() => {
        if (citizen_data) {
            const { submissions_left: idv_submissions_left } = idv;
            const { submissions_left: onfido_submissions_left } = onfido;
            const is_idv_supported = citizen_data.identity.services.idv.is_country_supported;
            const is_onfido_supported = citizen_data.identity.services.onfido.is_country_supported;
            if (
                is_idv_supported &&
                Number(idv_submissions_left) > 0 &&
                !is_idv_disallowed &&
                jurisdiction_selected_shortcode !== Jurisdiction.VANUATU
            ) {
                setSubmissionService(service_code.idv);
            } else if (onfido_submissions_left > 0 && is_onfido_supported) {
                setSubmissionService(service_code.onfido);
            } else {
                setSubmissionService(service_code.manual);
            }
            setSubmissionStatus(submission_status_code.submitting);
        }
    }, [citizen_data]);

    const handlePOIComplete = () => {
        if (onStateChange && typeof onStateChange === 'function') {
            onStateChange(identity_status_codes.pending);
        }
        WS.authorized.getAccountStatus().then(() => {
            refreshNotifications();
        });
    };

    const handleIdvSubmit = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(true);
        const { document_number, document_type } = values;

        const request = makeSettingsRequest(values, [...getChangeableFields()]);

        const data = await WS.setSettings(request);

        if (data.error) {
            setErrors({ error_message: data.error.message });
            setSubmitting(false);
            return;
        }
        const get_settings = WS.authorized.storage.getSettings();

        if (get_settings.error) {
            setErrors({ error_message: get_settings.error.message });
            setSubmitting(false);
            return;
        }

        const submit_data = {
            identity_verification_document_add: 1,
            document_number,
            document_type: document_type.id,
            issuing_country: citizen_data.value,
        };

        if (submit_data.document_type === IDV_NOT_APPLICABLE_OPTION.id) {
            handlePOIComplete();
            return;
        }

        WS.send(submit_data).then(response => {
            setSubmitting(false);
            if (response.error) {
                setErrors({ error_message: response.error.message });
                return;
            }
            handlePOIComplete();
        });
    };

    if (submission_status === submission_status_code.submitting) {
        switch (submission_service) {
            case service_code.idv:
                return (
                    <IdvDocSubmitOnSignup
                        citizen_data={citizen_data}
                        onNext={handleIdvSubmit}
                        has_idv_error={has_idv_error}
                        getChangeableFields={getChangeableFields}
                        account_settings={account_settings}
                    />
                );
            case service_code.onfido: {
                const country_code = citizen_data.value;
                const doc_obj = citizen_data.identity.services.onfido.documents_supported;
                const documents_supported = Object.keys(doc_obj).map(d => doc_obj[d].display_name);

                return (
                    <AutoHeightWrapper default_height={620} height_offset={50}>
                        {({ setRef, height }) => (
                            <div ref={setRef} style={{ height }}>
                                <OnfidoUpload
                                    account_settings={account_settings}
                                    getChangeableFields={getChangeableFields}
                                    country_code={country_code}
                                    documents_supported={documents_supported}
                                    handleViewComplete={handlePOIComplete}
                                    height={height}
                                />
                            </div>
                        )}
                    </AutoHeightWrapper>
                );
            }
            case service_code.manual:
                return (
                    <Unsupported
                        onfido={onfido}
                        country_code={citizen_data.value}
                        is_mt5
                        handlePOIforMT5Complete={handlePOIComplete}
                    />
                );
            default:
                return null;
        }
    } else {
        return null;
    }
};

export default POISubmissionForMT5;
