import { useState } from 'react';
import { useInvalidateQuery } from '@deriv/api';
import { WS } from '@deriv/shared';

type TError = { code?: string; name?: string; message: string };

const useRenamePasskey = ({ onSuccess }: { onSuccess: () => void }) => {
    const invalidate = useInvalidateQuery();

    const [passkey_renaming_error, setPasskeyRenamingError] = useState<TError | null>(null);

    const renamePasskey = async (passkey_id: number, new_passkey_name = '') => {
        try {
            const passkeys_rename_response = await WS.send({
                passkeys_rename: 1,
                id: passkey_id,
                name: new_passkey_name,
            });
            if (passkeys_rename_response.passkeys_rename) {
                invalidate('passkeys_list');
                onSuccess();
            } else if (passkeys_rename_response?.error) {
                setPasskeyRenamingError(passkeys_rename_response?.error);
            }
        } catch (e) {
            setPasskeyRenamingError(e as TError);
        }
    };

    return {
        renamePasskey,
        passkey_renaming_error,
    };
};

export default useRenamePasskey;
