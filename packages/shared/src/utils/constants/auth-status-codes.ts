export const AUTH_STATUS_CODES = {
    NONE: 'none',
    PENDING: 'pending',
    REJECTED: 'rejected',
    VERIFIED: 'verified',
    EXPIRED: 'expired',
    SUSPECTED: 'suspected',
} as const;

export const ACCOUNT_BADGE_STATUS = {
    FAILED: 'failed',
    NEEDS_VERIFICATION: 'needs_verification',
    PENDING: 'pending',
} as const;
