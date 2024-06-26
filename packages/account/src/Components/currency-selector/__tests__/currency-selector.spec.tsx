/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck [TODO]:Need to check the issue with DeepPartial - { [K in keyof T]?: DeepPartial<T[K]> }
import React from 'react';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import CurrencySelector from '../currency-selector';
import { TStores } from '@deriv/stores/types';
import { useDevice } from '@deriv-com/ui';

jest.mock('../../real-account-signup/helpers/utils.ts', () => ({
    splitValidationResultTypes: jest.fn(() => ({
        warnings: {},
        errors: {},
    })),
}));
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

describe('<CurrencySelector/>', () => {
    const mock_props: React.ComponentProps<typeof CurrencySelector> = {
        value: {
            currency: '',
        },
        validate: jest.fn(),
        is_virtual: true,
        getCurrentStep: jest.fn(() => 1),
        onSave: jest.fn(),
        onCancel: jest.fn(),
        goToNextStep: jest.fn(),
        goToStep: jest.fn(),
        onSubmit: jest.fn(),
        goToPreviousStep: jest.fn(),
        has_cancel: false,
        has_wallet_account: false,
        set_currency: false,
    };

    const runCommonTests = () => {
        expect(screen.getByRole('radio', { name: /us dollar \(usd\)/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /euro \(eur\)/i })).toBeInTheDocument();

        expect(screen.getByRole('radio', { name: /tether erc20 \(eusdt\)/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /usd coin \(usdc\)/i })).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();

        const usd = screen.getByRole('radio', { name: /us dollar \(usd\)/i }) as HTMLInputElement;
        expect(usd.checked).toEqual(false);
        fireEvent.click(usd);
        expect(usd.checked).toEqual(true);

        expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
    };
    const store = mockStore({
        client: {
            accounts: {
                VRTC90000010: {
                    account_type: 'trading',
                    currency: 'USD',
                    is_disabled: 0,
                    is_virtual: 1,
                    landing_company_shortcode: 'svg',
                    trading: {},
                    token: '',
                    email: '',
                    session_start: 1651059038,
                    landing_company_name: 'virtual',
                    residence: 'es',
                    balance: 10000,
                    accepted_bch: 0,
                },
            },
            upgradeable_currencies: [
                {
                    value: 'EUR',
                    fractional_digits: 2,
                    is_deposit_suspended: 0,
                    is_suspended: 0,
                    is_withdrawal_suspended: 0,
                    name: 'Euro',
                    stake_default: 10,
                    transfer_between_accounts: {
                        fees: {
                            AUD: 0,
                        },
                        limits: {
                            max: 4717.96,
                            min: 0.94,
                        },
                        limits_dxtrade: {
                            max: 2358.45,
                            min: 0.01,
                        },
                        limits_mt5: {
                            max: 14150.68,
                            min: 0.01,
                        },
                    },
                    type: 'fiat',
                },
                {
                    value: 'USD',
                    fractional_digits: 2,
                    is_deposit_suspended: 0,
                    is_suspended: 0,
                    is_withdrawal_suspended: 0,
                    name: 'US Dollar',
                    stake_default: 10,
                    transfer_between_accounts: {
                        fees: {
                            AUD: 0,
                        },
                        limits: {
                            max: 5000,
                            min: 1,
                        },
                        limits_dxtrade: {
                            max: 2500,
                            min: 0.01,
                        },
                        limits_mt5: {
                            max: 15000,
                            min: 0.01,
                        },
                    },
                    type: 'fiat',
                },
                {
                    value: 'USDC',
                    fractional_digits: 2,
                    is_deposit_suspended: 0,
                    is_suspended: 0,
                    is_withdrawal_suspended: 0,
                    name: 'USD Coin',
                    stake_default: 10,
                    transfer_between_accounts: {
                        fees: {
                            AUD: 2,
                        },
                        limits: {
                            max: 5001.52,
                            min: 1,
                        },
                        limits_dxtrade: {
                            max: 2500.76,
                            min: 0.01,
                        },
                        limits_mt5: {
                            max: 15004.55,
                            min: 0.01,
                        },
                    },
                    type: 'crypto',
                },
                {
                    value: 'eUSDT',
                    fractional_digits: 2,
                    is_deposit_suspended: 0,
                    is_suspended: 0,
                    is_withdrawal_suspended: 0,
                    name: 'Tether ERC20',
                    stake_default: 10,
                    transfer_between_accounts: {
                        fees: {
                            AUD: 2,
                        },
                        limits: {
                            max: 5001.78,
                            min: 1,
                        },
                        limits_dxtrade: {
                            max: 2500.89,
                            min: 0.01,
                        },
                        limits_mt5: {
                            max: 15005.33,
                            min: 0.01,
                        },
                    },
                    type: 'crypto',
                },
            ],
            available_crypto_currencies: [
                {
                    value: 'eUSDT',
                    fractional_digits: 2,
                    is_deposit_suspended: 0,
                    is_suspended: 0,
                    is_withdrawal_suspended: 0,
                    name: 'Tether ERC20',
                    stake_default: 10,
                    transfer_between_accounts: {
                        fees: {
                            AUD: 2,
                        },
                        limits: {
                            max: 5001.78,
                            min: 1,
                        },
                        limits_dxtrade: {
                            max: 2500.89,
                            min: 0.01,
                        },
                        limits_mt5: {
                            max: 15005.33,
                            min: 0.01,
                        },
                    },
                    type: 'crypto',
                },
            ],
        },
        ui: {
            real_account_signup: {
                active_modal_index: -1,
                previous_currency: '',
                current_currency: '',
                success_message: '',
                error_message: '',
                error_code: '2',
            },
        },
    });

    const renderComponent = ({ props = mock_props, store_config = store }) => {
        return render(
            <StoreProvider store={store_config}>
                <CurrencySelector {...props} />
            </StoreProvider>
        );
    };

    it('should render Currency selector', () => {
        renderComponent({});

        expect(screen.getByTestId('currency_selector_form')).toBeInTheDocument();
    });

    it('should render Fiat currencies and submit the form', async () => {
        renderComponent({});

        runCommonTests();
        fireEvent.click(screen.getByRole('button', { name: /next/i }));
        await waitFor(() => {
            expect(mock_props.onSubmit).toHaveBeenCalled();
            expect(mock_props.onSubmit).toHaveBeenCalledWith(
                0,
                { currency: 'USD' },
                expect.any(Function),
                mock_props.goToNextStep
            );
        });
    });

    it('should disable fiat if user already have a fiat ', () => {
        const new_store: TStores = {
            ...store,
            client: {
                ...store.client,
                accounts: {
                    VRTC90000010: {
                        account_type: 'trading',
                        currency: 'USD',
                        is_disabled: 0,
                        is_virtual: 1,
                        landing_company_shortcode: 'svg',
                        token: '',
                        excluded_until: undefined,
                        landing_company_name: 'svg',
                        balance: 10000,
                    },
                },
                has_active_real_account: true,
                has_fiat: true,
            },
            ui: {
                ...store.ui,
                real_account_signup_target: 'svg',
            },
        };

        renderComponent({ store_config: new_store });
        expect(screen.getByRole('radio', { name: /us dollar \(usd\)/i })).toBeDisabled();
        expect(screen.getByRole('radio', { name: /euro \(eur\)/i })).toBeDisabled();
    });

    it('should render Fiat currencies when is_dxtrade_allowed and is_mt5_allowed are true', () => {
        const new_store = {
            ...store,
            client: {
                ...store.client,
                is_dxtrade_allowed: true,
                is_mt5_allowed: true,
            },
        };
        renderComponent({ store_config: new_store });
        runCommonTests();
    });

    it('should render Fiat currencies when is_dxtrade_allowed,is_eu and is_mt5_allowed are true', () => {
        const new_store: TStores = {
            ...store,
            client: {
                ...store.client,
                is_dxtrade_allowed: true,
                is_mt5_allowed: true,
            },
            traders_hub: {
                ...store.traders_hub,
                is_eu_user: true,
            },
        };
        renderComponent({ store_config: new_store });
        runCommonTests();
    });

    it('should render Fiat currencies when is_mt5_allowed and is_eu are true', () => {
        const new_store: TStores = {
            ...store,
            client: {
                ...store.client,
                is_mt5_allowed: true,
            },
            traders_hub: {
                ...store.traders_hub,
                is_eu_user: true,
            },
        };
        renderComponent({ store_config: new_store });
        runCommonTests();
    });

    it('should render Fiat currencies when is_mt5_allowed is true', () => {
        const new_store: TStores = {
            ...store,
            client: {
                ...store.client,
                is_mt5_allowed: true,
            },
        };
        renderComponent({ store_config: new_store });
        runCommonTests();
    });

    it('should render Cryptocurrencies and submit the form ', async () => {
        const new_props: React.ComponentProps<typeof CurrencySelector> = {
            ...mock_props,
            set_currency: true,
        };
        renderComponent({ props: new_props });
        expect(screen.getByRole('radio', { name: /tether erc20 \(eusdt\)/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /usd coin \(usdc\)/i })).toBeInTheDocument();

        const set_currency_btn = screen.getByRole('button', { name: /set currency/i });
        expect(set_currency_btn).toBeInTheDocument();
        expect(set_currency_btn).toBeDisabled();

        const tether: HTMLInputElement = screen.getByRole('radio', {
            name: /tether erc20 \(eusdt\)/i,
        });
        expect(tether.checked).toEqual(false);
        fireEvent.click(tether);
        expect(tether.checked).toEqual(true);

        expect(set_currency_btn).toBeEnabled();

        fireEvent.click(set_currency_btn);
        await waitFor(() => {
            expect(mock_props.onSubmit).toHaveBeenCalledWith(
                0,
                { currency: 'eUSDT' },
                expect.any(Function),
                mock_props.goToNextStep
            );
        });
    });

    it('should submit the form when getCurrentStep is not passed ', async () => {
        renderComponent({});
        runCommonTests();
        fireEvent.click(screen.getByRole('button', { name: /next/i }));
        await waitFor(() => {
            expect(mock_props.onSubmit).toHaveBeenCalled();
        });
    });

    it('should render the selector__container with proper div height', () => {
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 150,
        });
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        const new_store = {
            ...store,
            client: {
                ...store.client,
                has_active_real_account: true,
            },
        };
        renderComponent({ store_config: new_store });

        expect(screen.getByTestId('currency_selector_form').childNodes[0]).toHaveStyle('height: calc(150px - 89px);');
    });

    it('should call handleCancel when previous button is called', () => {
        const new_props: React.ComponentProps<typeof CurrencySelector> = {
            ...mock_props,
            has_wallet_account: true,
            has_cancel: true,
        };
        renderComponent({ props: new_props });

        const usdc: HTMLInputElement = screen.getByRole('radio', { name: /usd coin \(usdc\)/i });
        expect(usdc.checked).toEqual(false);
        fireEvent.click(usdc);
        expect(usdc.checked).toEqual(true);

        expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
        const prev_btn = screen.getByRole('button', { name: /previous/i });
        expect(prev_btn).toBeInTheDocument();
        fireEvent.click(prev_btn);
        expect(mock_props.onSave).toHaveBeenCalledWith(0, { currency: 'USDC' });
    });

    it('should bypass to next step in case of personal details form error', () => {
        const new_store: TStores = {
            ...store,
            ui: {
                ...store.ui,
                real_account_signup: {
                    ...store.ui.real_account_signup,
                    error_details: { first_name: 'numbers not allowed' },
                },
            },
        };
        renderComponent({ store_config: new_store });

        expect(mock_props.goToNextStep).toHaveBeenCalled();
        expect(store.ui.resetRealAccountSignupParams).toHaveBeenCalled();
    });

    it('should bypass to address step in case of address details form error', () => {
        const new_store: TStores = {
            ...store,
            ui: {
                ...store.ui,
                real_account_signup: {
                    ...store.ui.real_account_signup,
                    error_details: { address_line_1: 'po box is not allowed' },
                },
            },
        };
        renderComponent({ store_config: new_store });
        expect(mock_props.goToStep).toHaveBeenCalledWith(3);
        expect(store.ui.resetRealAccountSignupParams).toHaveBeenCalled();
    });
});
