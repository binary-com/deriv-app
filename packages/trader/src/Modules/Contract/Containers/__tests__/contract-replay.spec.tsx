import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractReplay from '../contract-replay';
import { Router } from 'react-router-dom';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';
import { createMemoryHistory } from 'history';
import { isDesktop, isMobile } from '@deriv/shared';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    FadeWrapper: jest.fn(({ children }) => <div>{children}</div>),
    UnsupportedContractModal: jest.fn(() => <div>UnsupportedContractModal</div>),
    PageOverlay: jest.fn(({ children, id, header }) => (
        <div data-testid={id}>
            {header}
            {children}
        </div>
    )),
    Div100vhContainer: jest.fn(({ children }) => <div>{children}</div>),
    ContractDrawer: jest.fn(() => <div>ContractDrawer</div>),
}));

jest.mock('../contract-replay-widget', () => ({
    DigitsWidget: jest.fn(() => <div>DigitsWidget</div>),
    InfoBoxWidget: jest.fn(() => <div>InfoBoxWidget</div>),
}));

jest.mock('../replay-chart', () => jest.fn(() => <div>ReplayChart</div>));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useFeatureFlags: jest.fn(() => ({})),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

const MockContractReplay = ({ store }: { store?: any }) => {
    const history = createMemoryHistory();
    history.push('/contract/123');

    return (
        <TraderProviders store={store}>
            <Router history={history}>
                <ContractReplay contract_id={123} />
            </Router>
        </TraderProviders>
    );
};

describe('<ContractReplay>', () => {
    const mocked_store = mockStore({
        contract_replay: {
            contract_store: {
                contract_info: {
                    underlying: '1HZ100V',
                    contract_type: 'VANILLA',
                },
            },
            is_market_closed: false,
            is_sell_requested: false,
            onClickCancel: jest.fn(),
            onClickSell: jest.fn(),
            onMount: jest.fn(),
            onUnmount: jest.fn(),
            is_chart_loading: false,
            is_forward_starting: false,
        },
        ui: { notification_messages_ui: 'div' },
    });

    it('renders the ContractReplay component with basic structure', () => {
        (isMobile as jest.Mock).mockReturnValue(false);
        (isDesktop as jest.Mock).mockReturnValue(true);
        render(<MockContractReplay store={mocked_store} />);

        expect(screen.getByText('Contract details')).toBeInTheDocument();
        expect(screen.getByTestId('dt_replay_chart_container')).toBeInTheDocument();
        expect(screen.getByTestId('dt_contract_replay_container')).toBeInTheDocument();
    });

    it('shows ChartLoader while chart is loading', () => {
        mocked_store.contract_replay.is_chart_loading = true;

        render(<MockContractReplay store={mocked_store} />);

        expect(screen.getByTestId('dt_barspinner')).toBeInTheDocument();
    });

    it('renders DigitsWidget and SwipeableWrapper on Mobile for Digits contracts', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);

        mocked_store.contract_replay.contract_store.contract_info.contract_type = 'DIGITODD';
        mocked_store.contract_replay.contract_store.is_digit_contract = true;
        mocked_store.contract_replay.is_chart_loading = false;

        render(<MockContractReplay store={mocked_store} />);

        expect(screen.getByText('DigitsWidget')).toBeInTheDocument();
        expect(screen.getByTestId('dt_replay_chart_swipeable_wrapper')).toBeInTheDocument();
    });
});
