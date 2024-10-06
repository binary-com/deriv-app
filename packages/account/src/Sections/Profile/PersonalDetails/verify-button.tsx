import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { GetSettings, ResidenceList, StatesList } from '@deriv/api-types';
import { Button } from '@deriv/components';
import { useIsPhoneNumberVerified, useSettings, useVerifyEmail } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTranslations, Localize } from '@deriv-com/translations';
import { makeSettingsRequest } from './validation';
import './verify-button.scss';

type TVerifyButton = {
    is_verify_button_disabled: boolean;
    next_email_otp_request_timer?: number;
    setStatus: (status: any) => void;
    values: GetSettings;
    residence_list: ResidenceList;
    states_list: StatesList;
};

export const VerifyButton = observer(
    ({
        is_verify_button_disabled,
        next_email_otp_request_timer,
        setStatus,
        values,
        residence_list,
        states_list,
    }: TVerifyButton) => {
        const { client, ui } = useStore();
        const { setShouldShowPhoneNumberOTP } = ui;
        const { setVerificationCode, is_authorize, is_virtual } = client;
        const { is_phone_number_verified } = useIsPhoneNumberVerified();
        const history = useHistory();
        const { localize } = useTranslations();
        const {
            refetch,
            mutation: { mutateAsync: updateSettings, isLoading: isSetSettingsLoading },
        } = useSettings();
        //@ts-expect-error remove this when phone_number_verification is added to api calls
        const { sendPhoneNumberVerifyEmail, WS, is_loading, error } = useVerifyEmail('phone_number_verification');
        const ref = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            if (is_authorize) refetch();
        }, [is_authorize, refetch]);

        useEffect(() => {
            if (WS.isSuccess) {
                history.push(routes.phone_verification);
            } else if (error) {
                //@ts-expect-error error message has issue with typing
                setStatus({ msg: error.message, code: error.code });
            }
        }, [WS.isSuccess, history, error]);

        const redirectToPhoneVerification = (e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();
            setVerificationCode('', 'phone_number_verification');
            setShouldShowPhoneNumberOTP(false);
            const request = makeSettingsRequest({ ...values }, residence_list, states_list, is_virtual);
            //@ts-expect-error GetSettings types doesn't match updated set_settings payload types
            updateSettings({ payload: request })
                .then(() => {
                    sendPhoneNumberVerifyEmail();
                })
                .catch(err => {
                    setStatus({ msg: err.message, code: err.code });
                });
        };

        const verifyTimer = () => {
            let resendCodeTimer = '';
            if (next_email_otp_request_timer) {
                next_email_otp_request_timer < 60
                    ? (resendCodeTimer = `${localize(' in ')}${next_email_otp_request_timer}s`)
                    : (resendCodeTimer = `${localize(' in ')}${Math.round(next_email_otp_request_timer / 60)}m`);
            } else {
                resendCodeTimer = '';
            }

            return resendCodeTimer;
        };

        return (
            <div ref={ref}>
                <Button
                    className='phone-verification-button'
                    is_disabled={
                        is_phone_number_verified ||
                        is_verify_button_disabled ||
                        isSetSettingsLoading ||
                        is_loading ||
                        !!next_email_otp_request_timer
                    }
                    onClick={redirectToPhoneVerification}
                    has_effect
                    green={is_phone_number_verified}
                    primary
                    large
                >
                    {is_phone_number_verified ? (
                        <Localize i18n_default_text='Verified' />
                    ) : (
                        <Localize
                            i18n_default_text='Verify{{resendCode}}'
                            values={{
                                resendCode: verifyTimer(),
                            }}
                        />
                    )}
                </Button>
            </div>
        );
    }
);
