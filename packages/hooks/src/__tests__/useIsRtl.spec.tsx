import { renderHook } from '@testing-library/react-hooks';
import useIsRtl from '../useIsRtl';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn(),
}));

const mock_response = {
    i18n: {
        dir: jest.fn().mockImplementation(lang => (lang === 'ar' ? 'rtl' : 'ltr')),
        language: 'en',
    },
};

describe('useIsRtl', () => {
    it('should return false when language is not RTL', () => {
        (useTranslation as jest.Mock).mockReturnValue(mock_response);
        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(false);
    });

    it('should return true when language is RTL', () => {
        mock_response.i18n.language = 'ar';
        (useTranslation as jest.Mock).mockReturnValue(mock_response);
        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(true);
    });
});
