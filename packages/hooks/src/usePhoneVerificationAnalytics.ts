import { Analytics, TEvents } from '@deriv-com/analytics';
import { useCallback } from 'react';

type TTrackPhoneVerificationEventsPayload = {
    //@ts-expect-error will remove this error when Analytics package types are being updated
    action: TEvents['ce_phone_verification_form']['action'];
    cta_name?: string;
    subform_name?: string;
};

const usePhoneVerificationAnalytics = () => {
    const trackPhoneVerificationEvents = useCallback(
        (payload: TTrackPhoneVerificationEventsPayload) =>
            //@ts-expect-error will remove this error when Analytics package types are being updated
            Analytics.trackEvent('ce_phone_verification_form', { form_name: 'ce_phone_verification_form', ...payload }),
        []
    );

    return { trackPhoneVerificationEvents };
};

export default usePhoneVerificationAnalytics;
