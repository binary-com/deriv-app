import React from 'react';
import MT5MigrationFrontSideContent from '../mt5-migration-front-side-content';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { CFDStoreProvider } from 'Stores/Modules/CFD/Helpers/useCfdStores';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useMT5SVGEligibleToMigrate: jest.fn(),
}));

const mock_store = mockStore({
    ui: {
        is_mobile_or_tablet: false,
    },
});

const mockUseMT5SVGEligibleToMigrate = useMT5SVGEligibleToMigrate as jest.MockedFunction<
    typeof useMT5SVGEligibleToMigrate
>;

describe('MT5MigrationFrontSideContent', () => {
    let migration_response: ReturnType<typeof useMT5SVGEligibleToMigrate>;

    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <CFDStoreProvider>{children}</CFDStoreProvider>
            </StoreProvider>
        );
        mockUseMT5SVGEligibleToMigrate.mockReturnValue(migration_response);
        render(<MT5MigrationFrontSideContent />, { wrapper });
    };

    beforeEach(() => {
        migration_response = {
            eligible_account_to_migrate_label: 'BVI',
            eligible_svg_to_bvi_derived_accounts: false,
            eligible_svg_to_bvi_financial_accounts: false,
            eligible_svg_to_vanuatu_derived_accounts: false,
            eligible_svg_to_vanuatu_financial_accounts: false,
            getEligibleAccountToMigrate: jest.fn(() => 'bvi'),
            has_derived_and_financial_mt5: false,
            has_derived_mt5_to_migrate: false,
            has_svg_accounts_to_migrate: false,
            no_of_svg_accounts_to_migrate: 0,
            svg_accounts_to_migrate: [],
        };
    });

    it('should render MT5MigrationFrontSideContent', () => {
        renderComponent();

        expect(screen.getByText(/Enhance your trading experience by upgrading your/i)).toBeInTheDocument();
        expect(screen.getByText(/Your existing/i)).toBeInTheDocument();
        expect(screen.getByText(/account\(s\) will remain accessible\./i)).toBeInTheDocument();
        expect(screen.getByText(/By clicking/i)).toBeInTheDocument();
        expect(screen.getByText(/you agree to move your/i)).toBeInTheDocument();
        expect(screen.getByText(/MT5 Financial SVG account\(s\)/i)).toBeInTheDocument();
        expect(screen.getByText(/under Deriv BVI Ltd’s/i)).toBeInTheDocument();

        const terms_conditions_link = screen.getByRole('link', { name: 'terms and conditions' });
        expect(terms_conditions_link.hasAttribute('https://deriv.com/tnc/deriv-(bvi)-ltd.pdf'));
        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('should render MT5MigrationFrontSideContent with Standard and Financial vanuatu account details', () => {
        migration_response = {
            eligible_account_to_migrate_label: 'Vanuatu',
            eligible_svg_to_bvi_derived_accounts: false,
            eligible_svg_to_bvi_financial_accounts: false,
            eligible_svg_to_vanuatu_derived_accounts: true,
            eligible_svg_to_vanuatu_financial_accounts: true,
            getEligibleAccountToMigrate: jest.fn(() => 'vanuatu'),
            has_derived_and_financial_mt5: true,
            has_derived_mt5_to_migrate: true,
            has_svg_accounts_to_migrate: true,
            no_of_svg_accounts_to_migrate: 1,
            svg_accounts_to_migrate: [],
        };
        renderComponent();

        expect(screen.getByText(/Enhance your trading experience by upgrading your/i)).toBeInTheDocument();
        expect(screen.getByText(/Your existing/i)).toBeInTheDocument();
        expect(screen.getByText(/account\(s\) will remain accessible\./i)).toBeInTheDocument();
        expect(screen.getByText(/By clicking/i)).toBeInTheDocument();
        expect(screen.getByText(/you agree to move your/i)).toBeInTheDocument();
        expect(screen.getByText(/MT5 Standard and Financial SVG account\(s\)/i)).toBeInTheDocument();
        expect(screen.getByText(/under Deriv Vanuatu Ltd’s/i)).toBeInTheDocument();

        const terms_conditions_link = screen.getByRole('link', { name: 'terms and conditions' });
        expect(terms_conditions_link.hasAttribute('https://deriv.com/tnc/general-terms.pdf'));

        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('should render svg to bvi Standard Icons', () => {
        migration_response.eligible_svg_to_bvi_derived_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_standard')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_bvi_standard')).toBeInTheDocument;
    });

    it('should render svg to bvi financial Icons', () => {
        migration_response.eligible_svg_to_bvi_financial_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_bvi_financial')).toBeInTheDocument;
    });

    it('should render svg to vanuatu Standard Icons', () => {
        migration_response.eligible_svg_to_vanuatu_derived_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_standard')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_vanuatu_standard')).toBeInTheDocument;
    });

    it('should render svg to vanuatu financial Icons', () => {
        migration_response.eligible_svg_to_vanuatu_financial_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_vanuatu_financial')).toBeInTheDocument;
    });

    it('should render both Standard svg to bvi and financial svg to bvi Icons', () => {
        migration_response.eligible_svg_to_bvi_derived_accounts = true;
        migration_response.eligible_svg_to_bvi_financial_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_standard')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_bvi_standard')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_bvi_financial')).toBeInTheDocument;
    });

    it('should render both Standard svg to vanuatu and financial svg to vanuatu Icons', () => {
        migration_response.eligible_svg_to_vanuatu_derived_accounts = true;
        migration_response.eligible_svg_to_vanuatu_financial_accounts = true;
        renderComponent();
        expect(screen.getByTestId('dt_migrate_from_svg_standard')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_vanuatu_standard')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_from_svg_financial')).toBeInTheDocument;
        expect(screen.getByTestId('dt_migrate_to_vanuatu_financial')).toBeInTheDocument;
    });
});
