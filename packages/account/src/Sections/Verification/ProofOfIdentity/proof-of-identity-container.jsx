import * as Cookies from 'js-cookie';
import React from 'react';
import { PropTypes } from 'prop-types';
import { Loading, usePrevious, useStateCallback } from '@deriv/components';
import { localize } from '@deriv/translations';
import Limited from 'Components/poi-limited';
import Unverified from 'Components/poi-unverified';
import NotRequired from 'Components/poi-not-required';
import RejectedReasons from 'Components/poi-rejected-reasons';

import UploadComplete from 'Components/poi-upload-complete';
import Unsupported from 'Components/poi-unsupported';
import Expired from 'Components/poi-expired';
import OnfidoFailed from 'Components/poi-onfido-failed';
import Verified from 'Components/poi-verified';

import ErrorMessage from 'Components/error-component';
import Onfido from './onfido.jsx';
import { getIdentityStatus, onfido_status_codes } from './proof-of-identity';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfIdentityContainer = ({
    account_status,
    addNotificationByKey,
    getAccountStatus,
    serviceToken,
    notificationEvent,
    removeNotificationByKey,
    refreshNotifications,
    removeNotificationMessage,
    onStateChange,
    is_message_enabled = true,
    is_description_enabled = true,
    is_mx_mlt,
    is_nigeria,
    height,
    redirect_button,
}) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [api_error, setAPIError] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const [documents_supported, setDocumentsSupported] = React.useState(null);
    const [country_code_key, setCountryCode] = React.useState(null);
    const [onfido_service_token, setOnfidoServiceToken] = React.useState(null);
    const [verification_status, setVerificationStatus] = useStateCallback({});
    const [submissions_left_key, setSubmissionsLeft] = React.useState(null);
    const [rejected_reasons_key, setRejectedReasons] = React.useState([]);
    const [is_continue_uploading, setContinueUploading] = React.useState(false);
    const [identity_status_key, setIdentityStatus] = React.useState(false);
    const previous_account_status = usePrevious(account_status);
    const [current_account_status, setCurrentAccountStatus] = React.useState();

    const getOnfidoServiceToken = React.useCallback(
        () =>
            new Promise(resolve => {
                const onfido_cookie_name = 'onfido_token';
                const onfido_cookie = Cookies.get(onfido_cookie_name);

                if (!onfido_cookie) {
                    serviceToken({
                        service_token: 1,
                        service: 'onfido',
                    }).then(response => {
                        if (response.error) {
                            resolve({ error: response.error });
                            return;
                        }

                        const { token } = response.service_token.onfido;
                        const in_90_minutes = 1 / 16;
                        Cookies.set(onfido_cookie_name, token, {
                            expires: in_90_minutes,
                            secure: true,
                            sameSite: 'strict',
                        });
                        resolve(token);
                    });
                } else {
                    resolve(onfido_cookie);
                }
            }),
        [serviceToken]
    );

    const createVerificationConfig = React.useCallback(
        (account_status_obj, onfido_token) => {
            const {
                allow_document_upload,
                allow_poi_resubmission,
                has_poa,
                needs_poa,
                is_unwelcome,
                onfido_supported_docs,
                country_code,
                rejected_reasons,
                submissions_left,
            } = populateVerificationStatus(account_status_obj);

            const { identity, needs_verification } = account_status_obj.authentication;

            const identity_status = getIdentityStatus(
                identity,
                needs_verification,
                is_mx_mlt,
                is_nigeria,
                allow_poi_resubmission
            );

            const has_no_rejections = !rejected_reasons?.length;

            setVerificationStatus({ allow_document_upload, has_poa, needs_poa, is_unwelcome }, () => {
                setStatus(identity_status);
                setIdentityStatus(identity?.status);
                if (onfido_token) {
                    setOnfidoServiceToken(onfido_token);
                }
                setDocumentsSupported(onfido_supported_docs);
                setCountryCode(country_code);
                setSubmissionsLeft(submissions_left);
                setRejectedReasons(rejected_reasons);
                setContinueUploading(has_no_rejections);
                refreshNotifications();
                if (onStateChange) onStateChange({ status });
            });
        },
        [is_mx_mlt, onStateChange, refreshNotifications, setVerificationStatus, status]
    );

    const handleComplete = data => {
        const docIds = [];
        Object.keys(data).forEach(key => {
            docIds.push(data[key].id);
        });

        notificationEvent({
            notification_event: 1,
            category: 'authentication',
            event: 'poi_documents_uploaded',
            args: {
                documents: docIds,
            },
        }).then(response => {
            if (response.error) {
                setAPIError(true);
                return;
            }
            setStatus('pending');
            // TODO: clean all of this up by simplifying the manually toggled notifications functions
            removeNotificationMessage({ key: 'authenticate' });
            removeNotificationByKey({ key: 'authenticate' });
            removeNotificationMessage({ key: 'needs_poi' });
            removeNotificationByKey({ key: 'needs_poi' });
            removeNotificationMessage({ key: 'poi_expired' });
            removeNotificationByKey({ key: 'poi_expired' });
            if (verification_status?.needs_poa) addNotificationByKey('needs_poa');
            if (onStateChange) onStateChange({ status: 'pending' });
        });
    };
    // component didMount hook
    React.useEffect(() => {
        getAccountStatus().then(response => {
            const { get_account_status } = response;
            getOnfidoServiceToken()
                .then(token => {
                    // TODO: handle error for onfido_service_token.error.code === 'MissingPersonalDetails'
                    createVerificationConfig(get_account_status, token);
                    setCurrentAccountStatus(get_account_status);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // component didUpdate hook, checks previous account_status and current account_status to handle account switching
    React.useEffect(() => {
        if (current_account_status && previous_account_status) {
            if (previous_account_status !== current_account_status) {
                createVerificationConfig(current_account_status);
            }
        }
    }, [createVerificationConfig, previous_account_status, account_status]);

    const { needs_poa, is_unwelcome, allow_document_upload } = verification_status;
    const rejectionStatus = [onfido_status_codes.rejected, onfido_status_codes.suspected];
    const is_rejected = rejectionStatus
        .map(status_code => onfido_status_codes[status_code])
        .includes(identity_status_key);
    const has_rejected_reasons = !!rejected_reasons_key.length && is_rejected;

    if (api_error)
        return (
            <ErrorMessage error_message={localize('Sorry, there was a connection error. Please try again later.')} />
        );
    if (is_loading || status.length === 0) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (is_unwelcome && !allow_document_upload) return <Unverified is_description_enabled={is_description_enabled} />;
    if (status === onfido_status_codes.not_required) return <NotRequired />;
    if (!submissions_left_key && is_rejected) return <Limited />;
    if (has_rejected_reasons && !is_continue_uploading)
        return <RejectedReasons rejected_reasons={rejected_reasons_key} setContinueUploading={setContinueUploading} />;

    const common_props = {
        needs_poa,
        is_description_enabled,
        redirect_button,
    };

    const onfido_props = {
        country_code: country_code_key,
        documents_supported,
        onfido_service_token,
        is_message_enabled,
        height: height ?? null,
        handleComplete,
        ...common_props,
    };

    switch (status) {
        case onfido_status_codes.onfido:
            return <Onfido {...onfido_props} />;
        case onfido_status_codes.unsupported:
            return <Unsupported {...onfido_props} />;
        case onfido_status_codes.pending:
            return <UploadComplete {...common_props} />;
        case onfido_status_codes.rejected:
            return <OnfidoFailed {...common_props} />;
        case onfido_status_codes.verified:
            return <Verified {...common_props} />;
        case onfido_status_codes.expired:
            return <Expired {...common_props} />;
        case onfido_status_codes.suspected:
            return <OnfidoFailed {...common_props} />;
        default:
            return null;
    }
};

ProofOfIdentityContainer.propTypes = {
    account_status: PropTypes.object,
    addNotificationByKey: PropTypes.func,
    getAccountStatus: PropTypes.func,
    is_description_enabled: PropTypes.bool,
    serviceToken: PropTypes.func,
    notificationEvent: PropTypes.func,
    removeNotificationByKey: PropTypes.func,
    refreshNotifications: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    onStateChange: PropTypes.func,
    is_mx_mlt: PropTypes.bool,
    height: PropTypes.number,
    redirect_button: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default ProofOfIdentityContainer;
