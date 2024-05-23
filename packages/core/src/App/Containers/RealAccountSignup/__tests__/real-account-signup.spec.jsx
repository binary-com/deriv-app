import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import RealAccountSignup from '../real-account-signup.jsx';
import { StoreProvider, mockStore } from '@deriv/stores';
import { Analytics } from '@deriv-com/analytics';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Modal: () => <div>RealAccountModalContent</div>,
    DesktopWrapper: jest.fn(({ children }) => (
        <div>
            <div>{children}</div>
        </div>
    )),
    MobileWrapper: jest.fn(({ children }) => (
        <div>
            <div>{children}</div>
        </div>
    )),
}));

jest.mock('@deriv/account', () => {
    const original_module = jest.requireActual('@deriv/account');
    return {
        ...original_module,
        TestWarningModal: () => <div>TestWarningModal</div>,
    };
});

jest.mock('../account-wizard.jsx', () => ({
    __esModule: true,
    default: () => <div>Account Wizard</div>,
}));

describe('<RealAccountSignup />', () => {
    const store = mockStore({
        client: {
            available_crypto_currencies: [],
            currency: 'USD',
            fetchAccountSettings: jest.fn(),
            residence: 'gb',
            has_active_real_account: false,
            has_fiat: false,
            is_from_restricted_country: false,
            realAccountSignup: jest.fn(),
            redirectToLegacyPlatform: jest.fn(),
        },
        traders_hub: {
            show_eu_related_content: true,
        },
        modules: {
            cashier: {
                general_store: {
                    deposit_target: '',
                    setIsDeposit: jest.fn(),
                },
            },
        },
        ui: {
            closeRealAccountSignup: jest.fn(),
            deposit_real_account_signup_target: 'mf',
            is_real_acc_signup_on: true,
            real_account_signup_target: 'maltainvest',
            setIsTradingAssessmentForNewUserEnabled: jest.fn(),
            setIsClosingCreateRealAccountModal: jest.fn(),
            setRealAccountSignupParams: jest.fn(),
            setShouldShowAppropriatenessWarningModal: jest.fn(),
            setShouldShowRiskWarningModal: jest.fn(),
            setShouldShowVerifiedAccount: jest.fn(),
            should_show_all_available_currencies: true,
            should_show_appropriateness_warning_modal: false,
            should_show_risk_warning_modal: false,
            real_account_signup: {
                active_modal_index: -1,
                previous_currency: '',
                current_currency: '',
                success_message: '',
                error_message: '',
            },
            is_trading_assessment_for_new_user_enabled: false,
        },
        fetchFinancialAssessment: jest.fn(),
        setCFDScore: jest.fn(),
    });
    const renderComponent = (mock_store = mockStore({})) => {
        return render(
            <StoreProvider store={mock_store}>
                <BrowserRouter>
                    <RealAccountSignup />
                </BrowserRouter>
            </StoreProvider>
        );
    };

    it('should render RealAccountSignupModal if is_real_account_signup is true', () => {
        renderComponent(store);
        expect(screen.getByText('RealAccountModalContent')).toBeInTheDocument();
    });

    it('should call Analytics.trackEvent on mount if real account signup target is not maltainvest', () => {
        const updatedStore = {
            ...store,
            ui: {
                ...store.ui,
                real_account_signup_target: 'svg',
            },
        };
        renderComponent(updatedStore);
        expect(Analytics.trackEvent).toHaveBeenCalled();
    });

    it('should render TestWarningModal if should_show_appropriateness_warning_modal is set to true', () => {
        const updatedStore = {
            ...store,
            ui: {
                ...store.ui,
                should_show_appropriateness_warning_modal: true,
            },
        };
        renderComponent(updatedStore);
        expect(screen.getByText('TestWarningModal')).toBeInTheDocument();
        expect(screen.queryByText('RealAccountModalContent')).not.toBeInTheDocument();
    });
});
