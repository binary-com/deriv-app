import React from 'react';
import { render, screen } from '@testing-library/react';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import Passwords from '../passwords';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    BrandDerivLogoCoralIcon: () => 'BrandDerivLogoCoralIcon',
}));

describe('<Passwords />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const store = mockStore({});

    const renderComponent = ({ store_config = store }) => {
        return render(
            <APIProvider>
                <StoreProvider store={store_config}>
                    <Passwords />
                </StoreProvider>
            </APIProvider>
        );
    };

    it('should render Email and password section', () => {
        const store_config = mockStore({
            client: { is_dxtrade_password_not_set: true, is_mt5_password_not_set: true },
        });
        renderComponent({ store_config });

        expect(screen.getByText('Email address')).toBeInTheDocument();
        expect(screen.getByText('BrandDerivLogoCoralIcon')).toBeInTheDocument();
    });

    it('should render MT5 platform section', async () => {
        const store_config = mockStore({
            client: { is_dxtrade_password_not_set: true },
        });
        renderComponent({ store_config });

        const ele_mt5 = await screen.findByText('Deriv MT5 Password');
        expect(ele_mt5).toBeInTheDocument();
    });

    it('should render DerivX platform section', async () => {
        const store_config = mockStore({
            client: { is_mt5_password_not_set: true },
        });
        renderComponent({ store_config });

        const ele_derivx = await screen.findByText('Deriv X Password');
        expect(ele_derivx).toBeInTheDocument();
    });
});
