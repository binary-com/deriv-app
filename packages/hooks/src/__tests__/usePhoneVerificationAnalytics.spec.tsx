import { Analytics } from '@deriv-com/analytics';
import { renderHook, act } from '@testing-library/react-hooks';
import usePhoneVerificationAnalytics from '../usePhoneVerificationAnalytics';

jest.mock('@deriv-com/analytics', () => ({
    Analytics: {
        trackEvent: jest.fn(),
    },
}));

describe('usePhoneVerificationAnalytics', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should track phone verification events correctly', () => {
        const { result } = renderHook(() => usePhoneVerificationAnalytics());

        const payload = {
            action: 'ce_phone_verification_form_submitted',
            subform_name: 'phone_number_verification',
        };

        act(() => {
            result.current.trackPhoneVerificationEvents(payload);
        });

        expect(Analytics.trackEvent).toHaveBeenCalledWith('ce_phone_verification_form', {
            form_name: 'ce_phone_verification_form',
            ...payload,
        });
    });
});
