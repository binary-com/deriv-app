import React from 'react';
import { render, screen } from '@testing-library/react';
import TopUpDemoModal from '../top-up-demo-modal.tsx';
import CFDProviders from '../../../cfd-providers.tsx';
import { mockStore } from '@deriv/stores';
import { APIProvider, AuthProvider } from '@deriv/api';

jest.mock('../../../Components/success-dialog.jsx', () => () => <div>Success Dialog</div>);

describe('TopUpDemoModal', () => {
    let modal_root_el;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const synthetic_config = {
        account_type: 'synthetic',
        leverage: 500,
        short_title: 'Derived',
    };

    const financial_config = {
        account_type: 'financial',
        leverage: 1000,
        short_title: 'Financial',
    };

    const mock_props = {
        modules: {
            cfd: {
                dxtrade_companies: {},
                mt5_companies: {
                    demo: {
                        synthetic: {
                            mt5_account_type: synthetic_config.account_type,
                            leverage: synthetic_config.leverage,
                            title: 'Demo Derived',
                            short_title: synthetic_config.short_title,
                        },
                        financial: {
                            mt5_account_type: financial_config.account_type,
                            leverage: financial_config.leverage,
                            title: 'Demo Financial',
                            short_title: financial_config.short_title,
                        },
                    },
                    real: {
                        synthetic: {
                            mt5_account_type: synthetic_config.account_type,
                            leverage: synthetic_config.leverage,
                            title: 'Derived',
                            short_title: synthetic_config.short_title,
                        },
                        financial: {
                            mt5_account_type: financial_config.account_type,
                            leverage: financial_config.leverage,
                            title: 'CFDs',
                            short_title: financial_config.short_title,
                        },
                    },
                },
                topUpVirtual: jest.fn(),
                current_account: { category: 'demo', type: 'financial', balance: '700', display_balance: '700' },
            },
        },
        ui: {
            closeSuccessTopUpModal: jest.fn(),
            closeTopUpModal: jest.fn(),
            is_top_up_virtual_open: true,
            is_top_up_virtual_in_progress: false,
            is_top_up_virtual_success: false,
        },
        platform: 'test platform',
    };

    const renderComponent = () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <CFDProviders store={mockStore(mock_props)}>
                        <TopUpDemoModal platform={mock_props.platform} />
                    </CFDProviders>
                </AuthProvider>
            </APIProvider>
        );
    };

    it('should render the button texts correctly', () => {
        renderComponent();
        expect(screen.getByText('Fund top up')).toBeInTheDocument();
        expect(screen.getByText('Current balance')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_top_up_virtual_description')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Top up/i })).toBeInTheDocument();
    });

    it('should render the proper balance in the current balance', () => {
        renderComponent();
        expect(screen.getByText('700.00')).toBeInTheDocument();
    });

    it('should disable the top up button if the balance is higher than 1000 USD', () => {
        mock_props.modules.cfd.current_account = { category: 'demo', type: 'financial', balance: 2000 };

        renderComponent();
        const top_up_btn = screen.getByRole('button', { name: /Top up/i });
        expect(top_up_btn).toBeDisabled();
    });

    it('should enable the top up button if the balance is lower than 1000 USD', () => {
        mock_props.modules.cfd.current_account = { category: 'demo', type: 'financial', balance: 500 };

        renderComponent();
        const top_up_btn = screen.getByRole('button', { name: /Top up/i });
        expect(top_up_btn).toBeEnabled();
    });

    it('should render the success component if the is_top_up_virtual_success is true', () => {
        mock_props.current_account = { category: 'demo', type: 'financial', balance: 500 };
        mock_props.ui.is_top_up_virtual_success = true;
        mock_props.ui.is_top_up_virtual_open = false;

        renderComponent();
        expect(screen.getByText('Success Dialog')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_top_up_virtual_description')).not.toBeInTheDocument();
    });

    it('should not render the component if conditions are false', () => {
        mock_props.modules.cfd.current_account = { category: 'demo', type: 'financial', balance: 500 };
        mock_props.ui.is_top_up_virtual_success = false;
        mock_props.ui.is_top_up_virtual_open = false;

        renderComponent();
        expect(screen.queryByTestId('dt_top_up_virtual_description')).not.toBeInTheDocument();
    });
});
