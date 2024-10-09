import { useState } from 'react';
import { startAuthentication } from '@simplewebauthn/browser';
import { WS } from '@deriv/shared';

type TError = { code?: string; name?: string; message: string };

const useRemovePasskey = ({ onSuccess }: { onSuccess: () => void }) => {
    const [passkey_removing_error, setPasskeyRemovingError] = useState<TError | null>(null);
    const [is_removing_in_progress, setIsRemovingInProgress] = useState(false);

    const removePasskey = async (id: number, passkey_id: string) => {
        setIsRemovingInProgress(true);
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
                onSuccess();
            } else if (passkeys_revoke_response.error) {
                setPasskeyRemovingError(passkeys_revoke_response.error);
            }
        } catch (e) {
            setPasskeyRemovingError(e as TError);
        } finally {
            setIsRemovingInProgress(false);
        }
    };

    const removePasskeyWithEmailCode = async (id: number, email_code: number) => {
        setIsRemovingInProgress(true);
        try {
            const passkeys_revoke_with_email_code_response = await WS.send({
                // TODO: clarify the endpoint with BE
                // passkeys_revoke_with_email: 1,
                // email_code,
                passkeys_revoke: 1,
                id,
            });

            if (passkeys_revoke_with_email_code_response.passkeys_revoke) {
                onSuccess();
            } else if (passkeys_revoke_with_email_code_response.error) {
                setPasskeyRemovingError(passkeys_revoke_with_email_code_response.error);
            }
        } catch (e) {
            setPasskeyRemovingError(e as TError);
        } finally {
            setIsRemovingInProgress(false);
        }
    };

    return {
        removePasskey,
        removePasskeyWithEmailCode,
        passkey_removing_error,
        is_removing_in_progress,
    };
};

export default useRemovePasskey;
