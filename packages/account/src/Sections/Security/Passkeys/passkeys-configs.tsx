import React from 'react';
import { Localize } from '@deriv/translations';
import { mobileOSDetect } from '@deriv/shared';
import { DescriptionContainer } from './components/description-container';
import { TipsBlock } from './components/tips-block';
import { TServerError } from '../../../Types/common.type';

export const PASSKEY_STATUS_CODES = {
    CREATED: 'created',
    LEARN_MORE: 'learn_more',
    NONE: '',
    NO_PASSKEY: 'no_passkey',
    REMOVED: 'removed',
    RENAMING: 'renaming',
    VERIFYING: 'verifying',
} as const;

export type TPasskeysStatus = typeof PASSKEY_STATUS_CODES[keyof typeof PASSKEY_STATUS_CODES];

export const getStatusContent = (status: Exclude<TPasskeysStatus, ''>) => {
    const learn_more_button_text = <Localize i18n_default_text='Learn more' />;
    const create_passkey_button_text = <Localize i18n_default_text='Create passkey' />;
    const continue_button_text = <Localize i18n_default_text='Continue' />;

    const getPasskeysRemovedDescription = () => {
        const os_type = mobileOSDetect();

        switch (os_type) {
            case 'Android':
                return (
                    <Localize i18n_default_text='Your passkey is successfully removed. To avoid sign-in prompts, also remove the passkey from your Google password manager. ' />
                );
            case 'iOS':
                return (
                    <Localize i18n_default_text='Your passkey is successfully removed. To avoid sign-in prompts, also remove the passkey from your iCloud keychain. ' />
                );
            default:
                return (
                    <Localize i18n_default_text='Your passkey is successfully removed. To avoid sign-in prompts, also remove the passkey from your password manager. ' />
                );
        }
    };

    const titles = {
        created: <Localize i18n_default_text='Success!' />,
        learn_more: <Localize i18n_default_text='Passwordless login with passkeys' />,
        no_passkey: <Localize i18n_default_text='Experience safer logins' />,
        removed: <Localize i18n_default_text='Passkey successfully removed' />,
        renaming: <Localize i18n_default_text='Edit passkey' />,
        verifying: <Localize i18n_default_text='Verify your request' />,
    };
    const descriptions = {
        created: (
            <Localize
                i18n_default_text='Your account is now secured with a passkey.<0/>Manage your passkey through your Deriv account settings.'
                components={[<br key={0} />]}
            />
        ),
        learn_more: (
            <React.Fragment>
                <DescriptionContainer />
                <TipsBlock />
            </React.Fragment>
        ),
        no_passkey: (
            <Localize
                i18n_default_text='To enhance your security,<0/>tap ‘Create passkey’ below.'
                components={[<br key={0} />]}
            />
        ),
        removed: getPasskeysRemovedDescription(),
        renaming: '',
        verifying: (
            <Localize i18n_default_text="We'll send you a secure link to verify your request. Tap on it to confirm you want to remove the passkey. This protects your account from unauthorised requests." />
        ),
    };
    const icons = {
        created: 'IcSuccessPasskey',
        learn_more: 'IcInfoPasskey',
        no_passkey: 'IcAddPasskey',
        removed: 'IcSuccessPasskey',
        renaming: 'IcEditPasskey',
        verifying: 'IcVerifyPasskey',
    };
    const button_texts = {
        created: continue_button_text,
        learn_more: create_passkey_button_text,
        no_passkey: create_passkey_button_text,
        removed: continue_button_text,
        renaming: <Localize i18n_default_text='Save changes' />,
        verifying: <Localize i18n_default_text='Send email' />,
    };
    const back_button_texts = {
        created: undefined,
        learn_more: undefined,
        no_passkey: learn_more_button_text,
        removed: undefined,
        renaming: <Localize i18n_default_text='Back' />,
        verifying: undefined,
    };

    return {
        title: titles[status],
        description: descriptions[status],
        icon: icons[status],
        primary_button_text: button_texts[status],
        secondary_button_text: back_button_texts[status],
    };
};

export const getErrorContent = (error_message: string | null | TServerError) => {
    const is_not_allowed_error = typeof error_message === 'string' ? error_message.includes('NotAllowedError') : false;

    const passkey_error_message = typeof error_message === 'string' ? error_message : error_message?.message;

    const try_again_button_text = <Localize i18n_default_text='Try again' />;

    if (is_not_allowed_error) {
        return {
            description: (
                <Localize i18n_default_text='We encountered an issue while setting up your passkey. The process might have been interrupted or the session timed out. Please try again.' />
            ),
            button_text: try_again_button_text,
        };
    }

    return {
        description: passkey_error_message ?? '',
        button_text: try_again_button_text,
    };
};
