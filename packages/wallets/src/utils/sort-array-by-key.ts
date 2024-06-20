/**
 * Sorts an array of objects by a specified key in ascending order.
 *
 * @template T
 * @param {T[]} arr - The array of objects to be sorted.
 * @param {keyof T} key - The key by which to sort the objects.
 * @returns {T[]} - The sorted array of objects.
 */
export function sortArrayByKey<T>(arr: T[], key: keyof T): T[] {
    const copiedArray = [...arr];
    return copiedArray.sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];

        if (valueA !== undefined && valueB !== undefined) {
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return valueA.localeCompare(valueB);
            }
        } else if (valueA === undefined) {
            return 1;
        } else if (valueB === undefined) {
            return -1;
        }
        return 0;
    });
}
