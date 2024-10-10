import React from 'react';
import { Router } from 'react-router';
import userEvent from '@testing-library/user-event';
import { createBrowserHistory } from 'history';
import { render, screen, waitFor } from '@testing-library/react';
import MT5CreatePassword from '../mt5-create-password';
import { mockStore } from '@deriv/stores';
import CFDProviders from '../../../cfd-providers';
import { CFD_PLATFORMS } from '@deriv/shared';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(({ icon }) => <div>{icon}</div>),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getErrorMessages: jest.fn().mockReturnValue({
        password_warnings: '',
        password: jest.fn().mockReturnValue('Password should have lower and uppercase English letters with numbers.'),
    }),
    validPassword: jest.fn().mockReturnValue(true),
    isDesktop: jest.fn().mockReturnValue(true),
    DBVI_COMPANY_NAMES: {
        svg: { name: 'Sample Company', licence_name: 'Sample Licence' },
        other: { name: 'Other Company', licence_name: 'Other Licence' },
    },
}));

describe('<MT5CreatePassword/>', () => {
    const mockFn = jest.fn();
    const history = createBrowserHistory();
    let modalRoot;

    const mockRootStore = {
        modules: {
            cfd: {
                error_message: '',
                account_title: '',
                account_type: { type: 'mt5', category: 'real' },
                getAccountStatus: mockFn,
                new_account_response: {},
                jurisdiction_selected_shortcode: 'svg',
                setProduct: jest.fn(),
            },
        },
    };

    const default_props = {
        password: '',
        platform: CFD_PLATFORMS.MT5,
        error_message: '',
        validatePassword: jest.fn(),
        onSubmit: jest.fn(),
        need_tnc: true,
    };

    beforeAll(() => {
        modalRoot = document.createElement('div');
        modalRoot.setAttribute('id', 'modal_root');
        document.body.appendChild(modalRoot);
    });

    afterAll(() => {
        document.body.removeChild(modalRoot);
    });

    it('should render MT5CreatePassword component', async () => {
        render(
            <Router history={history}>
                <MT5CreatePassword {...default_props} />
            </Router>,
            {
                wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
            }
        );

        expect(await screen.findByTestId('dt_mt5_create_password')).toBeInTheDocument();
    });

    it('should display IcMt5OnePassword icon in the component', async () => {
        render(
            <Router history={history}>
                <MT5CreatePassword {...default_props} />
            </Router>,
            {
                wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
            }
        );
        expect(await screen.findByText('IcMt5Password')).toBeInTheDocument();
    });

    it('should display password field for user to enter the password and hold the entered value', async () => {
        const user_input = 'zo8lAet#2q01Ih';

        render(
            <Router history={history}>
                <MT5CreatePassword {...default_props} />
            </Router>,
            {
                wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
            }
        );
        const password_input = await screen.findByTestId('dt_mt5_password');

        userEvent.paste(password_input, user_input);
        await waitFor(() => {
            expect(password_input.value).toBe(user_input);
        });
    });

    it('should display password requirements message', async () => {
        render(
            <Router history={history}>
                <MT5CreatePassword {...default_props} />
            </Router>,
            {
                wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
            }
        );

        expect(await screen.findByText(/This password works for all your Deriv MT5 accounts./i)).toBeInTheDocument();
    });

    it('should show TNC checkbox when account type is real ', async () => {
        render(
            <Router history={history}>
                <MT5CreatePassword {...default_props} need_tnc={true} />
            </Router>,
            {
                wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
            }
        );
        const checkbox = await screen.findByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
    });

    it('should call onSubmit when form is submitted', async () => {
        const user_input = 'zo8lAet#2q01Ih';
        const onSubmit = jest.fn();
        const validatePassword = jest.fn().mockReturnValue({});

        render(
            <Router history={history}>
                <MT5CreatePassword
                    {...default_props}
                    password={user_input}
                    onSubmit={onSubmit}
                    validatePassword={validatePassword}
                />
            </Router>,
            {
                wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
            }
        );

        const passwordInput = await screen.findByTestId('dt_mt5_password');
        const submitButton = await screen.findByRole('button', { name: /Create account/i });

        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();

        userEvent.paste(passwordInput, user_input);
        const checkbox = await screen.findByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        userEvent.click(checkbox);
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        });
    });
});
