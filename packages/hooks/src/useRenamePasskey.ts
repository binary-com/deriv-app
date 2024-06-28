import React from 'react';
import { useInvalidateQuery } from '@deriv/api';
import { mobileOSDetect, WS } from '@deriv/shared';
import { Analytics } from '@deriv-com/analytics';

type TError = { code?: string; name?: string; message: string };

const passkeyErrorEventTrack = (error: TError) => {
    Analytics.trackEvent('ce_passkey_account_settings_form', {
        action: 'error',
        form_name: 'ce_passkey_account_settings_form',
        operating_system: mobileOSDetect(),
        error_message: error?.message,
    });
};

const useRenamePasskey = () => {
    const invalidate = useInvalidateQuery();

    const [is_passkey_renamed, setIsPasskeyRenamed] = React.useState(false);
    const [passkey_renaming_error, setPasskeyRenamingError] = React.useState<TError | null>(null);

    const renamePasskey = async (passkey_id: number, new_passkey_name: string) => {
        try {
            setIsPasskeyRenamed(false);
            const passkeys_rename_response = await WS.send({
                passkeys_rename: 1,
                id: passkey_id,
                name: new_passkey_name,
            });
            if (passkeys_rename_response.passkeys_rename) {
                invalidate('passkeys_list');
                setIsPasskeyRenamed(true);
            } else if (passkeys_rename_response?.error) {
                setPasskeyRenamingError(passkeys_rename_response?.error);
                passkeyErrorEventTrack(passkeys_rename_response?.error);
            }
        } catch (e) {
            setPasskeyRenamingError(e as TError);
            passkeyErrorEventTrack(e as TError);
        }
    };

    return {
        renamePasskey,
        is_passkey_renamed,
        passkey_renaming_error,
    };
};

export default useRenamePasskey;
