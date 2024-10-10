import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import TradingAppCard from '../trading-app-card';

describe('<TradingAppCard/>', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_props: React.ComponentProps<typeof TradingAppCard> = {
        availability: 'Non-EU',
        name: '0.00 USD',
        icon: 'Standard',
        action_type: 'multi-action',
        clickable_icon: false,
        description: 'Trade CFDs on MT5 with synthetics, baskets, and derived FX.',
        is_deriv_platform: false,
        onAction: jest.fn(),
        sub_title: 'Standard',
        has_divider: false,
        platform: 'mt5',
        short_code_and_region: 'SVG',
        mt5_acc_auth_status: 'migrated_with_position',
        selected_mt5_jurisdiction: {
            platform: 'mt5',
            category: 'real',
            type: 'synthetic',
            jurisdiction: 'svg',
        },
        openVerificationDocsListModal: jest.fn(),
        market_type: 'synthetic',
    };

    const store_config = mockStore({
        common: {
            current_language: 'EN',
        },
        traders_hub: {
            is_eu_user: false,
            is_demo_low_risk: false,
            content_flag: 'low_risk_cr_non_eu',
            is_real: true,
        },
        client: {
            mt5_login_list: [
                {
                    market_type: 'synthetic',
                    landing_company_short: 'bvi',
                },
                {
                    market_type: 'synthetic',
                    landing_company_short: 'svg',
                },
            ],
        },
    });

    const renderComponent = ({ props = mock_props }) => {
        render(
            <StoreProvider store={store_config}>
                <TradingAppCard {...props} />
            </StoreProvider>
        );
    };
    it('should render correct status badge if mt5_acc_auth_status value is migrated_with_position', () => {
        renderComponent({ props: mock_props });

        const status_badge = screen.getByText(/No new positions/);
        expect(status_badge).toBeInTheDocument();
    });

    it('should render correct status badge if mt5_acc_auth_status value is migrated_without_position', () => {
        const new_mock_props = {
            ...mock_props,
            mt5_acc_auth_status: 'migrated_without_position',
        };
        renderComponent({ props: new_mock_props });

        const status_badge = screen.getByText(/Account closed/);
        expect(status_badge).toBeInTheDocument();
    });

    it('should open OpenPositionsSVGModal when user clicks on the badge', () => {
        renderComponent({ props: mock_props });

        const status_badge = screen.getByText(/No new positions/);
        userEvent.click(status_badge);

        const modal_content_bvi = screen.getByText(
            /You can no longer open new positions with your MT5 Standard SVG account. Please use your MT5 Standard BVI account to open new positions./
        );
        expect(modal_content_bvi).toBeInTheDocument();
    });

    it('should close OpenPositionsSVGModal when user clicks on the OK', async () => {
        renderComponent({ props: mock_props });

        const status_badge = screen.getByText('No new positions');
        userEvent.click(status_badge);

        const modal_content_bvi = screen.getByText(
            /You can no longer open new positions with your MT5 Standard SVG account. Please use your MT5 Standard BVI account to open new positions./
        );
        const okButton = screen.getByRole('button', { name: /OK/i });
        userEvent.click(okButton);
        await waitFor(() => {
            expect(modal_content_bvi).not.toBeInTheDocument();
        });
    });

    it('should not render status badge if mt5_acc_auth_status value is null', () => {
        const new_mock_props = {
            ...mock_props,
            mt5_acc_auth_status: null,
        };
        renderComponent({ props: new_mock_props });

        expect(screen.queryByText(/In review/)).not.toBeInTheDocument();
        expect(screen.queryByText(/No new positions/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Account closed/)).not.toBeInTheDocument();
    });
});
