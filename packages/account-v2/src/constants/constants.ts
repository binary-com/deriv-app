export const LANDING_COMPANY = {
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTAINVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
} as const;

export const AUTH_STATUS_CODES = {
    EXPIRED: 'expired',
    NONE: 'none',
    PENDING: 'pending',
    REJECTED: 'rejected',
    SUSPECTED: 'suspected',
    VERIFIED: 'verified',
} as const;

export const POI_SERVICE = {
    idv: 'idv',
    manual: 'manual',
    onfido: 'onfido',
} as const;

export const ACCOUNT_MODAL_REF = '#account_modal';

export const POI_SUBMISSION_STATUS = {
    COMPLETE: 'complete',
    SELECTING: 'selecting',
    SUBMITTING: 'submitting',
} as const;

export const API_ERROR_CODES = Object.freeze({
    CLAIMED_DOCUMENT: 'ClaimedDocument',
    DUPLICATE_ACCOUNT: 'DuplicateAccount',
});
