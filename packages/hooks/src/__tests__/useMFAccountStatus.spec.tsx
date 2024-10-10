import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { ACCOUNT_BADGE_STATUS } from '@deriv/shared';
import { renderHook } from '@testing-library/react-hooks';

import useMFAccountStatus from '../useMFAccountStatus';
import useHasMaltaInvestAccount from '../useHasMaltaInvestAccount';
import useGetMFAccountStatus from '../useGetMFAccountStatus';

jest.mock('../useHasMaltaInvestAccount', () => jest.fn());
jest.mock('../useGetMFAccountStatus', () => jest.fn());

const mockUseHasMaltaInvestAccount = useHasMaltaInvestAccount as jest.MockedFunction<typeof useHasMaltaInvestAccount>;
const mockUseGetMFAccountStatus = useGetMFAccountStatus as jest.MockedFunction<typeof useGetMFAccountStatus>;

describe('useMFAccountStatus', () => {
    let mock_store = mockStore({});
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );
    beforeEach(() => (mock_store = mockStore({})));
    it('should return mf_status if conditions are met', () => {
        mock_store.client.is_eu = true;
        mockUseHasMaltaInvestAccount.mockReturnValue(true);
        mockUseGetMFAccountStatus.mockReturnValue({
            kyc_status: { poi_status: 'verified', poa_status: 'verified', valid_tin: 1 },
            mf_account_status: ACCOUNT_BADGE_STATUS.NEEDS_VERIFICATION,
        });
        const { result } = renderHook(() => useMFAccountStatus(), {
            wrapper,
        });
        expect(result.current).toBe('needs_verification');
    });
    it('should return null if conditions are not met', () => {
        mockUseHasMaltaInvestAccount.mockReturnValue(false);
        mockUseGetMFAccountStatus.mockReturnValue({
            kyc_status: { poi_status: 'verified', poa_status: 'verified', valid_tin: 1 },
            mf_account_status: ACCOUNT_BADGE_STATUS.NEEDS_VERIFICATION,
        });
        const { result } = renderHook(() => useMFAccountStatus(), {
            wrapper,
        });
        expect(result.current).toBe(null);
    });
});
