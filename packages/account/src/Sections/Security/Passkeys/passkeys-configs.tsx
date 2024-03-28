import React from 'react';
import { Text } from '@deriv/components';
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
        learn_more: <Localize i18n_default_text='Effortless login with passkeys' />,
        no_passkey: <Localize i18n_default_text='Experience safer logins' />,
        removed: <Localize i18n_default_text='Passkey successfully removed' />,
        renaming: <Localize i18n_default_text='Edit passkey' />,
        verifying: <Localize i18n_default_text='Verify your request' />,
    };
    const descriptions = {
        created: (
            <Localize
                i18n_default_text='Your account is now secured with a passkey.<0/>Manage your passkey through your<0/>Deriv account settings.'
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
                i18n_default_text='Enhanced security is just a tap away.<0/>Hit <1>Learn more</1> to explore passkeys or <1>Create passkey</1> to get started.'
                components={[<br key={0} />, <strong key={1} />]}
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

type TGetModalContent = { error: TServerError | null; is_passkey_registration_started: boolean };

export const getModalContent = ({ error, is_passkey_registration_started }: TGetModalContent) => {
    if (is_passkey_registration_started) {
        return {
            description: (
                <Localize i18n_default_text='Make sure the screen lock and Bluetooth on your device are active and you are signed in to your Google or iCloud account.' />
            ),
            button_text: <Localize i18n_default_text='Continue' />,
            header: (
                <Text size='xs' weight='bold'>
                    <Localize i18n_default_text='Just a reminder' />
                </Text>
            ),
        };
    }

    return {
        description: error?.message ?? '',
        button_text: error ? <Localize i18n_default_text='Try again' /> : undefined,
    };
};
