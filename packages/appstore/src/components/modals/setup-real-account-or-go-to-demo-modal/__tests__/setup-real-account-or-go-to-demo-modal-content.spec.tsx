import React from 'react';
import { SetupRealAccountOrGoToDemoModalContent } from '../setup-real-account-or-go-to-demo-modal-content';
import { render, screen } from '@testing-library/react';
import { Analytics } from '@deriv-com/analytics';
import { useContentFlag } from '@deriv/hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';
import { Jurisdiction } from '@deriv/shared';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useContentFlag: jest.fn(() => ({ is_cr_demo: true, is_eu_demo: false })),
}));

jest.mock('@deriv-com/analytics', () => ({
    ...jest.requireActual('@deriv-com/analytics'),
    Analytics: {
        trackEvent: jest.fn(),
    },
}));

describe('SetupRealAccountOrGoToDemoModalContent', () => {
    const mockedOpenRealAccountSignup = jest.fn();
    const mockedSetIsFromSignupAccount = jest.fn();
    const mockedSetIsSetupRealAccountOrGoToDemoModalVisible = jest.fn();
    const mockTrack = Analytics.trackEvent;

    const mockDefault = mockStore({
        ui: {
            is_from_signup_account: true,
            openRealAccountSignup: mockedOpenRealAccountSignup,
            setIsFromSignupAccount: mockedSetIsFromSignupAccount,
        },
        traders_hub: {
            is_setup_real_account_or_go_to_demo_modal_visible: true,
            setIsSetupRealAccountOrGoToDemoModalVisible: mockedSetIsSetupRealAccountOrGoToDemoModalVisible,
        },
    });

    const wrapper = (mock: ReturnType<typeof mockStore> = mockDefault) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should render correctly in desktop', () => {
        const { container } = render(<SetupRealAccountOrGoToDemoModalContent />, {
            wrapper: wrapper(),
        });

        const title = screen.getByText(/start your trading journey/i);

        expect(container).toBeInTheDocument();
        expect(title).toBeInTheDocument();
    });

    it('Should render correctly in responsive', () => {
        const { container } = render(<SetupRealAccountOrGoToDemoModalContent is_responsive />, {
            wrapper: wrapper(),
        });

        const title = screen.getByText(/start your trading journey/i);

        expect(container).toBeInTheDocument();
        expect(title).toBeInTheDocument();
    });

    it('User click "setup real account" button when is_cr_demo = true', () => {
        (useContentFlag as jest.Mock).mockReturnValue({ is_cr_demo: true, is_eu_demo: false });

        const { container } = render(<SetupRealAccountOrGoToDemoModalContent />, {
            wrapper: wrapper(),
        });

        const setup_btn = screen.getByRole('button', {
            name: /set up your real account/i,
        });

        expect(container).toBeInTheDocument();

        userEvent.click(setup_btn);

        expect(mockTrack).toBeCalledTimes(1);

        expect(mockedOpenRealAccountSignup).toBeCalledTimes(1);
        expect(mockedOpenRealAccountSignup).toBeCalledWith(Jurisdiction.SVG);

        expect(mockedSetIsFromSignupAccount).toBeCalledTimes(1);
        expect(mockedSetIsFromSignupAccount).toBeCalledWith(false);

        expect(mockedSetIsSetupRealAccountOrGoToDemoModalVisible).toBeCalledTimes(1);
        expect(mockedSetIsSetupRealAccountOrGoToDemoModalVisible).toBeCalledWith(false);
    });

    it('User click "setup real account" button when is_eu_demo = true', () => {
        (useContentFlag as jest.Mock).mockReturnValue({ is_cr_demo: false, is_eu_demo: true });

        const { container } = render(<SetupRealAccountOrGoToDemoModalContent />, {
            wrapper: wrapper(),
        });

        const setup_btn = screen.getByRole('button', {
            name: /set up your real account/i,
        });

        expect(container).toBeInTheDocument();

        userEvent.click(setup_btn);

        expect(mockTrack).toBeCalledTimes(1);

        expect(mockedOpenRealAccountSignup).toBeCalledTimes(1);
        expect(mockedOpenRealAccountSignup).toBeCalledWith(Jurisdiction.MALTA_INVEST);

        expect(mockedSetIsFromSignupAccount).toBeCalledTimes(1);
        expect(mockedSetIsFromSignupAccount).toBeCalledWith(false);

        expect(mockedSetIsSetupRealAccountOrGoToDemoModalVisible).toBeCalledTimes(1);
        expect(mockedSetIsSetupRealAccountOrGoToDemoModalVisible).toBeCalledWith(false);
    });

    it('User click "take me to demo" button', () => {
        const { container } = render(<SetupRealAccountOrGoToDemoModalContent />, {
            wrapper: wrapper(),
        });

        const demo_btn = screen.getByRole('button', {
            name: /take me to demo/i,
        });

        expect(container).toBeInTheDocument();

        userEvent.click(demo_btn);

        expect(mockTrack).toBeCalledTimes(1);

        expect(mockedSetIsFromSignupAccount).toBeCalledTimes(1);
        expect(mockedSetIsFromSignupAccount).toBeCalledWith(false);

        expect(mockedSetIsSetupRealAccountOrGoToDemoModalVisible).toBeCalledTimes(1);
        expect(mockedSetIsSetupRealAccountOrGoToDemoModalVisible).toBeCalledWith(false);
    });
});
