import { getErrorMessage, getErrorModalTitle, getWidth } from 'Utils/block-user';

describe('getErrorMessage', () => {
    it('should return default message if is_invalid_advertiser_id is false', () => {
        expect(getErrorMessage('default message', false, false, 'name')).toEqual('default message');
    });

    it('should return error message if is_invalid_advertiser_id is true', () => {
        expect(getErrorMessage('default message', true, true, 'name')).toEqual(
            "Unblocking wasn't possible as name is not using Deriv P2P anymore."
        );
    });
});

describe('getErrorModalTitle', () => {
    it('should return default title if is_invalid_advertiser_id is false', () => {
        expect(getErrorModalTitle(false, 'name')).toEqual('Unable to block advertiser');
    });

    it('should return error title if is_invalid_advertiser_id is true', () => {
        expect(getErrorModalTitle(true, 'name')).toEqual('name is no longer on Deriv P2P');
    });
});

describe('getWidth', () => {
    it('should return 40rem if isMobile is false', () => {
        expect(getWidth()).toEqual('40rem');
    });

    it('should return 90rem if isMobile is true', () => {
        expect(getWidth()).toEqual('90rem');
    });
});
