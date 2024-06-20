import { sortArrayByKey } from '../sort-array-by-key';

describe('sortArrayByKey', () => {
    it('sorts objects by a specified string key in ascending order', () => {
        const items = [{ name: 'zebra' }, { name: 'apple' }, { name: 'mango' }];
        const sortedItems = sortArrayByKey(items, 'name');
        expect(sortedItems).toEqual([{ name: 'apple' }, { name: 'mango' }, { name: 'zebra' }]);
    });

    it('handles objects with missing values for the specified key', () => {
        const items = [{ name: 'banana' }, {}, { name: 'apple' }];
        const sortedItems = sortArrayByKey(items, 'name');
        expect(sortedItems).toEqual([{ name: 'apple' }, { name: 'banana' }, {}]);
    });

    it('does not modify the input array', () => {
        const items = [{ name: 'banana' }, { name: 'apple' }];
        const originalItems = [...items];
        sortArrayByKey(items, 'name');
        expect(items).toEqual(originalItems);
    });

    it('returns an empty array when given an empty array', () => {
        const items: { name?: string }[] = [];
        const sortedItems = sortArrayByKey(items, 'name');
        expect(sortedItems).toEqual([]);
    });

    it('handles objects with identical values for the specified key', () => {
        const items = [{ name: 'apple' }, { name: 'apple' }];
        const sortedItems = sortArrayByKey(items, 'name');
        expect(sortedItems).toEqual([{ name: 'apple' }, { name: 'apple' }]);
    });
});
