import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CFDAccountCard } from '../cfd-account-card';
import { TCFDAccountCard } from '../props.types';
import { mockStore } from '@deriv/stores';
import { TCFDPasswordReset } from '../../Containers/props.types';
import CFDProviders from '../../cfd-providers';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobileOrTablet: jest.fn(() => false),
}));

type TMockPlatformAccounts = {
    account_type?: TCFDPasswordReset['account_group'];

    balance: number;
    platform?: string;
    display_balance: string;
    display_login: string;
    landing_company_short?: 'svg' | 'labuan' | 'bvi' | 'malta' | 'maltainvest' | 'vanuatu';
    login: string;
    market_type?: 'financial' | 'synthetic' | 'all';
};

const mock_connect_props = {
    modules: {
        cfd: {
            dxtrade_tokens: {
                demo: '',
                real: '',
            },
            setMT5TradeAccount: jest.fn(),
        },
    },
    traders_hub: {
        show_eu_related_content: false,
    },
    client: {
        isEligibleForMoreDemoMt5Svg: jest.fn(() => true),
        isEligibleForMoreRealMt5: jest.fn(() => true),
    },
};

const renderOptions = {
    wrapper: ({ children }: { children: JSX.Element }) => (
        <CFDProviders store={mockStore(mock_connect_props)}>{children}</CFDProviders>
    ),
};

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => <div data-testid='mocked_icon'>{props.icon}</div>),
    };
});

