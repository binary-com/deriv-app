/* eslint-disable */
const extend = require('extend');

export const removeObjProperties = (property_arr: string[], { ...obj }) => {
    property_arr.forEach(property => delete obj[property]);
    return obj;
};

export const filterObjProperties = ({ ...obj }, property_arr: string[]) =>
    Object.fromEntries(
        Object.entries(obj)
            // eslint-disable-next-line no-unused-vars
            .filter(([key, _]) => property_arr.includes(key))
    );

export const isEmptyObject = (obj: any) => {
    let is_empty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) is_empty = false;
        });
    }
    return is_empty;
};

export const cloneObject = (obj: any) => (!isEmptyObject(obj) ? extend(true, Array.isArray(obj) ? [] : {}, obj) : obj);

// Note that this function breaks on objects with circular references.
export const isDeepEqual = (a: any, b: any) => {
    if (typeof a !== typeof b) {
        return false;
    } else if (Array.isArray(a)) {
        return isEqualArray(a, b);
    } else if (a && b && typeof a === 'object') {
        return isEqualObject(a, b);
    } else if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) {
        return true;
    }
    // else
    return a === b;
};

export const isEqualArray = (arr1: any[], arr2: any[]): boolean =>
    arr1 === arr2 || (arr1.length === arr2.length && arr1.every((value, idx) => isDeepEqual(value, arr2[idx])));

export const isEqualObject = (obj1: any, obj2: any): boolean =>
    obj1 === obj2 ||
    (Object.keys(obj1).length === Object.keys(obj2).length &&
        Object.keys(obj1).every(key => isDeepEqual(obj1[key], obj2[key])));

// Filters out duplicates in an array of objects by key
export const unique = (array: any[], key: string) =>
    array.filter((e, idx) => array.findIndex((a, i) => (a[key] ? a[key] === e[key] : i === idx)) === idx);

export const getPropertyValue = (obj: any, k: string | string[]): any => {
    let keys = k;
    if (!Array.isArray(keys)) keys = [keys];
    if (!isEmptyObject(obj) && keys[0] in obj && keys && keys.length > 1) {
        return getPropertyValue(obj[keys[0]], keys.slice(1));
    }
    // else return clone of object to avoid overwriting data
    return obj ? cloneObject(obj[keys[0]]) : undefined;
};

export const removeEmptyPropertiesFromObject = (obj: any) => {
    const clone = { ...obj };

    Object.getOwnPropertyNames(obj).forEach(key => {
        if ([undefined, null, ''].includes(obj[key])) {
            delete clone[key];
        }
    });

    return clone;
};

export const sequence = (n: number) => Array.from(Array(n).keys());

export const pick = (source: any, fields: any) => {
    return fields.reduce((target: any, prop: any) => {
        if (Object.prototype.hasOwnProperty.call(source, prop)) target[prop] = source[prop];
        return target;
    }, {});
};

export const findValueByKeyRecursively = (obj: any, key: string) => {
    let return_value;

    Object.keys(obj).some(obj_key => {
        const value = obj[obj_key];

        if (obj_key === key) {
            return_value = obj[key];
            return true;
        }

        if (typeof value === 'object') {
            const nested_value = findValueByKeyRecursively(value, key);

            if (nested_value) {
                return_value = nested_value;
                return true;
            }
        }

        return false;
    });

    return return_value;
};

// Recursively freeze an object (deep freeze)
export const deepFreeze = (obj: any) => {
    Object.getOwnPropertyNames(obj).forEach(key => {
        const value = obj[key];
        if (value && typeof value === 'object' && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    });
    return Object.freeze(obj);
};

export const deepCopy = (value: any) => {
    if (Array.isArray(value)) {
        const count = value.length;
        const arr = new Array(count);
        for (let i = 0; i < count; i++) {
            arr[i] = deepCopy(value[i]);
        }

        return arr;
    } else if (typeof value === 'object') {
        const obj: { [key: string]: any } = {};
        for (let prop in value) {
            obj[prop] = deepCopy(value[prop]);
        }

        return obj;
    } else {
        // Primitive value
        return value;
    }
};
