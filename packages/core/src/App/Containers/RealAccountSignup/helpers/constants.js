import { localize } from '@deriv/translations';

/**
 * Experian result is defined by client's information validity.
 * Defines the possible types of actions needed to take on experian result response.
 *
 * Possible values are:
 *   - Success: Client can trade
 *   - Warn: POI/POA Validity partially failed, trade in demo possible
 *   - Danger: POI/POA validation failed. Trade is locked until this resolved.
 *   - Pending: POI/POA is in pending state.
 * @enum {EXPERIAN}
 */
export const EXPERIAN = {
    SUCCESS: 1,
    WARN: 0,
    DANGER: -1,
    PENDING: -2,
};

/**
 * Return account title for the given landing company
 *
 * @param {string} landing_company_shortcode
 * @return {string} localized title
 */
export const getAccountTitle = landing_company_shortcode => {
    switch (landing_company_shortcode) {
        case 'svg':
            return localize('Options & Multipliers');
        case 'maltainvest':
            return localize('Multipliers');
        default:
            return localize('Deriv');
    }
};

/**
 * @param {string} landing_company_shortcode
 *
 * @return {EXPERIAN.WARN|EXPERIAN.SUCCESS|EXPERIAN.DANGER}
 */
export const getExperianResult = status => {
    const { landing_company_shortcode = '' } = status;

    if (landing_company_shortcode === 'svg') return EXPERIAN.SUCCESS;

    return EXPERIAN.SUCCESS;
};

export const screen_height_sm_threshold = 930;
