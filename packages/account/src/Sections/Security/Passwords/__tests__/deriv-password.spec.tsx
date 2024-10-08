import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DerivPassword from '../deriv-password';
import { APIProvider, useVerifyEmail } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    BrandDerivLogoCoralIcon: () => 'BrandDerivLogoCoralIcon',
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useVerifyEmail: jest.fn(() => ({ mutate: jest.fn() })),
}));

describe('<DerivPassword />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const store = mockStore({ client: { email: 'mf@deriv.com' } });

    const renderComponent = ({ store_config = store }) =>
        render(
            <APIProvider>
                <StoreProvider store={store_config}>
                    <DerivPassword />
                </StoreProvider>
            </APIProvider>
        );

    it('Should render properly', async () => {
        renderComponent({});

        expect(
            screen.getByRole('heading', {
                name: /deriv password/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /use your to log in to deriv\.com, deriv go, deriv trader, smarttrader, deriv bot and deriv ctrader\./i
            )
        ).toBeInTheDocument();
        expect(screen.queryByText(/BrandDerivLogoCoralIcon/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
        expect(screen.queryByText(/unlink from/i)).not.toBeInTheDocument();

        const popover_wrapper = screen.getAllByTestId('dt_popover_wrapper');
        expect(popover_wrapper).toHaveLength(5);
    });

    it('displays the correct platform information for non-MF clients & restricted countries', () => {
        const store_config = mockStore({
            traders_hub: { financial_restricted_countries: true },
        });
        renderComponent({ store_config });

        expect(screen.getByText(/use your to log in to deriv\.com, deriv trader and deriv go\./i));

        const popover_wrapper = screen.getAllByTestId('dt_popover_wrapper');
        // expect popover to have length of 4
        expect(popover_wrapper).toHaveLength(3);
        // expect button with text change password to be in the document
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('displays the correct platform information for MF clients', () => {
        const store_config = mockStore({
            traders_hub: { is_eu_user: true },
        });
        renderComponent({ store_config });

        expect(screen.getByText(/use your to log in to deriv\.com and deriv trader\./i)).toBeInTheDocument();

        const popover_wrapper = screen.getByTestId('dt_popover_wrapper');

        expect(popover_wrapper).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('displays a change password button for non-social signups', () => {
        renderComponent({});
        const change_password_button = screen.getByRole('button', {
            name: /change password/i,
        });

        expect(change_password_button).toBeInTheDocument();
    });

    it('should invoke verifyEmail when change password is clicked', async () => {
        renderComponent({});
        const ele_change_btn = screen.getByRole('button', {
            name: /change password/i,
        });
        fireEvent.click(ele_change_btn);
        expect(screen.queryByText(/we’ve sent you an email/i)).toBeInTheDocument();
        expect(screen.getByText(/please click on the link in the email to reset your password\./i)).toBeInTheDocument();
        await waitFor(() => {
            expect(useVerifyEmail).toHaveBeenCalled();
        });
    });

    it('displays a button to unlink social identity provider', () => {
        const store_config = mockStore({ client: { is_social_signup: true, social_identity_provider: 'apple' } });
        renderComponent({ store_config });

        const unlink_button = screen.getByText(/unlink from/i);

        expect(unlink_button).toBeInTheDocument();
    });
});
