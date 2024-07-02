/**
 * this comes from mt5_login_list endpoint
 */
export const MT5_ACCOUNT_STATUS = Object.freeze({
    FAILED: 'failed',
    MIGRATED_WITH_POSITION: 'migrated_with_position',
    MIGRATED_WITHOUT_POSITION: 'migrated_without_position',
    NEEDS_VERIFICATION: 'needs_verification',
    PENDING: 'pending',
    POA_PENDING: 'poa_pending',
    POA_VERIFIED: 'poa_verified',
    UNDER_MAINTENANCE: 'under_maintenance',
    UNAVAILABLE: 'unavailable',
});

/**
 * this comes from trading_platform_status endpoint
 */
export const TRADING_PLATFORM_STATUS = Object.freeze({
    ACTIVE: 'active',
    DISABLED: 'disabled',
    MAINTENANCE: 'maintenance',
    UNAVAILABLE: 'unavailable',
});
