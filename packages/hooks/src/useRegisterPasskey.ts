import { useState } from 'react';
import { startRegistration } from '@simplewebauthn/browser';
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';
import { useInvalidateQuery } from '@deriv/api';
import { WS } from '@deriv/shared';

type TError = { code?: string; name?: string; message: string };

const useRegisterPasskey = ({ onSuccess }: { onSuccess: () => void }) => {
    const invalidate = useInvalidateQuery();

    const [passkey_registration_error, setPasskeyRegistrationError] = useState<TError | null>(null);
    const [public_key, setPublicKey] = useState<null | PublicKeyCredentialCreationOptionsJSON>(null);

    const startPasskeyRegistration = async () => {
        try {
            const passkeys_register_options_response = await WS.send({ passkeys_register_options: 1 });
            const public_key = passkeys_register_options_response?.passkeys_register_options?.publicKey;
            setPublicKey(public_key);
        } catch (e) {
            setPasskeyRegistrationError(e as TError);
        }
    };

    const createPasskey = async () => {
        try {
            if (public_key) {
                const authenticator_response = await startRegistration(public_key);
                const passkeys_register_response = await WS.send({
                    passkeys_register: 1,
                    publicKeyCredential: authenticator_response,
                });
                if (passkeys_register_response?.passkeys_register?.properties?.name) {
                    invalidate('passkeys_list');
                    onSuccess();
                } else if (passkeys_register_response?.error) {
                    setPasskeyRegistrationError(passkeys_register_response?.error);
                }
            }
        } catch (e) {
            setPasskeyRegistrationError(e as TError);
        } finally {
            setPublicKey(null);
        }
    };

    return {
        createPasskey,
        passkey_registration_error,
        startPasskeyRegistration,
    };
};

export default useRegisterPasskey;
