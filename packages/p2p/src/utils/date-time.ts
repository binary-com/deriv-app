/**
 * Gets the formatted date string in the format "DD MMM YYYY HH:mm:ss". e.g.: "01 Jan 1970 21:01:11"
 * or "MMM DD YYYY HH:mm:ss" for local time. e.g.: "Jan 01 1970 21:01:11" or without seconds if
 * has_seconds is false. e.g.: "01 Jan 1970 21:01" or "Jan 01 1970 21:01".
 *
 * @param {Date} date_obj - The date object to format.
 * @param {boolean} is_local - Whether to use local time or UTC time.
 * @param {boolean} has_seconds - Whether to include seconds in the time.
 * @returns {String} The formatted date string.
 */
export const getFormattedDateString = (
    date_obj: Date,
    is_local = false,
    has_seconds = false,
    only_date = false
): string => {
    const date_string = is_local ? date_obj.toString().split(' ') : date_obj.toUTCString().split(' ');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, day, month, year, time] = date_string;
    const times = time.split(':');

    // Return time in the format "HH:mm:ss". e.g.: "01 Jan 1970 21:01:11"
    if (!has_seconds) {
        times.pop();
    }

    if (only_date) {
        return `${month} ${day} ${year}`;
    }

    const time_without_sec = times.join(':');

    // Return in the format "DD MMM YYYY HH:mm". e.g.: "01 Jan 1970 21:01"
    return `${day} ${month} ${year}, ${time_without_sec}`;
};

/**
 * Converts the epoch time to milliseconds.
 * @param {Number} epoch - The epoch time to convert.
 * @returns {Number} The epoch time in milliseconds.
 */
export const convertToMillis = (epoch: number): number => {
    const milliseconds = epoch * 1000;
    return milliseconds;
};

/**
 * Gets the date string after the given number of hours.
 * @param {Number} initial_epoch - The initial epoch time.
 * @param {Number} hours - The number of hours to add.
 * @returns {String} The date string after the given number of hours.
 */
export const getDateAfterHours = (initial_epoch: number, hours: number): string => {
    const milliseconds = hours * 60 * 60 * 1000;
    const initial_day_milliseconds = convertToMillis(initial_epoch);
    const total_milliseconds = initial_day_milliseconds + milliseconds;

    return getFormattedDateString(new Date(total_milliseconds));
};

/**
 * Converts a number to double digits.
 * @param {Number} number - The number to convert.
 * @returns {String} The number in double digits.
 */
const toDoubleDigits = (number: number): string => number.toString().padStart(2, '0');

/**
 * Converts the distance in milliseconds to a timer string in the format "HH:MM:SS". e.g.: "00:00:00"
 * @param {Number} distance - The distance in milliseconds.
 * @returns {String} The timer string.
 */
export const millisecondsToTimer = (distance: number): string => {
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${toDoubleDigits(hours)}:${toDoubleDigits(minutes)}:${toDoubleDigits(seconds)}`;
};
