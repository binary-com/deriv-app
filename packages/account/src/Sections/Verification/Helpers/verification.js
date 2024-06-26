export const populateVerificationStatus = account_status => {
    if (!account_status || !account_status.authentication) return {};

    const { attempts, document, identity, income, needs_verification } = account_status.authentication;

    const identity_status = identity.status;
    const document_status = document.status;
    const income_status = income.status;

    const allow_document_upload = account_status.status.some(status => status === 'allow_document_upload');
    const allow_poi_resubmission = account_status.status.some(status => status === 'allow_poi_resubmission');
    const allow_poa_resubmission = account_status.status.some(status => status === 'allow_poa_resubmission');
    const allow_poinc_resubmission = account_status.status.some(status => status === 'allow_poinc_resubmission');
    const is_age_verified = account_status.status.some(status => status === 'age_verification');
    const is_fully_authenticated = account_status.status.some(status => status === 'authenticated');
    const is_idv_disallowed = account_status.status.some(status => status === 'idv_disallowed');
    const poa_address_mismatch = account_status.status.some(status => status === 'poa_address_mismatch');
    const poi_expiring_soon = account_status.status.some(status => status === 'poi_expiring_soon');
    const poa_authenticated_with_idv = account_status.status.some(status => status === 'poa_authenticated_with_idv');
    const poa_expiring_soon = account_status.status.some(status => status === 'poa_expiring_soon');

    const has_poa = !(document && document.status === 'none');
    const has_poi = !(identity && identity.status === 'none');
    const has_poinc = !(income && income.status === 'none');
    const has_submitted_poa = document_status === 'pending' && !allow_poa_resubmission;
    const needs_poa = Boolean(needs_verification.length) && needs_verification.includes('document');
    const needs_poi = Boolean(needs_verification.length) && needs_verification.includes('identity');
    const needs_poinc = needs_verification.length && needs_verification.includes('income');

    const { idv, onfido, manual } = identity.services;
    const identity_last_attempt = attempts.latest;
    const has_attempted_idv = Boolean(attempts.history.length && attempts.history.find(h => h.service === 'idv'));

    return {
        allow_document_upload,
        allow_poa_resubmission,
        allow_poi_resubmission,
        allow_poinc_resubmission,
        has_attempted_idv,
        has_poa,
        has_poi,
        has_poinc,
        has_submitted_poa,
        identity_last_attempt,
        identity_status,
        document_status,
        income_status,
        idv,
        is_age_verified,
        is_fully_authenticated,
        is_idv_disallowed,
        manual,
        needs_poa,
        needs_poi,
        needs_poinc,
        needs_verification,
        onfido,
        poa_address_mismatch,
        poa_authenticated_with_idv,
        poi_expiring_soon,
        poa_expiring_soon,
    };
};
