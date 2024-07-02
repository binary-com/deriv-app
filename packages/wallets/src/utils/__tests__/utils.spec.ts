import { getFormattedDateString } from '../utils';
import '@testing-library/jest-dom';

describe('unixToDateString', () => {
    test('should convert current date to formatted string in default locale', () => {
        const currentDate = new Date();
        const formattedDate = getFormattedDateString(currentDate);
        const expectedDateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        expect(formattedDate).toBe(expectedDateString);
    });
});
