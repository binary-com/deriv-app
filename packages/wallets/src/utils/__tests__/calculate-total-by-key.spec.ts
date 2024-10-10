import { calculateTotalByKey } from '../calculate-total-by-key';

describe('calculateTotalByKey', () => {
    type TestObject = {
        anotherField?: number | string | null;
        numericField?: number | string | null;
    };

    it('should return the correct total for numeric values', () => {
        const items: TestObject[] = [
            { numericField: 100 },
            { numericField: 200.5 },
            { numericField: null },
            { numericField: 50 },
        ];
        expect(calculateTotalByKey(items, 'numericField')).toBe(350.5);
    });

    it('should return the correct total for string values', () => {
        const items: TestObject[] = [
            { numericField: '100' },
            { numericField: '200.50' },
            { numericField: null },
            { numericField: '50' },
        ];
        expect(calculateTotalByKey(items, 'numericField')).toBe(350.5);
    });

    it('should return the correct total for mixed numeric and string values', () => {
        const items: TestObject[] = [
            { numericField: 100 },
            { numericField: '200.50' },
            { numericField: null },
            { numericField: '50' },
        ];
        expect(calculateTotalByKey(items, 'numericField')).toBe(350.5);
    });

    it('should return 0.00 for all null or undefined values', () => {
        const items: TestObject[] = [{ numericField: null }, { numericField: undefined }, { numericField: null }];
        expect(calculateTotalByKey(items, 'numericField')).toBe(0);
    });

    it('should return 0.00 for empty array', () => {
        const items: TestObject[] = [];
        expect(calculateTotalByKey(items, 'numericField')).toBe(0);
    });

    it('should ignore non-numeric string values', () => {
        const items: TestObject[] = [{ numericField: 'abc' }, { numericField: '200.50' }, { numericField: 'def' }];
        expect(calculateTotalByKey(items, 'numericField')).toBe(200.5);
    });

    it('should handle different keys correctly', () => {
        const items: TestObject[] = [
            { anotherField: '50.25', numericField: 100 },
            { anotherField: 100, numericField: '200.50' },
            { anotherField: '150.75', numericField: null },
        ];
        expect(calculateTotalByKey(items, 'numericField')).toBe(300.5);
        expect(calculateTotalByKey(items, 'anotherField')).toBe(301);
    });

    it('should handle objects with missing keys', () => {
        const items: TestObject[] = [{ anotherField: '50.25' }, { numericField: '200.50' }, { anotherField: '150.75' }];
        expect(calculateTotalByKey(items, 'numericField')).toBe(200.5);
        expect(calculateTotalByKey(items, 'anotherField')).toBe(201);
    });
});
