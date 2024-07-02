import { act } from '@testing-library/react';
import { otpRequestCountdown, validatePhoneNumber } from '../validation';
import dayjs from 'dayjs';

describe('validatePhoneNumber', () => {
    let setErrorMessage: jest.Mock, setTitleMock: jest.Mock, setTimerMock: jest.Mock, current_time: dayjs.Dayjs;

    beforeEach(() => {
        setErrorMessage = jest.fn();
        setTitleMock = jest.fn();
        setTimerMock = jest.fn();
        current_time = dayjs();
    });

    it('should set an empty error message for a valid phone number', async () => {
        const validPhoneNumber = '+1234567890';
        await act(async () => {
            validatePhoneNumber(validPhoneNumber, setErrorMessage);
        });
        expect(setErrorMessage).toHaveBeenCalledWith('');
    });

    it('should set an error message for an invalid phone number', async () => {
        const invalidPhoneNumber = 'invalid';
        await act(async () => {
            validatePhoneNumber(invalidPhoneNumber, setErrorMessage);
        });
        expect(setErrorMessage).toHaveBeenCalledWith(['Please enter a valid phone number.']);
    });

    it('should set an error message for an empty phone number', async () => {
        const invalidPhoneNumber = '';
        await act(async () => {
            validatePhoneNumber(invalidPhoneNumber, setErrorMessage);
        });
        expect(setErrorMessage).toHaveBeenCalledWith(['Please enter a valid phone number.']);
    });

    it('should set an error message for an phone number more than 36 characters', async () => {
        const invalidPhoneNumber = '+123123123123123123123123232333333333';
        await act(async () => {
            validatePhoneNumber(invalidPhoneNumber, setErrorMessage);
        });
        expect(setErrorMessage).toHaveBeenCalledWith(['Please enter a valid phone number.']);
    });

    it('should set an error message for an phone number less than 8 characters', async () => {
        const invalidPhoneNumber = '+1234567';
        await act(async () => {
            validatePhoneNumber(invalidPhoneNumber, setErrorMessage);
        });
        expect(setErrorMessage).toHaveBeenCalledWith(['Please enter a valid phone number.']);
    });

    it('should set an error message for phone number without including + sign', async () => {
        const invalidPhoneNumber = '0123456789';
        await act(async () => {
            validatePhoneNumber(invalidPhoneNumber, setErrorMessage);
        });
        expect(setErrorMessage).toHaveBeenCalledWith(['Please enter a valid phone number.']);
    });

    it('should set title and timer correctly if next_request is greater than 0', () => {
        const nextAttemptTimestamp = current_time.add(60, 'seconds').unix();

        otpRequestCountdown(nextAttemptTimestamp, setTitleMock, setTimerMock, current_time);

        expect(setTitleMock).toHaveBeenCalledWith(60);
        expect(setTimerMock).toHaveBeenCalledWith(60);
    });

    it('should not set title and timer if next_request is less than or equal to 0', () => {
        const nextAttemptTimestamp = current_time.subtract(60, 'seconds').unix();

        otpRequestCountdown(nextAttemptTimestamp, setTitleMock, setTimerMock, current_time);

        expect(setTitleMock).not.toHaveBeenCalled();
        expect(setTimerMock).not.toHaveBeenCalled();
    });
});