describe('CFDAccountCard', () => {
    let props: TCFDAccountCard;

    const synthetic_descriptor = 'Trade CFDs on our synthetic indices that simulate real-world market movement.';
    const financial_descriptor =
        'Trade major (standard & micro-lots) and minor forex, stocks & stock indices, commodities, basket indices, and crypto with high leverage.';

    const mt5_acc: TMockPlatformAccounts = {
        account_type: 'demo',
        balance: 10000,
        platform: 'mt5',
        display_balance: '10000.00',
        display_login: '20103240',
        landing_company_short: 'svg',
        login: 'MTD20103240',
        market_type: 'financial',
    };

    const derivx_acc: TMockPlatformAccounts = {
        account_type: 'demo',
        balance: 10000,
        platform: 'dxtrade',
        display_balance: '10000.00',
        display_login: '20103240',
        landing_company_short: 'svg',
        login: 'MTD20103240',
        market_type: 'financial',
    };

    const mt5_labuan_acc: TMockPlatformAccounts = {
        account_type: 'real',
        balance: 10000,
        platform: 'mt5',
        display_balance: '10000.00',
        display_login: '20103240',
        landing_company_short: 'labuan',
        login: 'MTD20103240',
        market_type: 'financial',
    };

    beforeEach(() => {
        props = {
            button_label: 'Top up',
            commission_message: 'No commission',
            descriptor: '',
            existing_accounts_data: [],
            has_banner: true,
            has_cfd_account_error: false,
            has_real_account: true,
            is_accounts_switcher_on: false,
            is_button_primary: true,
            is_disabled: false,
            is_logged_in: true,
            is_virtual: true,
            specs: {},
            type: { category: '', type: '', platform: '' },
            title: '',
            platform: 'mt5',
            onSelectAccount: jest.fn(),
            onClickFund: jest.fn(),
            onPasswordManager: jest.fn(),
            toggleAccountsDialog: jest.fn(),
            toggleShouldShowRealAccountsList: jest.fn(),
        };
    });

    it('should render the component for Demo MT5 Synthetic account ', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                existing_accounts_data={[mt5_acc]}
            />,
            renderOptions
        );
        expect(screen.getByText(/most popular/i)).toBeInTheDocument();
        expect(screen.getByText(/demo/i)).toBeInTheDocument();
        expect(screen.getByText(/IcMt5SyntheticPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/synthetic/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(/trade cfds on our synthetic indices that simulate real-world market movement./i)
        ).toBeInTheDocument();
        expect(screen.getByText(/20103240/i)).toBeInTheDocument();
        expect(screen.getByText(/usd/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /top up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /trade/i })).toBeInTheDocument();
    });

    it('should display the component for Demo MT5 Financial account ', () => {
        const type = {
            type: 'financial',
            category: 'demo',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={financial_descriptor}
                title='Financial'
                existing_accounts_data={[mt5_acc]}
            />,
            renderOptions
        );
        expect(screen.getByText(/demo/i)).toBeInTheDocument();
        expect(screen.getByText(/IcMt5FinancialPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/financial/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(
                /trade major \(standard & micro-lots\) and minor forex, stocks & stock indices, commodities, basket indices, and crypto with high leverage./i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/20103240/i)).toBeInTheDocument();
        expect(screen.getByText(/usd/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /top up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /trade/i })).toBeInTheDocument();
    });

    it('should render the account card if the user has a Real MT5 Synthetic account', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                existing_accounts_data={[mt5_acc]}
            />,
            renderOptions
        );
        expect(screen.getByText(/most popular/i)).toBeInTheDocument();
        expect(screen.getByText(/IcMt5SyntheticPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/synthetic/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(/trade cfds on our synthetic indices that simulate real-world market movement./i)
        ).toBeInTheDocument();
        expect(screen.getByText(/svg/i)).toBeInTheDocument();
        expect(screen.getByText(/20103240/i)).toBeInTheDocument();
        expect(screen.getByText(/usd/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /top up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /trade/i })).toBeInTheDocument();
    });

    it('should render the account card if the user has a Real MT5 Financial account', () => {
        const type = {
            type: 'financial',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={financial_descriptor}
                title='Financial'
                existing_accounts_data={[mt5_acc]}
            />,
            renderOptions
        );
        expect(screen.getByText(/svg/i)).toBeInTheDocument();
        expect(screen.getByText(/IcMt5FinancialPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/financial/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(
                /trade major \(standard & micro-lots\) and minor forex, stocks & stock indices, commodities, basket indices, and crypto with high leverage./i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/20103240/i)).toBeInTheDocument();
        expect(screen.getByText(/usd/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /top up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /trade/i })).toBeInTheDocument();
    });

    it('should call onClickFund when top up button is clicked', () => {
        const type = {
            type: 'financial',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={financial_descriptor}
                title='Financial'
                existing_accounts_data={[mt5_acc]}
            />,
            renderOptions
        );
        fireEvent.click(screen.getByRole('button', { name: /top up/i }));
        expect(props.onClickFund).toHaveBeenCalledWith(mt5_acc);
    });

    it("should show add account button if the user doesn't have an existing account", () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                existing_accounts_data={[]}
                platform='mt5'
            />,
            renderOptions
        );
        expect(screen.getByText(/add account/i)).toBeInTheDocument();
    });

    it("should show add account button if the user doesn't have an existing account for real account", () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                existing_accounts_data={[]}
                platform='mt5'
            />,
            renderOptions
        );
        expect(screen.getByText(/add account/i)).toBeInTheDocument();
    });

    it('should call onSelectAccount when the add account button is clicked', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                existing_accounts_data={[]}
                platform='mt5'
            />,
            renderOptions
        );
        fireEvent.click(screen.getByText(/add account/i));
        expect(props.onSelectAccount).toHaveBeenCalled();
    });

    it('should show add real acount button and call onSelectAccount if the button is clicked', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                platform='mt5'
                button_label='Add real account'
                existing_accounts_data={null}
            />,
            renderOptions
        );
        const add_real_account_buttons = screen.getAllByRole('button', { name: /add real account/i });
        fireEvent.click(add_real_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalled();
    });

    it('should show add demo account button and call onSelectAccount if the button is clicked', () => {
        const type = {
            type: 'financial',
            category: 'real',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                platform='mt5'
                button_label='Add demo account'
                existing_accounts_data={null}
            />,
            renderOptions
        );
        const add_demo_account_buttons = screen.getAllByRole('button', { name: /add demo account/i });
        fireEvent.click(add_demo_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalled();
    });

    it('should show labuan banner', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'mt5',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                platform='mt5'
                existing_accounts_data={[mt5_labuan_acc]}
            />,
            renderOptions
        );
        expect(screen.getByText(/labuan/i)).toBeInTheDocument();
    });

    it('should show fund transfer button and call onClickFund when the button is clicked', () => {
        const type = {
            type: 'synthetic',
            category: 'real',
            platform: 'dxtrade',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                platform='dxtrade'
            />,
            renderOptions
        );
        fireEvent.click(screen.getByText(/fund transfer/i));
        expect(props.onClickFund).toHaveBeenCalled();
    });

    it('should call onPasswordManager when the password change button icon is clicked', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'dxtrade',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                existing_accounts_data={[derivx_acc]}
                platform='dxtrade'
            />,
            renderOptions
        );
        expect(screen.getByText(/forgot password?/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/forgot password?/i));
        expect(props.onPasswordManager).toHaveBeenCalled();
    });

    it('should render the account card for Demo DerivX Synthetic account ', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'dxtrade',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                existing_accounts_data={[derivx_acc]}
                platform='dxtrade'
            />,
            renderOptions
        );
        expect(screen.getByText(/most popular/i)).toBeInTheDocument();
        expect(screen.getByText(/demo/i)).toBeInTheDocument();
        expect(screen.getByText(/IcDxtradeSyntheticPlatform/i)).toBeInTheDocument();
        expect(screen.getAllByText(/synthetic/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/username/i)).toBeInTheDocument();
        expect(screen.getByText(/mtd20103240/i)).toBeInTheDocument();
        expect(screen.getByText(/forgot password?/i)).toBeInTheDocument();
        expect(screen.getByText(/trade on web terminal/i)).toBeInTheDocument();
    });

    it('should show descriptor and commission message when the user has no existing data and not logged in', () => {
        const type = {
            type: 'synthetic',
            category: 'demo',
            platform: 'dxtrade',
        };
        render(
            <CFDAccountCard
                {...props}
                type={type}
                descriptor={synthetic_descriptor}
                title='Standard'
                existing_accounts_data={null}
                platform='dxtrade'
                is_logged_in={false}
            />,
            renderOptions
        );
        expect(screen.getByText(/most popular/i)).toBeInTheDocument();
        expect(
            screen.getByText(/Trade CFDs on our synthetic indices that simulate real-world market movement/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/no commission/i)).toBeInTheDocument();
    });
});
