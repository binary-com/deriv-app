import { screen, render } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import Onboarding from '../onboarding';

// Mock TradingPlatformIcon component
jest.mock('Assets/svgs/trading-platform', () => ({
    __esModule: true,
    default: () => <div>DerivLogo</div>,
}));

describe('EmptyOnboarding test cases:', () => {
    it('Should render Deriv Logo inside the component', () => {
        const mock = mockStore({
            client: {
                is_logged_in: false,
                is_landing_company_loaded: false,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<Onboarding />, {
            wrapper,
        });
        expect(screen.getByTestId('dt_onboarding_logo')).toBeInTheDocument();
    });
});
