import React from 'react';
import countries from 'i18n-iso-countries';
import { WS } from '@deriv/shared';
import CountrySelector from 'Components/poi-country-selector';
import IdvDocumentSubmit from 'Components/poi-idv-document-submit';
import IdvUploadComplete from 'Components/poi-idv-submit-complete';
import Unsupported from 'Components/poi-unsupported';
import UploadComplete from 'Components/poi-upload-complete';
import OnfidoUpload from './onfido-sdk-view.jsx';
import { identity_status_codes, submission_status_code, service_code } from './proof-of-identity-utils';

const POISubmission = ({
    has_require_submission,
    height,
    identity_last_attempt,
    idv,
    is_from_external,
    needs_poa,
    onfido,
    onStateChange,
    redirect_button,
    refreshNotifications,
    residence_list,
}) => {
    const [submission_status, setSubmissionStatus] = React.useState(); // selecting, submitting, complete
    const [submission_service, setSubmissionService] = React.useState();
    const [selected_country, setSelectedCountry] = React.useState();

    const handleSelectionNext = () => {
        if (selected_country) {
            const { submissions_left: idv_submissions_left } = idv;
            const { submissions_left: onfido_submissions_left } = onfido;
            const is_idv_supported = selected_country.identity.services.idv.is_country_supported;
            const is_onfido_supported = selected_country.identity.services.onfido.is_country_supported;

            if (is_idv_supported && Number(idv_submissions_left) > 0) {
                setSubmissionService(service_code.idv);
            } else if (onfido_submissions_left && is_onfido_supported) {
                setSubmissionService(service_code.onfido);
            } else {
                setSubmissionService(service_code.manual);
            }
            setSubmissionStatus(submission_status_code.submitting);
        }
    };

    const handleViewComplete = () => {
        setSubmissionStatus(submission_status_code.complete);
        if (onStateChange) onStateChange(identity_status_codes.pending);

        WS.authorized.getAccountStatus().then(() => {
            refreshNotifications();
        });
    };

    const handleBack = () => setSubmissionStatus(submission_status_code.selecting);

    const getCountryFromResidence = country_code => residence_list.find(residence => residence.value === country_code);

    React.useEffect(() => {
        if (has_require_submission) {
            switch (identity_last_attempt.service) {
                case service_code.idv: {
                    if (Number(idv.submissions_left) > 0) {
                        setSubmissionStatus(submission_status_code.selecting);
                    } else if (onfido.is_country_supported) {
                        const country_code = countries.alpha3ToAlpha2(onfido.country_code.toUpperCase());
                        setSelectedCountry(getCountryFromResidence(country_code.toLowerCase()));
                        setSubmissionService(service_code.onfido);
                        setSubmissionStatus(submission_status_code.submitting);
                    } else {
                        setSubmissionService(service_code.manual);
                        setSubmissionStatus(submission_status_code.submitting);
                    }
                    break;
                }
                case service_code.onfido: {
                    setSelectedCountry(getCountryFromResidence(identity_last_attempt.country_code));
                    setSubmissionStatus(submission_status_code.submitting);
                    if (Number(onfido.submissions_left) > 0) {
                        setSubmissionService(service_code.onfido);
                    } else {
                        setSubmissionService(service_code.manual);
                    }
                    break;
                }
                case service_code.manual: {
                    setSelectedCountry(getCountryFromResidence(identity_last_attempt.country_code));
                    setSubmissionStatus(submission_status_code.submitting);
                    setSubmissionService(service_code.manual);
                    break;
                }
                default:
                    break;
            }
        } else {
            setSubmissionStatus(submission_status_code.selecting);
        }
    }, []);

    switch (submission_status) {
        case submission_status_code.selecting:
            return (
                <CountrySelector
                    residence_list={residence_list}
                    selected_country={selected_country}
                    setSelectedCountry={setSelectedCountry}
                    handleSelectionNext={handleSelectionNext}
                />
            );
        case submission_status_code.submitting: {
            switch (submission_service) {
                case service_code.idv:
                    return (
                        <IdvDocumentSubmit
                            handleViewComplete={handleViewComplete}
                            handleBack={handleBack}
                            selected_country={selected_country}
                        />
                    );
                case service_code.onfido: {
                    const country_code = selected_country.value;
                    const doc_obj = selected_country.identity.services.onfido.documents_supported;
                    const documents_supported = Object.keys(doc_obj).map(d => doc_obj[d].display_name);

                    return (
                        <OnfidoUpload
                            country_code={country_code}
                            documents_supported={documents_supported}
                            handleViewComplete={handleViewComplete}
                            height={height}
                            is_from_external={is_from_external}
                            refreshNotifications={refreshNotifications}
                        />
                    );
                }
                case service_code.manual:
                    return <Unsupported />;
                default:
                    return null;
            }
        }
        case submission_status_code.complete: {
            switch (submission_service) {
                case service_code.idv:
                    return (
                        <IdvUploadComplete
                            is_from_external={is_from_external}
                            needs_poa={needs_poa}
                            redirect_button={redirect_button}
                        />
                    );
                case service_code.onfido:
                    return (
                        <UploadComplete
                            is_from_external={is_from_external}
                            needs_poa={needs_poa}
                            redirect_button={redirect_button}
                        />
                    );
                case service_code.manual:
                    // TODO: add manual upload complete
                    return (
                        <UploadComplete
                            is_from_external={is_from_external}
                            needs_poa={needs_poa}
                            redirect_button={redirect_button}
                        />
                    );
                default:
                    return null;
            }
        }
        default:
            return null;
    }
};

export default POISubmission;
