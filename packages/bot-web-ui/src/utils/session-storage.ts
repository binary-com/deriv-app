import LZString from 'lz-string';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStoredItemsByUser = (storage_key: string, loginid?: string, default_value?: any) => {
    if (!loginid) {
        return default_value;
    }

    const storage = getStoredItemsByKey(storage_key, default_value);
    return storage[loginid] || default_value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStoredItemsByKey = (storage_key: string, default_value: any) => {
    try {
        const session_storage_item = sessionStorage.getItem(storage_key);
        const decompressed_item = LZString.decompress(session_storage_item);
        const stored_items = JSON.parse(decompressed_item);

        if (stored_items) {
            return stored_items;
        }
    } catch (e) {
        // Do nothing.
    }

    return default_value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setStoredItemsByKey = (storage_key: string, value: any) => {
    try {
        const compressed_value = LZString.compress(JSON.stringify(value));
        sessionStorage.setItem(storage_key, compressed_value);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Could not write to storage.');
    }
};
