export const onfido_status_codes = {
    none: 'onfido',
    onfido: 'onfido',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    unsupported: 'unsupported',
    not_required: 'not_required',
    expired: 'expired',
    suspected: 'suspected',
};

export const getIdentityStatus = (identity, needs_verification, is_mlt_mx, is_nigeria, allow_poi_resubmission) => {
    const { status } = identity;
    const onfido_unsupported = !identity.services.onfido.is_country_supported || is_nigeria;
    const submissions_allowed = needs_verification?.includes('identity');
    const status_allowed = ['pending', 'verified'];

    if (onfido_unsupported && (!status_allowed.includes(status) || allow_poi_resubmission))
        return onfido_status_codes.unsupported;
    if (!submissions_allowed) {
        if (status === 'none' && is_mlt_mx) {
            return onfido_status_codes.not_required;
        }
        return onfido_status_codes[status];
    }

    if (onfido_unsupported) return onfido_status_codes.unsupported;
    return onfido_status_codes.onfido;
};
