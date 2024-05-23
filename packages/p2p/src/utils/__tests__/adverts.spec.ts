import moment from 'moment';
import { toMoment } from '@deriv/shared';
import {
    generateErrorDialogBody,
    generateErrorDialogTitle,
    getEligibilityMessage,
    getLastOnlineLabel,
} from '../adverts';

let mock_value: moment.Moment = moment();
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    toMoment: jest.fn(() => mock_value),
}));

describe('generateErrorDialogBody', () => {
    it('should return "Please set a different minimum and/or maximum order limit" when error_code is "AdvertSameLimits"', () => {
        expect(generateErrorDialogBody('AdvertSameLimits')).toBe(
            'Please set a different minimum and/or maximum order limit. \n\nThe range of your ad should not overlap with any of your active ads.'
        );
    });
    it('should return "You already have an ad with the same exchange rate" when error_code is "DuplicateAdvert"', () => {
        expect(generateErrorDialogBody('DuplicateAdvert')).toBe(
            'You already have an ad with the same exchange rate for this currency pair and order type. \n\nPlease set a different rate for your ad.'
        );
    });
    it('should return the passed error_message when error_code is not "AdvertSameLimits" or "DuplicateAdvert"', () => {
        expect(generateErrorDialogBody('', 'this is the error message')).toBe('this is the error message');
    });
    it('should return "Something\'s not right" when error_code is not "AdvertSameLimits" or "DuplicateAdvert" and no error_message is passed', () => {
        expect(generateErrorDialogBody('')).toBe("Something's not right");
    });
});

describe('generateErrorDialogTitle', () => {
    it('should return "You already have an ad with this range" when error_code is "AdvertSameLimits"', () => {
        expect(generateErrorDialogTitle('AdvertSameLimits')).toBe('You already have an ad with this range');
    });
    it('should return "You already have an ad with this rate" when error_code is "DuplicateAdvert"', () => {
        expect(generateErrorDialogTitle('DuplicateAdvert')).toBe('You already have an ad with this rate');
    });
    it('should return "Something\'s not right" when error_code is not "AdvertSameLimits" or "DuplicateAdvert"', () => {
        expect(generateErrorDialogTitle('')).toBe("Something's not right");
    });
});

describe('getLastOnlineLabel', () => {
    const last_online_time = 1685446791;
    const is_online = 0;
    it('should return "Online" when last_online_time is not passed and user is online', () => {
        expect(getLastOnlineLabel(1)).toBe('Online');
    });
    it('should return "Seen n hours ago" when last seen is in hours', () => {
        mock_value = moment('2023-05-30T18:48:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        expect(getLastOnlineLabel(is_online, last_online_time)).toBe('Seen 3 hours ago');
    });
    it('should return "Seen 1 hour ago" when user was last seen 1 hour ago', () => {
        mock_value = moment('2023-05-30T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        expect(getLastOnlineLabel(is_online, last_online_time)).toBe('Seen 1 hour ago');
    });
    it('should return  "Seen more than 6 months ago" when user was last online more than 6 months ago', () => {
        mock_value = moment('2024-01-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        expect(getLastOnlineLabel(is_online, last_online_time)).toBe('Seen more than 6 months ago');
    });
    it('should return "Seen 1 month ago" when user was last online 1 month ago', () => {
        mock_value = moment('2023-07-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        expect(getLastOnlineLabel(is_online, last_online_time)).toBe('Seen 1 month ago');
    });
    it('should return "Seen 1 minute ago" when user was last online 1 minute ago', () => {
        mock_value = moment('2023-05-30T15:41:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        expect(getLastOnlineLabel(is_online, last_online_time)).toBe('Seen 1 minute ago');
    });
    it('should return "Seen n minutes ago" when last seen is in minutes', () => {
        mock_value = moment('2023-05-30T15:42:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        expect(getLastOnlineLabel(is_online, last_online_time)).toBe('Seen 2 minutes ago');
    });
    it('should return "Online" when last seen is in seconds', () => {
        mock_value = moment('2023-05-30T15:40:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        expect(getLastOnlineLabel(is_online, last_online_time)).toBe('Online');
    });
    it('should return "Seen n days ago" when last seen is in days', () => {
        mock_value = moment('2023-06-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        expect(getLastOnlineLabel(is_online, last_online_time)).toBe('Seen 3 days ago');
    });
    it('should return "Seen 1 day ago" when user was last online 1 day ago', () => {
        mock_value = moment('2023-05-31T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        expect(getLastOnlineLabel(is_online, last_online_time)).toBe('Seen 1 day ago');
    });
    it('should return "Seen more than 6 months ago" when last seen is in years', () => {
        mock_value = moment('2025-06-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        expect(getLastOnlineLabel(is_online, last_online_time)).toBe('Seen more than 6 months ago');
    });
    it('should return "Seen n months ago" when last seen is in months', () => {
        mock_value = moment('2023-11-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mock_value);
        expect(getLastOnlineLabel(is_online, last_online_time)).toBe('Seen 5 months ago');
    });
    it('should return "Seen more than 6 months ago" when user is not online and last seen is not known', () => {
        expect(getLastOnlineLabel(is_online)).toBe('Seen more than 6 months ago');
    });
});

describe('getEligibilityMessage', () => {
    it('should return "Your completion rate is too low for this ad." if eligibility statuses only contains completion_rate', () => {
        expect(getEligibilityMessage(['completion_rate'])).toBe('Your completion rate is too low for this ad.');
    });
    it('should return "You\'ve not used Deriv P2P long enough for this ad." if eligibility statuses only contains join_date', () => {
        expect(getEligibilityMessage(['join_date'])).toBe("You've not used Deriv P2P long enough for this ad.");
    });
    it('should return "The advertiser has set conditions for this ad that you don\'t meet." if eligibility statuses contains more than one reason', () => {
        expect(getEligibilityMessage(['completion_rate, join_date'])).toBe(
            "The advertiser has set conditions for this ad that you don't meet."
        );
    });
});
