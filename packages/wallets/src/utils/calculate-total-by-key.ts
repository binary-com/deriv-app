/**
 * Calculates the total of a specified key in an array of objects.
 *
 * The function handles numeric values, numeric strings, and ignores non-numeric strings.
 * It returns the total as a number.
 *
 * @template T - The type of the objects in the array.
 * @param {T[]} items - The array of objects to process.
 * @param {keyof T} key - The key whose values will be summed.
 * @returns {number} - The total of the specified key.
 */

export function calculateTotalByKey<T>(items: T[], key: keyof T): number {
    return items.reduce((acc, cur) => {
        let value = 0;
        const fieldValue = cur[key];
        if (typeof fieldValue === 'number') {
            value = fieldValue;
        } else if (typeof fieldValue === 'string') {
            const parsedValue = parseFloat(fieldValue);
            if (!isNaN(parsedValue)) {
                value = parsedValue;
            }
        }
        return acc + value;
    }, 0);
}
