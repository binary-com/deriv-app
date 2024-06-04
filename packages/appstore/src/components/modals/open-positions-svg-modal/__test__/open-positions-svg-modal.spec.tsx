import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import OpenPositionsSVGModal from '../open-positions-svg-modal';
import { TStores } from '@deriv/stores/types';

describe('<OpenPositionsSVGModal/>', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_props: React.ComponentProps<typeof OpenPositionsSVGModal> = {
        market_type: 'financial',
        status: 'migrated_with_position',
        is_modal_open: true,
        setModalOpen: jest.fn(),
    };

    const store_config = mockStore({
        client: {
            mt5_login_list: [
                {
                    market_type: 'financial',
                    landing_company_short: 'bvi',
                },
                {
                    market_type: 'financial',
                    landing_company_short: 'svg',
                },
            ],
        },
    });

    const renderComponent = ({ props = mock_props, store = store_config }) => {
        return render(
            <StoreProvider store={store}>
                <OpenPositionsSVGModal {...props} />
            </StoreProvider>
        );
    };

    it('should render open_order_position_status modal', () => {
        const { container } = renderComponent({ props: mock_props });
        expect(container).toBeInTheDocument();
    });

    it('should render title correctly when status is migrated_with_position', () => {
        renderComponent({ props: mock_props });

        const modal_title = screen.getByText(/No new positions/i);
        expect(modal_title).toBeInTheDocument();
    });

    it('should render title correctly when status is migrated_without_position', () => {
        const new_mock_props: React.ComponentProps<typeof OpenPositionsSVGModal> = {
            ...mock_props,
            market_type: 'financial',
            status: 'migrated_without_position',
        };
        renderComponent({ props: new_mock_props });

        const modal_title = screen.getByText(/Account closed/i);
        expect(modal_title).toBeInTheDocument();
    });

    it('should render modal content correctly when status is migrated_with_position and user migrates to BVI', () => {
        renderComponent({ props: mock_props });
        const modal_content_bvi = screen.getByText(
            /You can no longer open new positions with your MT5 Financial SVG account. Please use your MT5 Financial BVI account to open new positions./
        );
        expect(modal_content_bvi).toBeInTheDocument();
    });

    it('should render modal content correctly when status is migrated_with_position and user migrates to Vanuatu', () => {
        const new_store: TStores = {
            ...store_config,
            client: {
                ...store_config.client,
                mt5_login_list: [
                    {
                        market_type: 'financial',
                        landing_company_short: 'vanuatu',
                    },
                    {
                        market_type: 'financial',
                        landing_company_short: 'svg',
                    },
                ],
            },
        };

        const new_mock_props: React.ComponentProps<typeof OpenPositionsSVGModal> = {
            ...mock_props,
            market_type: 'financial',
        };
        renderComponent({ props: new_mock_props, store: new_store });
        const modal_content_vanuatu = screen.getByText(
            /You can no longer open new positions with your MT5 Financial SVG account. Please use your MT5 Financial Vanuatu account to open new positions./
        );
        expect(modal_content_vanuatu).toBeInTheDocument();
    });

    it('should render modal content correctly when status is migrated_with_position and market_type is derived', () => {
        const new_store: TStores = {
            ...store_config,
            client: {
                ...store_config.client,
                mt5_login_list: [
                    {
                        market_type: 'synthetic',
                        landing_company_short: 'vanuatu',
                    },
                    {
                        market_type: 'synthetic',
                        landing_company_short: 'bvi',
                    },
                    {
                        market_type: 'financial',
                        landing_company_short: 'svg',
                    },
                    {
                        market_type: 'synthetic',
                        landing_company_short: 'svg',
                    },
                ],
            },
        };
        const mock_props_derived: React.ComponentProps<typeof OpenPositionsSVGModal> = {
            ...mock_props,
            market_type: 'synthetic',
        };
        renderComponent({ props: mock_props_derived, store: new_store });

        const modal_content_derived = screen.getByText(
            /You can no longer open new positions with your MT5 Derived SVG account. Please use your MT5 Derived Vanuatu or MT5 Derived BVI account to open new positions./
        );
        expect(modal_content_derived).toBeInTheDocument();
    });

    it('should render modal content correctly when status is migrated_without_position and market_type is derived', () => {
        const new_mock_props: React.ComponentProps<typeof OpenPositionsSVGModal> = {
            ...mock_props,
            market_type: 'synthetic',
            status: 'migrated_without_position',
        };
        renderComponent({ props: new_mock_props });
        const modal_content = screen.getByText(
            /Your MT5 Derived SVG account will be archived after 30 days of inactivity. You can still access your trade history until the account is archived./
        );
        expect(modal_content).toBeInTheDocument();
    });

    it('should render modal content correctly when status is migrated_without_position and market_type is financial', () => {
        const new_mock_props: React.ComponentProps<typeof OpenPositionsSVGModal> = {
            ...mock_props,
            market_type: 'financial',
            status: 'migrated_without_position',
        };
        renderComponent({ props: new_mock_props });
        const modal_content = screen.getByText(
            /Your MT5 Financial SVG account will be archived after 30 days of inactivity. You can still access your trade history until the account is archived./
        );
        expect(modal_content).toBeInTheDocument();
    });

    it('should render proper buttons', () => {
        renderComponent({ props: mock_props });
        const okButton = screen.getByRole('button', { name: /OK/i });
        expect(okButton).toBeInTheDocument();
    });

    it('should call setModalOpen on OK button click', () => {
        renderComponent({ props: mock_props });
        const okButton = screen.getByRole('button', { name: /OK/i });
        userEvent.click(okButton);
        expect(mock_props.setModalOpen).toHaveBeenCalledTimes(1);
    });
});
