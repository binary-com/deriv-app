import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { WS, getErrorMessages, validPassword, Jurisdiction } from '@deriv/shared';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CFDPasswordModal from '../cfd-password-modal/cfd-password-modal';
import CFDProviders from '../../cfd-providers';
import { mockStore } from '@deriv/stores';
import { APIProvider } from '@deriv/api';

jest.mock('@deriv/account', () => ({
    SentEmailModal: jest.fn(({ should_show_sent_email_modal }) => (
        <div>{should_show_sent_email_modal && <span>SentEmailModal</span>}</div>
    )),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(({ icon }) => <div>{icon}</div>),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getErrorMessages: jest.fn().mockReturnValue({
        password_warnings: '',
        password: jest.fn().mockReturnValue('Password should have lower and uppercase English letters with numbers.'),
    }),
    isDesktop: jest.fn().mockReturnValue(true),
    WS: {
        verifyEmail: jest.fn(),
    },
    validPassword: jest.fn().mockReturnValue(true),
}));

jest.mock('../../Assets/svgs/trading-platform', () => jest.fn(() => 'MockedMT5Icon'));
describe('<CFDPasswordModal/>', () => {
    const mockFn = jest.fn();
    const mockDisableCFDPasswordModalFn = jest.fn();
    const mockSetMt5Error = jest.fn();
    const mockSetCFDSuccessDialog = jest.fn();
    const mockSubmitMt5Password = jest.fn();
    const mockSubmitCFDPasswordFn = jest.fn();
    const history = createBrowserHistory();
    let modal_root_el;

    let mockRootStore = {
        client: {
            email: '',
            account_status: {},
            updateAccountStatus: jest.fn(),
            landing_companies: {},
            mt5_login_list: [],
            is_dxtrade_allowed: false,
        },
        traders_hub: {
            show_eu_related_content: false,
        },
        modules: {
            cfd: {
                is_cfd_password_modal_enabled: true,
                is_cfd_success_dialog_enabled: false,
                submitMt5Password: mockSubmitMt5Password,
                submitCFDPassword: mockSubmitCFDPasswordFn,
                setError: mockSetMt5Error,
                setCFDSuccessDialog: mockSetCFDSuccessDialog,
                has_cfd_error: false,
                error_message: '',
                error_type: '',
                account_title: '',
                account_type: {},
                disableCFDPasswordModal: mockDisableCFDPasswordModalFn,
                getAccountStatus: mockFn,
                new_account_response: {},
                jurisdiction_selected_shortcode: Jurisdiction.SVG,
            },
        },
        feature_flags: {
            data: {
                wallet: false,
            },
        },
        ui: {
            is_mobile: false,
        },
    };

    let store;
    const cfd_wrapper = ({ children }) => (
        <APIProvider>
            <CFDProviders store={store}>{children}</CFDProviders>
        </APIProvider>
    );

    const mock_props = {
        form_error: '',
        history: history,
        platform: 'mt5',
    };

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        store = mockStore(mockRootStore);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render create Password modal when valid conditions are met', async () => {
        store.client.account_status = { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );
        expect(await screen.findByTestId('dt_create_password')).toBeInTheDocument();
    });

    it('should render password form with Try later button and forget password button', async () => {
        store.client.account_status = { status: [] };
        store.modules.cfd.error_type = 'PasswordReset';

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );
        waitFor(() => {
            expect(screen.findByRole('button', { name: /Try Later/i })).toBeInTheDocument();
            expect(screen.findByRole('button', { name: /Forgot Password?/i })).toBeInTheDocument();
        });
    });

    it('should close modal when Forget Password button is clicked', async () => {
        store.client.account_status = { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] };
        store.modules.cfd.error_type = 'PasswordReset';

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );
        const ele_forget_btn = await screen.findByRole('button', { name: /forgot password?/i });
        userEvent.click(ele_forget_btn);

        screen.debug();
        await waitFor(() => {
            expect(mockSetCFDSuccessDialog).toHaveBeenCalledWith(false);
            expect(mockDisableCFDPasswordModalFn).toHaveBeenCalled();
            expect(mockSetMt5Error).toHaveBeenCalledWith(false);
        });
    });

    it('should invoke verifyEmail when forgot password is clicked', async () => {
        store.client.account_status = { status: [], category: 'Real' };
        store.modules.cfd.error_type = 'PasswordReset';
        store.modules.cfd.account_type = { category: 'real', type: 'financial' };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );
        const ele_forget_btn = await screen.findByRole('button', { name: /forgot password?/i });
        fireEvent.click(ele_forget_btn);
        await waitFor(() => {
            expect(WS.verifyEmail).toHaveBeenCalled();
        });
    });

    it('should display password field for user to enter the password and hold the entered value', async () => {
        const user_input = 'zo8lAet#2q01Ih';

        store.client.account_status = { status: [], category: 'Real' };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );

        const ele_password_field = await screen.findByTestId('dt_mt5_password');
        fireEvent.change(ele_password_field, { target: { value: user_input } });

        expect(await screen.findByRole('button', { name: /add account/i })).toBeInTheDocument();

        await waitFor(() => {
            expect(ele_password_field.value).toEqual(user_input);
        });
    });

    it('should display error message when password does not meet requirements', async () => {
        validPassword.mockReturnValue(false);
        const user_input = 'demo@deriv.com';

        store.client.account_status = { status: [], category: 'Real' };
        store.client.email = user_input;

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );
        const ele_password_input = await screen.findByTestId('dt_mt5_password');
        fireEvent.change(ele_password_input, { target: { value: 'password?password' } });
        await waitFor(() => {
            fireEvent.focusOut(ele_password_input);
        });

        await waitFor(() => {
            expect(validPassword).toHaveBeenCalled();
        });
        expect(
            await screen.findByText(/Password should have lower and uppercase English letters with numbers./i)
        ).toBeInTheDocument();
    });

    it('should show transfer message on successful DerivX account creation', async () => {
        store.client.account_status = { status: [], category: 'Real' };
        store.modules.cfd.account_type = { category: 'real', type: 'financial' };
        store.modules.cfd.is_cfd_success_dialog_enabled = true;
        store.modules.cfd.error_type = 'PasswordReset';

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} platform='dxtrade' />
            </Router>,
            { wrapper: cfd_wrapper }
        );

        expect(
            await screen.findByText(/to start trading, transfer funds from your Deriv account into this account./i)
        ).toBeInTheDocument();
    });

    it('should close the dialog when you click on ok button', async () => {
        store.client.account_status = { status: [], category: 'Real' };
        store.modules.cfd.account_type = { category: 'real', type: 'financial' };
        store.modules.cfd.is_cfd_success_dialog_enabled = true;
        store.modules.cfd.jurisdiction_selected_shortcode = 'bvi';

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );

        fireEvent.click(await screen.findByRole('button', { name: /ok/i }));

        await waitFor(() => {
            expect(mockSetCFDSuccessDialog).toHaveBeenCalledWith(false);
            expect(mockDisableCFDPasswordModalFn).toHaveBeenCalled();
            expect(mockSetMt5Error).toHaveBeenCalledWith(false);
        });
    });

    it('should show success dialog with buttons to Transfer now or later when password has been updated successfully', async () => {
        store.modules.cfd.account_type = { category: 'real', type: 'financial' };
        store.modules.cfd.is_cfd_success_dialog_enabled = true;

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );

        expect(await screen.findByRole('button', { name: /maybe later/i }));
        expect(await screen.findByRole('button', { name: /transfer now/i }));
    });

    it('should display Derived icon in Success Dialog', async () => {
        store.client.account_status = { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] };
        store.modules.cfd.account_type = { category: 'real', type: 'synthetic' };
        store.modules.cfd.error_type = 'PasswordError';
        store.modules.cfd.is_cfd_success_dialog_enabled = true;

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );

        expect(await screen.findByText('IcMt5SyntheticPlatform')).toBeInTheDocument();
    });

    it('should display icon in Success Dialog in tradershub', async () => {
        store.client.account_status = { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] };
        store.modules.cfd.account_type = { category: 'real', type: 'synthetic' };
        store.modules.cfd.error_type = 'PasswordError';
        store.modules.cfd.is_cfd_success_dialog_enabled = true;

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );

        expect(await screen.findByText('IcMt5SyntheticPlatform')).toBeInTheDocument();
    });

    it('should display Financial icon in Success Dialog', async () => {
        store.client.account_status = { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] };
        store.modules.cfd.account_type = { category: 'real', type: 'financial' };
        store.modules.cfd.error_type = 'PasswordError';
        store.modules.cfd.is_cfd_success_dialog_enabled = true;

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );

        expect(await screen.findByText('IcMt5FinancialPlatform')).toBeInTheDocument();
    });

    it('should display IcRebrandingDerivx icon in Success Dialog', async () => {
        store.client.account_status = { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] };
        store.modules.cfd.account_type = { category: 'real', type: 'all' };
        store.modules.cfd.error_type = 'PasswordError';
        store.modules.cfd.is_cfd_success_dialog_enabled = true;

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} platform='dxtrade' />
            </Router>,
            { wrapper: cfd_wrapper }
        );

        expect(await screen.findByText('IcRebrandingDxtradeDashboard')).toBeInTheDocument();
    });

    it('should display IcCfds icon in Success Dialog', async () => {
        store.client.account_status = { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] };
        store.traders_hub.show_eu_related_content = true;
        store.modules.cfd.account_type = { category: 'real', type: 'financial' };
        store.modules.cfd.error_type = 'PasswordError';
        store.modules.cfd.is_cfd_success_dialog_enabled = true;

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            { wrapper: cfd_wrapper }
        );
        expect(await screen.findByText('IcMt5CfdPlatform')).toBeInTheDocument();
    });

    it('should invoke verifyEmail for DerivX when Forgot password is clicked', async () => {
        store.client.account_status = { status: [], category: 'Real' };
        store.client.email = 'demo@deriv.com';
        store.modules.cfd.account_type = { category: 'demo', type: 'financial' };
        store.modules.cfd.error_type = 'PasswordReset';
        store.modules.cfd.setCFDSuccessDialog = mockFn;

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} platform='dxtrade' />
            </Router>,
            { wrapper: cfd_wrapper }
        );

        const ele_forget_btn = await screen.findByRole('button', { name: /forgot password?/i });
        fireEvent.click(ele_forget_btn);
        await waitFor(() => {
            expect(WS.verifyEmail).toHaveBeenCalledWith('demo@deriv.com', 'trading_platform_dxtrade_password_reset', {
                url_parameters: { redirect_to: 21 },
            });
        });
    });

    it('should create Deriv MT5 password when clicked on Create Deriv MT5 password', async () => {
        const user_input = 'zo8lAet#2q01Ih';
        validPassword.mockReturnValue(true);

        store.client.account_status = { status: ['mt5_password_not_set'], category: 'Real' };
        store.modules.cfd.account_type = { category: 'real', type: 'financial' };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />;
            </Router>,
            { wrapper: cfd_wrapper }
        );
        fireEvent.change(await screen.findByTestId('dt_mt5_password'), { target: { value: user_input } });
        fireEvent.click(await screen.findByRole('button', { name: 'Create Deriv MT5 password' }));

        await waitFor(() => {
            expect(mockSubmitMt5Password).toHaveBeenCalled();
        });
    });

    it('should create DerivX platform password when clicked on Add account', async () => {
        const user_input = 'zo8lAet#2q01Ih';
        validPassword.mockReturnValue(true);

        store.client.account_status = { status: ['mt5_password_not_set'], category: 'Real' };
        store.modules.cfd.account_type = { category: 'real', type: 'financial' };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} platform='dxtrade' />;
            </Router>,
            { wrapper: cfd_wrapper }
        );

        fireEvent.change(await screen.findByTestId('dt_dxtrade_password'), { target: { value: user_input } });
        fireEvent.click(await screen.findByRole('button', { name: 'Add account' }));

        await waitFor(() => {
            expect(mockSubmitCFDPasswordFn).toHaveBeenCalled();
        });
    });
});
