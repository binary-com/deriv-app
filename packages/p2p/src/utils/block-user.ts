import { isMobileOrTablet } from '@deriv/shared';
import { localize } from 'Components/i18next';

/**
 * Gets the error message to be displayed
 *
 * @param {String} default_message - Default message to be displayed
 * @param {boolean} error_message_boolean - Boolean to check if error message is to be displayed
 * @param {boolean} is_invalid_advertiser_id - Boolean to check if advertiser id is invalid
 * @param {String} name - Name of the advertiser
 * @returns {String} error message
 */
export const getErrorMessage = (
    default_message: string,
    error_message_boolean: boolean,
    is_invalid_advertiser_id: boolean,
    name: string
): string => {
    if (is_invalid_advertiser_id) {
        if (error_message_boolean) {
            return localize("Unblocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
                name,
            });
        }
        return localize("Blocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
            name,
        });
    }
    return default_message;
};

/**
 * Gets the error modal title
 *
 * @param {boolean} is_invalid_advertiser_id - Boolean to check if advertiser id is invalid
 * @param {String} name - Name of the advertiser
 * @returns {String} error modal title
 */
export const getErrorModalTitle = (is_invalid_advertiser_id: boolean, name: string): string => {
    return is_invalid_advertiser_id
        ? localize('{{name}} is no longer on Deriv P2P', {
              name,
          })
        : localize('Unable to block advertiser');
};

/**
 * Gets the width of the modal
 *
 * @returns {String} width of the modal
 */
export const getWidth = (): string => (isMobileOrTablet() ? '90rem' : '40rem');
