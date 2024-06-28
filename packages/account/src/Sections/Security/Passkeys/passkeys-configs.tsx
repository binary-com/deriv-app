import React from 'react';
import * as Yup from 'yup';
import { TSocketError } from '@deriv/api/types';
import { getOSNameWithUAParser } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Analytics, TEvents } from '@deriv-com/analytics';
import { TServerError } from '../../../Types';

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

export const clearTimeOut = (timeout_ref: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (timeout_ref.current) clearTimeout(timeout_ref.current);
};

export const passkeysMenuActionEventTrack = (
    action: TEvents['ce_passkey_account_settings_form']['action'],
    additional_data: { error_message?: string; subform_name?: string } = {}
) => {
    Analytics.trackEvent('ce_passkey_account_settings_form', {
        action,
        form_name: 'ce_passkey_account_settings_form',
        operating_system: getOSNameWithUAParser(),
        ...additional_data,
    });
};
