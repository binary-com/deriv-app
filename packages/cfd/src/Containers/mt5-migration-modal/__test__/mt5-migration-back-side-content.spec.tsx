import React from 'react';
import MT5MigrationBackSideContent from '../mt5-migration-back-side-content';
import { render, screen, waitFor } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { CFDStoreProvider } from 'Stores/Modules/CFD/Helpers/useCfdStores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import userEvent from '@testing-library/user-event';
import { useMT5MigrationModalContext } from '../mt5-migration-modal-context';
import { Formik } from 'formik';
import { WS } from '@deriv/shared';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useMT5SVGEligibleToMigrate: jest.fn(),
}));

jest.mock('../mt5-migration-modal-context', () => ({
    ...jest.requireActual('../mt5-migration-modal-context'),
    useMT5MigrationModalContext: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getErrorMessages: jest.fn().mockReturnValue({
        password: jest.fn(),
        special_chracters: jest.fn(),
        password_warnings: '',
    }),
    WS: {
        verifyEmail: jest.fn(),
    },
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    PasswordMeter: jest.fn(({ children }) => <div>{children}</div>),
}));

const mock_store = mockStore({
    ui: {
        is_mobile: false,
        toggleMT5MigrationModal: jest.fn(),
        setMT5MigrationModalEnabled: jest.fn(),
    },
    common: {
        setAppstorePlatform: jest.fn(),
    },
});

const mockUseMT5MigrationModalContext = useMT5MigrationModalContext as jest.MockedFunction<
    typeof useMT5MigrationModalContext
>;

const mockUseMT5SVGEligibleToMigrate = useMT5SVGEligibleToMigrate as jest.MockedFunction<
    typeof useMT5SVGEligibleToMigrate
>;

describe('MT5MigrationBackSideContent', () => {
    let response: ReturnType<typeof useMT5SVGEligibleToMigrate>,
        response_migration_context: ReturnType<typeof useMT5MigrationModalContext>;
    const renderComponent = () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <Formik
                    initialValues={{
                        password: '',
                    }}
                    onSubmit={jest.fn()}
                >
                    <CFDStoreProvider>{children}</CFDStoreProvider>
                </Formik>
            </StoreProvider>
        );
        mockUseMT5SVGEligibleToMigrate.mockReturnValue(response);
        mockUseMT5MigrationModalContext.mockReturnValue(response_migration_context);
        render(<MT5MigrationBackSideContent />, { wrapper });
    };

    beforeEach(() => {
        response = {
            eligible_account_to_migrate_label: 'bvi',
            getEligibleAccountToMigrate: jest.fn().mockReturnValue('bvi'),
            eligible_svg_to_bvi_derived_accounts: false,
            eligible_svg_to_bvi_financial_accounts: false,
            eligible_svg_to_vanuatu_derived_accounts: false,
            eligible_svg_to_vanuatu_financial_accounts: false,
            has_derived_and_financial_mt5: false,
            has_derived_mt5_to_migrate: false,
            has_svg_accounts_to_migrate: false,
            no_of_svg_accounts_to_migrate: 0,
            svg_accounts_to_migrate: [],
        };
        response_migration_context = {
            show_modal_front_side: true,
            setShowModalFrontSide: jest.fn(),
        };
    });

    it('should render the password input modal with all the details', async () => {
        renderComponent();
        expect(screen.getByText('Enter your Deriv MT5 password to upgrade your account(s).')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Forgot password?' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Upgrade' })).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByLabelText('Deriv MT5 password')).toBeInTheDocument();
        });
    });

    it('should trigger functions after clicking on Forgot password button', () => {
        renderComponent();
        const forgot_password_button = screen.getByRole('button', { name: 'Forgot password?' });
        userEvent.click(forgot_password_button);
        expect(mock_store.ui.setMT5MigrationModalEnabled).toBeCalled();
        expect(mock_store.ui.toggleMT5MigrationModal).toBeCalled();
        expect(WS.verifyEmail).toBeCalled();
        expect(mock_store.modules.cfd.setSentEmailModalStatus).toBeCalled();
    });

    it('should trigger the upgrade function after clicking on Upgrade button', async () => {
        renderComponent();

        const input_field = screen.getByLabelText('Deriv MT5 password');
        userEvent.type(input_field, 'Abcd1234!');
        const upgrade_button = screen.getByRole('button', { name: 'Upgrade' });
        userEvent.click(upgrade_button);
        await waitFor(() => {
            expect(mock_store.modules.cfd.submitMt5Password).toBeCalled();
        });
    });
});
