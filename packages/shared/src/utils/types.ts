import { ACCOUNT_BADGE_STATUS, AUTH_STATUS_CODES, EMPLOYMENT_VALUES, Jurisdiction } from './constants';

export type TBrokerCodes = typeof Jurisdiction[keyof typeof Jurisdiction];

export type TEmploymentStatus = typeof EMPLOYMENT_VALUES[keyof typeof EMPLOYMENT_VALUES];

export type TAuthStatusCodes = typeof AUTH_STATUS_CODES[keyof typeof AUTH_STATUS_CODES];

export type TAccountBadgeStatus = typeof ACCOUNT_BADGE_STATUS[keyof typeof ACCOUNT_BADGE_STATUS] | null;
