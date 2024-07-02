import { useState } from 'react';
import { startAuthentication } from '@simplewebauthn/browser';
import { useInvalidateQuery } from '@deriv/api';
import { WS } from '@deriv/shared';

type TError = { code?: string; name?: string; message: string };

const useRemovePasskey = ({ onSuccess }: { onSuccess: () => void }) => {
    const invalidate = useInvalidateQuery();

    const [passkey_removing_error, setPasskeyRemovingError] = useState<TError | null>(null);

    const removePasskey = async (id: number, passkey_id: string) => {
        try {
            const passkey_options_response = await WS.send({
                passkeys_options: 1,
                passkey_id,
            });
            const public_key = passkey_options_response.passkeys_options.publicKey;
            const authenticator_response = await startAuthentication(public_key);

            const passkeys_revoke_response = await WS.send({
                passkeys_revoke: 1,
                id,
                publicKeyCredential: authenticator_response,
            });

            if (passkeys_revoke_response.passkeys_revoke) {
                invalidate('passkeys_list');
                onSuccess();
            } else if (passkeys_revoke_response.error) {
                setPasskeyRemovingError(passkeys_revoke_response.error);
            }
        } catch (e) {
            setPasskeyRemovingError(e as TError);
        }
    };

    return {
        removePasskey,
        passkey_removing_error,
    };
};

export default useRemovePasskey;
