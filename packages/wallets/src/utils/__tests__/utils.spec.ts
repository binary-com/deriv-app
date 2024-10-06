import {
    defineViewportHeight,
    getAdjustedDate,
    getFormattedDateString,
    getFormattedTimeString,
    isServerError,
} from '../utils';
import '@testing-library/jest-dom';

describe('Wallets Utils', () => {
    describe('getFormattedDateString', () => {
        test('converts current date to formatted string in default format', () => {
            const currentDate = new Date('2023-05-15T12:00:00Z');
            const formattedDate = getFormattedDateString(currentDate);
            expect(formattedDate).toBe('2023-05-15');
        });

        test('formats date string in "DD MMM YYYY" format', () => {
            const dateString = '2023-05-15T12:00:00Z';
            const formattedDate = getFormattedDateString(dateString, undefined, 'DD MMM YYYY');
            expect(formattedDate).toBe('15 May 2023');
        });

        test('formats date string in "MMM DD YYYY" format', () => {
            const dateString = '2023-05-15T12:00:00Z';
            const formattedDate = getFormattedDateString(dateString, undefined, 'MMM DD YYYY');
            expect(formattedDate).toBe('May 15 2023');
        });

        test('handles Unix timestamp', () => {
            const unixTimestamp = 1684152000; // 2023-05-15T12:00:00Z
            const formattedDate = getFormattedDateString(unixTimestamp, undefined, 'YYYY-MM-DD', true);
            expect(formattedDate).toBe('2023-05-15');
        });

        test('throws error for invalid input', () => {
            expect(() => getFormattedDateString({} as Date)).toThrow('Invalid date input');
        });
    });

    describe('getFormattedTimeString', () => {
        beforeAll(() => {
            jest.useFakeTimers('modern');
            jest.setSystemTime(new Date('2024-09-01T12:30:45Z'));
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        test('converts current date to formatted time string', () => {
            const currentDate = new Date('2024-09-01T12:30:45Z');
            const formattedTime = getFormattedTimeString(currentDate);
            expect(formattedTime).toBe('12:30:45 GMT');
        });

        test('handles Unix timestamp', () => {
            const date = new Date('2024-09-01T12:30:45Z');
            const unixTimestamp = Math.floor(date.getTime() / 1000);

            const formattedTime = getFormattedTimeString(unixTimestamp, true);
            expect(formattedTime).toBe('12:30:45 GMT');
        });

        test('throws error for invalid input', () => {
            expect(() => getFormattedTimeString({} as Date)).toThrow('Invalid date input');
        });
    });

    describe('getAdjustedDate', () => {
        test('adjusts date by days', () => {
            const adjustedDate = getAdjustedDate(5, 'days');
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() + 5);
            expect(adjustedDate.toDateString()).toBe(expectedDate.toDateString());
        });

        test('adjusts date by years', () => {
            const adjustedDate = getAdjustedDate(2, 'years');
            const expectedDate = new Date();
            expectedDate.setFullYear(expectedDate.getFullYear() - 2);
            expect(adjustedDate.toDateString()).toBe(expectedDate.toDateString());
        });
    });

    describe('isServerError', () => {
        test('returns true for valid server error object', () => {
            const error = { code: '123', message: 'Error message' };
            expect(isServerError(error)).toBe(true);
        });

        test('returns false for non-object input', () => {
            expect(isServerError('string')).toBe(false);
            expect(isServerError(123)).toBe(false);
            expect(isServerError(null)).toBe(false);
        });

        test('returns false for object without code property', () => {
            expect(isServerError({ message: 'Error message' })).toBe(false);
        });
    });

    describe('defineViewportHeight', () => {
        const originalInnerHeight = window.innerHeight;
        const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;

        beforeEach(() => {
            Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000, writable: true });
            CSSStyleDeclaration.prototype.setProperty = jest.fn();
        });

        afterEach(() => {
            window.innerHeight = originalInnerHeight;
            CSSStyleDeclaration.prototype.setProperty = originalSetProperty;
        });

        test('sets --wallets-vh property', () => {
            defineViewportHeight();
            expect(CSSStyleDeclaration.prototype.setProperty).toHaveBeenCalledWith('--wallets-vh', '10px');
        });
    });
});
