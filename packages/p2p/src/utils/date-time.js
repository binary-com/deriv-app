export const getFormattedDateString = (date_obj) => {
    if (!(date_obj instanceof Date)) throw Error('getFormattedDateString argument needs an instance of Date');

    const [, day, month, year, time] = date_obj.toUTCString().split(' ');

    // Return in the format "DD MMM YYYY HH:mm:ss". e.g.: "01 Jan 1970 21:01:02"
    return `${day} ${month} ${year} ${time}`;
};

export const millisecondsToTimer = (milliseconds) => {
    const length = 2;
    const pad = '0';

    return `${ (new Array(length + 1).join(pad) + ((milliseconds / 60) / 1000)).slice(-length) }:${ (new Array(length + 1).join(pad) + (milliseconds / 1000)).slice(-length) }`;
};
