import { act } from '@testing-library/react';
import { validatePhoneNumber } from '../validation';

describe('validatePhoneNumber', () => {
    const setErrorMessage = jest.fn();
    const setIsDisabledRequestButton = jest.fn();

    const error_message = 'Enter a valid phone number.';

    it('should set an empty error message for a valid phone number', async () => {
        const validPhoneNumber = '+1234567890';
        await act(async () => {
            validatePhoneNumber(validPhoneNumber, setErrorMessage, setIsDisabledRequestButton);
        });
        expect(setErrorMessage).toHaveBeenCalledWith('');
    });

    it('should set an error message for an invalid phone number', async () => {
        const invalidPhoneNumber = 'invalid';
        await act(async () => {
            validatePhoneNumber(invalidPhoneNumber, setErrorMessage, setIsDisabledRequestButton);
        });
        expect(setErrorMessage).toHaveBeenCalledWith([error_message]);
    });

    it('should set an error message for an empty phone number', async () => {
        const invalidPhoneNumber = '';
        await act(async () => {
            validatePhoneNumber(invalidPhoneNumber, setErrorMessage, setIsDisabledRequestButton);
        });
        expect(setErrorMessage).toHaveBeenCalledWith([error_message]);
    });

    it('should set an error message for an phone number more than 36 characters', async () => {
        const invalidPhoneNumber = '+123123123123123123123123232333333333';
        await act(async () => {
            validatePhoneNumber(invalidPhoneNumber, setErrorMessage, setIsDisabledRequestButton);
        });
        expect(setErrorMessage).toHaveBeenCalledWith([error_message]);
    });

    it('should set an error message for an phone number less than 8 characters', async () => {
        const invalidPhoneNumber = '+1234567';
        await act(async () => {
            validatePhoneNumber(invalidPhoneNumber, setErrorMessage, setIsDisabledRequestButton);
        });
        expect(setErrorMessage).toHaveBeenCalledWith([error_message]);
    });

    it('should set an error message for phone number without including + sign', async () => {
        const invalidPhoneNumber = '0123456789';
        await act(async () => {
            validatePhoneNumber(invalidPhoneNumber, setErrorMessage, setIsDisabledRequestButton);
        });
        expect(setErrorMessage).toHaveBeenCalledWith([error_message]);
    });
});
