import { Duration } from 'moment';
import { getDiffDuration, toMoment, epochToMoment } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { api_error_codes } from 'Constants/api-error-codes';

/**
 * Function to generate localized error title for the corresponding error code
 *
 * @param {string} error_code - The error code returned from the API
 * @returns {string} The title for the error dialog
 */
export const generateErrorDialogTitle = (error_code: string): string => {
    switch (error_code) {
        case api_error_codes.ADVERT_SAME_LIMITS:
            return localize('You already have an ad with this range');
        case api_error_codes.DUPLICATE_ADVERT:
            return localize('You already have an ad with this rate');
        default:
            return localize("Something's not right");
    }
};

/**
 * Function to generate the error message for the error dialog based on the given error code and message.
 *
 * @param {string} error_code - The error code to determine the error message for.
 * @param {string} error_message - The custom error message to be displayed, if applicable.
 * @returns {string} The error message for the dialog.
 */
export const generateErrorDialogBody = (error_code: string, error_message?: string): string => {
    switch (error_code) {
        case api_error_codes.ADVERT_SAME_LIMITS:
            return localize(
                'Please set a different minimum and/or maximum order limit. \n\nThe range of your ad should not overlap with any of your active ads.'
            );
        case api_error_codes.DUPLICATE_ADVERT:
            return localize(
                'You already have an ad with the same exchange rate for this currency pair and order type. \n\nPlease set a different rate for your ad.'
            );
        default:
            return error_message ?? localize("Something's not right");
    }
};

const getStatusLabel = (diff: Duration) => {
    if (diff.years()) return localize('Seen more than 6 months ago');

    if (diff.months()) {
        if (diff.months() > 6) {
            return localize('Seen more than 6 months ago');
        }
        if (diff.months() === 1) {
            return localize('Seen {{ duration }} month ago', {
                duration: diff.months(),
            });
        }
        return localize('Seen {{ duration }} months ago', {
            duration: diff.months(),
        });
    }
    if (diff.days()) {
        if (diff.days() === 1) {
            return localize('Seen {{ duration }} day ago', {
                duration: diff.days(),
            });
        }
        return localize('Seen {{ duration }} days ago', {
            duration: diff.days(),
        });
    }
    if (diff.hours()) {
        if (diff.hours() === 1) {
            return localize('Seen {{ duration }} hour ago', {
                duration: diff.hours(),
            });
        }
        return localize('Seen {{ duration }} hours ago', {
            duration: diff.hours(),
        });
    }
    if (diff.minutes()) {
        if (diff.minutes() === 1) {
            return localize('Seen {{ duration }} minute ago', {
                duration: diff.minutes(),
            });
        }
        return localize('Seen {{ duration }} minutes ago', {
            duration: diff.minutes(),
        });
    }
    return localize('Online');
};

const getTimeDifference = (last_seen_online: number) => {
    const start_time = epochToMoment(last_seen_online).unix();
    const end_time = toMoment().unix();
    return getDiffDuration(start_time, end_time);
};

/**
 * Function to generate the status label for the user based on the given online status and last online time.
 *
 * @param {0|1} is_online - The online status of the user
 * @param {number} last_online_time - The last online time in epoch
 * @returns {string} The status label to be shown.
 */
export const getLastOnlineLabel = (is_online: 0 | 1, last_online_time?: number) => {
    if (!is_online) {
        if (last_online_time) {
            const diff = getTimeDifference(last_online_time);
            return getStatusLabel(diff);
        }
        return localize('Seen more than 6 months ago');
    }
    return localize('Online');
};

/**
 * Function to get the message to be shown to users when they are not eligible to create an order against an advert.
 *
 * @param {string[]} eligibility_statuses - The list of reasons why the user is not eligible.
 * @returns {string} The eligibility message based on the given eligibility statuses.
 */
export const getEligibilityMessage = (eligibility_statuses: string[]) => {
    if (eligibility_statuses.length === 1) {
        if (eligibility_statuses.includes('completion_rate')) {
            return localize('Your completion rate is too low for this ad.');
        } else if (eligibility_statuses.includes('join_date')) {
            return localize("You've not used Deriv P2P long enough for this ad.");
        }
    }

    return localize("The advertiser has set conditions for this ad that you don't meet.");
};
