import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Loadable from 'react-loadable';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TRADE_TYPES } from '@deriv/shared';
import { CONTRACT_LIST, AVAILABLE_CONTRACTS } from 'AppV2/Utils/trade-types-utils';
import { TERM } from 'AppV2/Utils/contract-description-utils';
import TraderProviders from '../../../../trader-providers';
import Guide from '../guide';

const trade_types = 'Trade types';

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

Loadable.preloadAll();

describe('Guide', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: { trade: { contract_type: TRADE_TYPES.RISE_FALL, is_vanilla: false } },
        });
    });
    const renderGuide = (
        mockProps: React.ComponentProps<typeof Guide> = { has_label: true, show_guide_for_selected_contract: false }
    ) => {
        render(
            <StoreProvider store={default_mock_store}>
                <TraderProviders store={default_mock_store}>
                    <Guide {...mockProps} />
                </TraderProviders>
            </StoreProvider>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render component with label and if user clicks on it, should show available contract information', () => {
        renderGuide();

        expect(screen.getByText('Guide')).toBeInTheDocument();

        userEvent.click(screen.getByRole('button'));

        expect(screen.getByText(trade_types)).toBeInTheDocument();
        AVAILABLE_CONTRACTS.forEach(({ id }) => expect(screen.getByText(id)).toBeInTheDocument());
    });

    it('should render component without label if has_label === false and if user clicks on it, should show available contract information', () => {
        renderGuide({ has_label: false });

        expect(screen.queryByText('Guide')).not.toBeInTheDocument();

        userEvent.click(screen.getByRole('button'));

        expect(screen.getByText(trade_types)).toBeInTheDocument();
        AVAILABLE_CONTRACTS.forEach(({ id }) => expect(screen.getByText(id)).toBeInTheDocument());
    });

    it('should render component with description for only for selected trade type if show_guide_for_selected_contract === true', () => {
        renderGuide({ show_guide_for_selected_contract: true });

        userEvent.click(screen.getByRole('button'));

        expect(screen.queryByText(trade_types)).not.toBeInTheDocument();
        expect(screen.getByText(CONTRACT_LIST.RISE_FALL)).toBeInTheDocument();

        AVAILABLE_CONTRACTS.forEach(({ id }) =>
            id === CONTRACT_LIST.RISE_FALL
                ? expect(screen.getByText(id)).toBeInTheDocument()
                : expect(screen.queryByText(id)).not.toBeInTheDocument()
        );
    });

    it('should render component with correct title description for Vanillas if show_guide_for_selected_contract === true and is_vanilla === true', () => {
        default_mock_store.modules.trade.is_vanilla = true;
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.VANILLA;

        renderGuide({ show_guide_for_selected_contract: true });

        userEvent.click(screen.getByRole('button'));

        expect(screen.queryByText(trade_types)).not.toBeInTheDocument();
        expect(screen.getByText(CONTRACT_LIST.VANILLAS)).toBeInTheDocument();

        AVAILABLE_CONTRACTS.forEach(({ id }) =>
            id === CONTRACT_LIST.VANILLAS
                ? expect(screen.getByText(id)).toBeInTheDocument()
                : expect(screen.queryByText(id)).not.toBeInTheDocument()
        );
    });

    it('should render term definition if user clicked on it', () => {
        renderGuide();

        const term_definition = 'You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.';
        expect(screen.queryByText(term_definition)).not.toBeInTheDocument();

        userEvent.click(screen.getByText('Guide'));
        userEvent.click(screen.getByText(CONTRACT_LIST.ACCUMULATORS));
        userEvent.click(screen.getByRole('button', { name: TERM.GROWTH_RATE.toLowerCase() }));

        expect(screen.getByText(term_definition)).toBeInTheDocument();
    });
});
