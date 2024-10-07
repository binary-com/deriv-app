import Cookies from 'js-cookie';
import { deriv_urls } from '../url/constants';
import { getPropertyValue, isEmptyObject } from '../object/object';

type TCookieStorageThis = {
    initialized: boolean;
    cookie_name: string;
    domain: string;
    path: string;
    expires: Date;
    value: unknown;
};

const getObject = function (this: { getItem: (key: string) => string | null }, key: string) {
    return JSON.parse(this.getItem(key) || '{}');
};

const setObject = function (this: { setItem: (key: string, value: string) => void }, key: string, value: unknown) {
    if (value && value instanceof Object) {
        try {
            this.setItem(key, JSON.stringify(value));
        } catch (e) {
            /* do nothing */
        }
    }
};

if (typeof Storage !== 'undefined') {
    Storage.prototype.getObject = getObject;
    Storage.prototype.setObject = setObject;
}

export const isStorageSupported = (storage: Storage) => {
    if (typeof storage === 'undefined') {
        return false;
    }

    const test_key = 'test';
    try {
        storage.setItem(test_key, '1');
        storage.removeItem(test_key);
        return true;
    } catch (e) {
        return false;
    }
};

const Store = function (this: { storage: Storage }, storage: Storage) {
    this.storage = storage;
    this.storage.getObject = getObject;
    this.storage.setObject = setObject;
};

Store.prototype = {
    get(key: string) {
        return this.storage.getItem(key) || undefined;
    },
    set(key: string, value: string) {
        if (typeof value !== 'undefined') {
            this.storage.setItem(key, value);
        }
    },
    getObject(key: string) {
        return typeof this.storage.getObject === 'function' // Prevent runtime error in IE
            ? this.storage.getObject(key)
            : JSON.parse(this.storage.getItem(key) || '{}');
    },
    setObject(key: string, value: unknown) {
        if (typeof this.storage.setObject === 'function') {
            // Prevent runtime error in IE
            this.storage.setObject(key, value);
        } else {
            this.storage.setItem(key, JSON.stringify(value));
        }
    },
    remove(key: string) {
        this.storage.removeItem(key);
    },
    clear() {
        this.storage.clear();
    },
};

const InScriptStore = function (this: { store: unknown }, object?: unknown) {
    this.store = typeof object !== 'undefined' ? object : {};
};

InScriptStore.prototype = {
    get(key: string) {
        return getPropertyValue(this.store, key);
    },
    set(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this: { store: any; set: (key: string | string[], value: string, obj: string[]) => void },
        k: string | string[],
        value: string,
        obj = this.store
    ) {
        let key = k;
        if (!Array.isArray(key)) key = [key];
        if (key.length > 1) {
            if (!(key[0] in obj) || isEmptyObject(obj[key[0]])) obj[key[0]] = {};
            this.set(key.slice(1), value, obj[key[0]]);
        } else {
            obj[key[0]] = value;
        }
    },
    getObject(key: string) {
        return JSON.parse(this.get(key) || '{}');
    },
    setObject(key: string, value: unknown) {
        this.set(key, JSON.stringify(value));
    },
    remove(...keys: string[]) {
        keys.forEach(key => {
            delete this.store[key];
        });
    },
    clear() {
        this.store = {};
    },
    has(key: string) {
        return this.get(key) !== undefined;
    },
    keys() {
        return Object.keys(this.store);
    },
    call(key: string) {
        if (typeof this.get(key) === 'function') this.get(key)();
    },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const State = new (InScriptStore as any)();
State.prototype = InScriptStore.prototype;
/**
 * Shorthand function to get values from response object of State
 *
 * @param {String} pathname
 *     e.g. getResponse('authorize.currency') == get(['response', 'authorize', 'authorize', 'currency'])
 */
State.prototype.getResponse = function (pathname: string | string[]) {
    let path = pathname;
    if (typeof path === 'string') {
        const keys = path.split('.');
        path = ['response', keys[0]].concat(keys);
    }
    return this.get(path);
};
State.prototype.getByMsgType = State.getResponse;
State.set('response', {});

export const CookieStorage = function (this: TCookieStorageThis, cookie_name: string, cookie_domain?: string) {
    const hostname = window.location.hostname;

    this.initialized = false;
    this.cookie_name = cookie_name;
    this.domain =
        cookie_domain ||
        /* eslint-disable no-nested-ternary */
        (hostname.includes('binary.sx') ? 'binary.sx' : deriv_urls.DERIV_HOST_NAME);
    /* eslint-enable no-nested-ternary */
    this.path = '/';
    this.expires = new Date('Thu, 1 Jan 2037 12:00:00 GMT');
    this.value = {};
};

CookieStorage.prototype = {
    read() {
        const cookie_value = Cookies.get(this.cookie_name);
        try {
            this.value = cookie_value ? JSON.parse(cookie_value) : {};
        } catch (e) {
            this.value = {};
        }
        this.initialized = true;
    },
    write(val: string, expireDate: Date, isSecure: boolean) {
        if (!this.initialized) this.read();
        this.value = val;
        if (expireDate) this.expires = expireDate;
        Cookies.set(this.cookie_name, this.value, {
            expires: this.expires,
            path: this.path,
            domain: this.domain,
            secure: !!isSecure,
        });
    },
    get(key: string) {
        if (!this.initialized) this.read();
        return this.value[key];
    },
    set(key: string, val: string) {
        if (!this.initialized) this.read();
        this.value[key] = val;
        Cookies.set(this.cookie_name, this.value, {
            expires: new Date(this.expires),
            path: this.path,
            domain: this.domain,
        });
    },
    remove() {
        Cookies.remove(this.cookie_name, {
            path: this.path,
            domain: this.domain,
        });
    },
};

export const removeCookies = (...cookie_names: string[]) => {
    const domains = [`.${document.domain.split('.').slice(-2).join('.')}`, `.${document.domain}`];

    let parent_path = window.location.pathname.split('/', 2)[1];
    if (parent_path !== '') {
        parent_path = `/${parent_path}`;
    }

    cookie_names.forEach(c => {
        Cookies.remove(c, { path: '/', domain: domains[0] });
        Cookies.remove(c, { path: '/', domain: domains[1] });
        Cookies.remove(c);
        if (new RegExp(c).test(document.cookie) && parent_path) {
            Cookies.remove(c, { path: parent_path, domain: domains[0] });
            Cookies.remove(c, { path: parent_path, domain: domains[1] });
            Cookies.remove(c, { path: parent_path });
        }
    });
};

export const LocalStore = isStorageSupported(window.localStorage)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (Store as any)(window.localStorage)
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (InScriptStore as any)();
export const SessionStore = isStorageSupported(window.sessionStorage)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (Store as any)(window.sessionStorage)
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (InScriptStore as any)();
