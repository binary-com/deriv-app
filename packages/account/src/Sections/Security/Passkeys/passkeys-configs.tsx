import { MutableRefObject } from 'react';
import * as Yup from 'yup';
import { TSocketError } from '@deriv/api/types';
import { getOSNameWithUAParser } from '@deriv/shared';
import { URLConstants } from '@deriv-com/utils';
import { localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { TServerError } from '../../../Types';
import Cookies from 'js-cookie';

export const PASSKEY_STATUS_CODES = {
    CREATED: 'created',
    LEARN_MORE: 'learn_more',
    LIST: '',
    NO_PASSKEY: 'no_passkey',
    REMOVED: 'removed',
    RENAMING: 'renaming',
    VERIFYING: 'verifying',
} as const;

export type TPasskeysStatus = typeof PASSKEY_STATUS_CODES[keyof typeof PASSKEY_STATUS_CODES];

// TODO: fix types for TServerError and TSocketError
export type TPasskeyError =
    | TServerError
    | null
    | TSocketError<'passkeys_list' | 'passkeys_register' | 'passkeys_register_options'>;

export const getPasskeyRenameValidationSchema = () =>
    Yup.object().shape({
        passkey_name: Yup.string()
            .required('Only 3-30 characters allowed.')
            .min(3, localize('Only 3-30 characters allowed.'))
            .max(30, localize('Only 3-30 characters allowed.'))
            .matches(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, localize('Only letters, numbers, space, and hyphen are allowed.')),
    });

export const clearTimeOut = (timeout_ref: MutableRefObject<NodeJS.Timeout | null>) => {
    if (timeout_ref.current) clearTimeout(timeout_ref.current);
};

export const passkeysMenuActionEventTrack = (
    action: string,
    additional_data: { error_message?: string; subform_name?: string } = {}
) => {
    Analytics.trackEvent('ce_passkey_account_settings_form', {
        //@ts-expect-error [TODO] type not found in @deriv-analytics
        action,
        form_name: 'ce_passkey_account_settings_form',
        operating_system: getOSNameWithUAParser(),
        ...additional_data,
    });
};

export const setPasskeysStatusToCookie = (status: 'available' | 'not_available') => {
    let domain = /deriv.com/.test(window.location.hostname) ? URLConstants.derivHost : window.location.hostname;

    if (/deriv.dev/.test(window.location.hostname)) {
        //set domain for dev environment (FE deployment and login page on qa-box)
        domain = 'deriv.dev';
    }

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Set to expire in 1 year

    const is_available = status === 'available';

    Cookies.set('passkeys_available', String(is_available), {
        expires: expirationDate,
        path: '/',
        domain,
        secure: true,
        sameSite: 'None',
    });
};
