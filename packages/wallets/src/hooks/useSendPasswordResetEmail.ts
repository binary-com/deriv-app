import { useCallback } from 'react';
import { useActiveWalletAccount, useSettings, useVerifyEmail } from '@deriv/api-v2';
import { PlatformDetails } from '../features/cfd/constants';
import { TPlatforms } from '../types';
import { platformPasswordResetRedirectLink } from '../utils/cfd';

type TSendEmailPayload = {
    isInvestorPassword?: boolean;
    platform?: TPlatforms.All;
};

/**
 * @description This hook is used to send a password reset email to the user. It handles MT5, DXTrade, and Investor password reset.
 * @returns {Object} sendEmail - A function that sends a password reset email to the user.
 */
const useSendPasswordResetEmail = () => {
    const { data } = useSettings();
    const { mutate: verifyEmail, ...rest } = useVerifyEmail();
    const { data: activeWallet } = useActiveWalletAccount();

    const sendEmail = useCallback(
        ({ isInvestorPassword = false, platform }: TSendEmailPayload) => {
            const mt5ResetType = isInvestorPassword
                ? 'trading_platform_investor_password_reset'
                : 'trading_platform_mt5_password_reset';
            const mt5Platform = PlatformDetails.mt5.platform;

            if (data?.email) {
                verifyEmail({
                    type: platform === mt5Platform ? mt5ResetType : 'trading_platform_dxtrade_password_reset',
                    url_parameters: {
                        redirect_to: platformPasswordResetRedirectLink(
                            platform ?? mt5Platform,
                            activeWallet?.is_virtual
                        ),
                    },
                    verify_email: data?.email,
                });
            }
        },
        [activeWallet?.is_virtual, data?.email, verifyEmail]
    );

    return {
        sendEmail,
        ...rest,
    };
};

export default useSendPasswordResetEmail;
