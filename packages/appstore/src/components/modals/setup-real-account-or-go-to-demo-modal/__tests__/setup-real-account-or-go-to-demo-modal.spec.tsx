import React from 'react';
import SetupRealAccountOrGoToDemoModal from '../setup-real-account-or-go-to-demo-modal';
import { render, screen } from '@testing-library/react';
import { Analytics } from '@deriv-com/analytics';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('@deriv-com/analytics', () => ({
    ...jest.requireActual('@deriv-com/analytics'),
    Analytics: {
        trackEvent: jest.fn(),
    },
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Modal: jest.fn(() => <div>desktop modal</div>),
    MobileDialog: jest.fn(() => <div>responsive modal</div>),
}));

jest.mock('../setup-real-account-or-go-to-demo-modal-content', () => ({
    __esModule: true,
    default: () => undefined,
    SetupRealAccountOrGoToDemoModalContent: () => 'Content',
}));

describe('SetupRealAccountOrGoToDemoModal', () => {
    const mockDefault = mockStore({});

    const wrapper = (mock: ReturnType<typeof mockStore> = mockDefault) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    it('should render correctly in desktop', () => {
        const { container } = render(<SetupRealAccountOrGoToDemoModal />, {
            wrapper: wrapper(),
        });

        expect(container).toBeInTheDocument();
        expect(screen.getByText(/desktop modal/i)).toBeInTheDocument();
    });

    it('should render correctly in responsive', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });

        const { container } = render(<SetupRealAccountOrGoToDemoModal />, {
            wrapper: wrapper(),
        });

        expect(container).toBeInTheDocument();
        expect(screen.getByText(/responsive modal/i)).toBeInTheDocument();
    });

    it('Analytics should be called one time if "is_setup_real_account_or_go_to_demo_modal_visible" = true', () => {
        const mock = mockStore({ traders_hub: { is_setup_real_account_or_go_to_demo_modal_visible: true } });

        const mockTrack = Analytics.trackEvent;

        render(<SetupRealAccountOrGoToDemoModal />, {
            wrapper: wrapper(mock),
        });

        expect(mockTrack).toBeCalledTimes(1);
    });
});
