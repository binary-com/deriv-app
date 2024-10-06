import { useStore } from '@deriv/stores';

const useIsPhoneNumberVerified = () => {
    const { client } = useStore();
    const { account_settings } = client;
    const { phone_number_verification } = account_settings;
    const is_phone_number_verified = !!phone_number_verification?.verified;

    return {
        is_phone_number_verified,
    };
};

export default useIsPhoneNumberVerified;
