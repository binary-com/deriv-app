import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import CFDsListing from '../index';

jest.mock('Components/containers/listing-container', () =>
    jest.fn(({ children }) => <div data-testid='listing-container'>{children}</div>)
);
jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({
        isDesktop: true,
        isMobile: false,
        isTablet: false,
    })),
}));

describe('CFDsListing', () => {
    const mock = mockStore({
        traders_hub: {
            selected_region: 'Non-EU',
            has_any_real_account: true,
            is_real: true,
            no_MF_account: true,
            is_demo_low_risk: true,
        },
        client: {
            is_landing_company_loaded: true,
            real_account_creation_unlock_date: '2022-02-02',
        },
        modules: {
            cfd: {
                toggleCompareAccountsModal: jest.fn(),
                setAccountType: jest.fn(),
                current_list: {},
            },
        },
    });

    it('should render the component', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CFDsListing />, { wrapper });
        expect(screen.getByTestId('listing-container')).toBeInTheDocument();
    });
});
