import React from 'react';
import { render, screen } from '@testing-library/react';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { isDesktop, isMobile } from '@deriv/shared';
import TwoFactorDisabled from '../two-factor-disabled';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

jest.mock('qrcode.react', () => jest.fn(() => <div>QRCode</div>));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

describe('<TwoFactorDisabled />', () => {
    const mock_props: React.ComponentProps<typeof TwoFactorDisabled> = {
        secret_key: 'hello123',
        qr_secret_key: '3535',
        is_loading_secret: false,
    };

    const store = mockStore({
        client: {
            has_enabled_two_fa: false,
        },
    });

    const renderComponent = ({ store_config = store, mock = mock_props }) => {
        return render(
            <APIProvider>
                <StoreProvider store={store_config}>
                    <TwoFactorDisabled {...mock} />
                </StoreProvider>
            </APIProvider>
        );
    };

    it('should render TwoFactorDisabled component if has_enabled_two_fa is false', () => {
        renderComponent({ store_config: store });

        const setup_title = screen.getByText(/How to set up 2FA for your Deriv account/i);
        expect(setup_title).toBeInTheDocument();
    });

    it('should render timeline_1 component title ', () => {
        renderComponent({ store_config: store });

        const timeline_title_1 = screen.getByText(/Scan the QR code below with your 2FA app. We recommend./i);
        const authy_link = screen.getByRole('link', { name: 'Authy' });
        const google_authenticator_link = screen.getByRole('link', { name: 'Google Authenticator' });

        expect(timeline_title_1).toBeInTheDocument();
        expect(authy_link).toHaveAttribute('href', 'https://authy.com/');
        expect(google_authenticator_link).toHaveAttribute(
            'href',
            'https://github.com/google/google-authenticator/wiki#implementations'
        );
    });

    it('should render QR code', () => {
        renderComponent({ store_config: store });

        const qr_code = screen.getByText('QRCode');
        expect(qr_code).toBeInTheDocument();
    });

    it('should render clipboard component to setup 2FA', () => {
        renderComponent({ store_config: store });

        const helper_text = screen.getByText(
            /If you are unable to scan the QR code, you can manually enter this code instead:/i
        );
        const secret_text = screen.getByText('hello123');
        const clipboard_component = screen.getByTestId('2fa_clipboard');

        expect(helper_text).toBeInTheDocument();
        expect(secret_text).toBeInTheDocument();
        expect(clipboard_component).toBeInTheDocument();
    });

    it('should render step-2 title for setting up 2FA', () => {
        renderComponent({ store_config: store });

        const step_2_title = screen.getByText(/Enter the authentication code generated by your 2FA app:/i);
        expect(step_2_title).toBeInTheDocument();
    });

    it('should render digitform component if 2FA is disabled', () => {
        renderComponent({ store_config: store });

        const digitform = screen.getByTestId('digitform_2fa_disabled');
        expect(digitform).toBeInTheDocument();
    });

    it('should render 2FA article component for mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);

        renderComponent({ store_config: store });

        const article_component = screen.getByText('Two-factor authentication (2FA)');
        expect(article_component).toBeInTheDocument();
    });

    it('should render 2FA article component for desktop', () => {
        (isMobile as jest.Mock).mockReturnValue(false);
        (isDesktop as jest.Mock).mockReturnValue(true);

        renderComponent({ store_config: store });

        const article_component = screen.getByText('Two-factor authentication (2FA)');
        expect(article_component).toBeInTheDocument();
    });

    it('should render Loader component if is_loading_secret is true', () => {
        const new_mock_props = {
            ...mock_props,
            is_loading_secret: true,
        };

        renderComponent({ store_config: store, mock: new_mock_props });
        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });
});
