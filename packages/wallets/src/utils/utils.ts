/**
 * A utility function that returns a formatted date string after converting date objects/strings.
 * @param dateInput - The date object, string, or Unix timestamp that needs to be converted/formatted.
 * @param options - (Optional) Intl.DateTimeFormatOptions to specify the format of the returned date. Default format is 'YYYY-MM-DD' (ISO 8601).
 * @param format - (Optional) The predefined format of the returned date. Available options: 'YYYY-MM-DD', 'DD MMM YYYY', 'MMM DD YYYY'.
 * @param unix - (Optional) If true, treats the input as a Unix timestamp.
 * @returns Formatted date string according to the specified format.
 */
export const getFormattedDateString = (
    dateInput: Date | number | string,
    options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' },
    format = 'YYYY-MM-DD',
    unix = false
): string => {
    let dateObj: Date;
    const dateOptions: Intl.DateTimeFormatOptions = { ...options };

    if (typeof dateInput === 'number' && unix) {
        dateObj = new Date(dateInput * 1000);
    } else if (typeof dateInput === 'string' || dateInput instanceof Date) {
        dateObj = new Date(dateInput);
    } else {
        throw new Error('Invalid date input');
    }

    // Custom handling for different input formats
    switch (format) {
        case 'DD MMM YYYY':
            dateOptions.day = '2-digit';
            dateOptions.month = 'short';
            dateOptions.year = 'numeric';
            break;
        case 'MMM DD YYYY':
            dateOptions.day = '2-digit';
            dateOptions.month = 'short';
            dateOptions.year = 'numeric';
            return dateObj.toLocaleDateString('en-GB', dateOptions).replace(/(\d{2}) (\w{3}) (\d{4})/, '$2 $1 $3');
        default:
            dateOptions.year = 'numeric';
            dateOptions.month = '2-digit';
            dateOptions.day = '2-digit';
            break;
    }

    const formattedDate = dateObj
        .toLocaleDateString('en-GB', dateOptions)
        .replace(/(\d{2}) (\w{3,4}) (\d{4})/, (_, day, month, year) => `${day} ${month.slice(0, 3)} ${year}`);
    return format === 'DD MMM YYYY' || format === 'MMM DD YYYY'
        ? formattedDate
        : formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
};

/**
 * A utility function which returns a formatted time string.
 * @param dateInput the date object or string which needs to be converted/formatted.
 * @param unix (optional) if true, treats the input as a Unix timestamp.
 * @returns formatted time string in 'HH:mm:ss GMT' format.
 */
export const getFormattedTimeString = (dateInput: Date | number | string, unix = false): string => {
    let dateObj: Date;

    if (typeof dateInput === 'number' && unix) {
        dateObj = new Date(dateInput * 1000);
    } else if (typeof dateInput === 'string' || dateInput instanceof Date) {
        dateObj = new Date(dateInput);
    } else {
        throw new Error('Invalid date input');
    }

    // Utilize UTC methods to return time in GMT regardless of local timezone
    return `${dateObj.getUTCHours().toString().padStart(2, '0')}:${dateObj
        .getUTCMinutes()
        .toString()
        .padStart(2, '0')}:${dateObj.getUTCSeconds().toString().padStart(2, '0')} GMT`;
};

export const getAdjustedDate = (amount: number, type: 'days' | 'years') => {
    const date = new Date();
    if (type === 'years') {
        date.setFullYear(date.getFullYear() - amount);
    } else if (type === 'days') {
        date.setDate(date.getDate() + amount);
    }
    return date;
};

type TServerError = {
    code: string;
    details?: { [key: string]: string };
    fields?: string[];
    message: string;
};

export const isServerError = (error: unknown): error is TServerError =>
    typeof error === 'object' && error !== null && 'code' in error;

export const defineViewportHeight = () => {
    const viewportHeight = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--wallets-vh', `${viewportHeight}px`);
};
