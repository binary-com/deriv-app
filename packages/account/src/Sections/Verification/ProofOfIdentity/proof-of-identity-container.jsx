import React from 'react';
import { useHistory } from 'react-router';
import { Button, Loading } from '@deriv/components';
import { isEmptyObject, WS, getPlatformRedirect, platforms } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { identity_status_codes, service_code } from './proof-of-identity-utils';
import DemoMessage from '../../../Components/demo-message';
import ErrorMessage from '../../../Components/error-component';
import Expired from '../../../Components/poi/status/expired';
import IdvContainer from './idv.jsx';
import Limited from '../../../Components/poi/status/limited';
import { Localize } from '@deriv/translations';
import NotRequired from '../../../Components/poi/status/not-required';
import Onfido from './onfido.jsx';
import POISubmission from './proof-of-identity-submission.jsx';
import Unsupported from '../../../Components/poi/status/unsupported';
import UploadComplete from '../../../Components/poi/status/upload-complete';
import Verified from '../../../Components/poi/status/verified';
import { populateVerificationStatus } from '../Helpers/verification';

const ProofOfIdentityContainer = observer(
    ({ height, is_from_external, onStateChange, getChangeableFields, updateAccountStatus }) => {
        const history = useHistory();
        const [api_error, setAPIError] = React.useState();
        const [has_require_submission, setHasRequireSubmission] = React.useState(false);
        const [residence_list, setResidenceList] = React.useState([]);
        const [is_status_loading, setStatusLoading] = React.useState(true);

        const { client, common, notifications } = useStore();

        const {
            account_settings,
            account_status,
            fetchResidenceList,
            is_switching,
            is_high_risk,
            is_withdrawal_lock,
            should_allow_authentication,
            is_virtual,
        } = client;
        const { app_routing_history, routeBackInApp, is_language_changing } = common;
        const { refreshNotifications } = notifications;

        const from_platform = getPlatformRedirect(app_routing_history);

        const should_show_redirect_btn = Object.keys(platforms).includes(from_platform?.ref);

        const routeBackTo = redirect_route => routeBackInApp(history, [redirect_route]);
        const handleRequireSubmission = () => setHasRequireSubmission(true);
        const country_code = account_settings?.citizen || account_settings?.country_code;

        const handleManualSubmit = () => {
            WS.authorized.getAccountStatus().then(() => {
                refreshNotifications();
            });
        };

        const loadResidenceList = React.useCallback(() => {
            fetchResidenceList().then(response_residence_list => {
                if (response_residence_list.error) {
                    setAPIError(response_residence_list.error);
                } else {
                    setResidenceList(response_residence_list.residence_list);
                }
            });
        }, [fetchResidenceList]);

        React.useEffect(() => {
            if (is_language_changing) {
                loadResidenceList();
            }
        }, [is_language_changing, loadResidenceList]);

        React.useEffect(() => {
            // only re-mount logic when switching is done
            if (!is_switching) {
                setAPIError(null);
                WS.authorized.getAccountStatus().then(response_account_status => {
                    if (response_account_status.error) {
                        setAPIError(response_account_status.error);
                        setStatusLoading(false);
                        return;
                    }
                    loadResidenceList();
                    setStatusLoading(false);
                });
            }
        }, [loadResidenceList, is_switching]);

        if (api_error) {
            return <ErrorMessage error_message={api_error?.message || api_error} />;
        } else if (is_status_loading || is_switching || isEmptyObject(account_status) || residence_list.length === 0) {
            /**
             * Display loader while waiting for the account status and residence list to be populated
             */
            return <Loading is_fullscreen={false} />;
        } else if (is_virtual) {
            return <DemoMessage />;
        }

        const verification_status = populateVerificationStatus(account_status);
        const {
            identity,
            idv,
            allow_poi_resubmission,
            identity_last_attempt,
            identity_status,
            is_age_verified,
            is_idv_disallowed,
            manual,
            needs_poa,
            onfido,
            poi_expiring_soon,
        } = verification_status;
        const should_ignore_idv = is_high_risk && is_withdrawal_lock;

        if (!should_allow_authentication && !is_age_verified && !poi_expiring_soon) {
            return <NotRequired />;
        }
        const onClickRedirectButton = () => {
            const platform = platforms[from_platform.ref];
            const { is_hard_redirect = false, url = '' } = platform ?? {};
            if (is_hard_redirect) {
                window.location.href = url;
                window.sessionStorage.removeItem('config.platform');
            } else {
                routeBackTo(from_platform.route);
            }
        };

        const redirect_button = should_show_redirect_btn && (
            <Button primary className='proof-of-identity__redirect' onClick={onClickRedirectButton}>
                <Localize
                    i18n_default_text='Back to {{platform_name}}'
                    values={{ platform_name: from_platform.name }}
                />
            </Button>
        );
        const should_show_mismatch_form =
            identity_status != identity_status_codes.verified &&
            idv.submissions_left > 0 &&
            [identity_status_codes.rejected, identity_status_codes.suspected, identity_status_codes.expired].includes(
                idv.status
            );

        if (
            identity_status === identity_status_codes.none ||
            has_require_submission ||
            allow_poi_resubmission ||
            should_show_mismatch_form ||
            poi_expiring_soon
        ) {
            return (
                <POISubmission
                    account_settings={account_settings}
                    allow_poi_resubmission={allow_poi_resubmission}
                    has_require_submission={has_require_submission}
                    height={height ?? null}
                    getChangeableFields={getChangeableFields}
                    identity_last_attempt={identity_last_attempt}
                    idv={idv}
                    is_from_external={!!is_from_external}
                    is_idv_disallowed={is_idv_disallowed || should_ignore_idv}
                    manual={manual}
                    needs_poa={needs_poa}
                    onfido={onfido}
                    onStateChange={onStateChange}
                    redirect_button={redirect_button}
                    refreshNotifications={refreshNotifications}
                    residence_list={residence_list}
                    updateAccountStatus={updateAccountStatus}
                    should_show_mismatch_form={should_show_mismatch_form}
                />
            );
        } else if (
            !identity_last_attempt ||
            // Prioritise verified status from back office. How we know this is if there is mismatch between current statuses (Should be refactored)

            (identity_status === identity_status_codes.verified &&
                identity_status !== identity?.services[identity_last_attempt?.service].status)
        ) {
            switch (identity_status) {
                case identity_status_codes.pending:
                    return (
                        <UploadComplete
                            is_from_external={!!is_from_external}
                            needs_poa={needs_poa}
                            redirect_button={redirect_button}
                            is_manual_upload={manual?.status === 'pending'}
                        />
                    );
                case identity_status_codes.verified:
                    return (
                        <Verified
                            is_from_external={!!is_from_external}
                            needs_poa={needs_poa}
                            redirect_button={redirect_button}
                        />
                    );
                case identity_status_codes.expired:
                    return (
                        <Expired
                            is_from_external={!!is_from_external}
                            redirect_button={redirect_button}
                            handleRequireSubmission={handleRequireSubmission}
                        />
                    );
                case identity_status_codes.rejected:
                case identity_status_codes.suspected:
                    return <Limited handleRequireSubmission={handleRequireSubmission} />;
                default:
                    break;
            }
        }

        switch (identity_last_attempt.service) {
            case service_code.idv:
                return (
                    <IdvContainer
                        account_settings={account_settings}
                        handleRequireSubmission={handleRequireSubmission}
                        getChangeableFields={getChangeableFields}
                        idv={idv}
                        is_from_external={!!is_from_external}
                        needs_poa={needs_poa}
                        redirect_button={redirect_button}
                        residence_list={residence_list}
                    />
                );
            case service_code.onfido:
                return (
                    <Onfido
                        handleRequireSubmission={handleRequireSubmission}
                        is_from_external={!!is_from_external}
                        needs_poa={needs_poa}
                        onfido={onfido}
                        manual={manual}
                        redirect_button={redirect_button}
                        country_code={country_code}
                        handleViewComplete={handleManualSubmit}
                    />
                );
            case service_code.manual:
                return (
                    <Unsupported
                        manual={manual}
                        country_code={country_code}
                        is_from_external={is_from_external}
                        needs_poa={needs_poa}
                        redirect_button={redirect_button}
                        handleRequireSubmission={handleRequireSubmission}
                        handleViewComplete={handleManualSubmit}
                        onfido={onfido}
                    />
                );
            default:
                return null;
        }
    }
);

export default ProofOfIdentityContainer;
