import React from 'react';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { useDevice } from '@deriv/hooks';
import { mockStore } from '@deriv/stores';
import { Router } from 'react-router';
import { toMoment } from '@deriv/shared';
import ContractDrawer from '../contract-drawer';
import TraderProviders from '../../../../../trader-providers';
import userEvent from '@testing-library/user-event';

const mocked_props: React.ComponentProps<typeof ContractDrawer> = {
    contract_info: {},
    is_accumulator: false,
    is_dark_theme: false,
    is_market_closed: false,
    is_multiplier: false,
    is_vanilla: false,
    is_sell_requested: false,
    is_turbos: false,
    onClickCancel: jest.fn(),
    onClickSell: jest.fn(),
    toggleHistoryTab: jest.fn(),
    contract_update: undefined,
    contract_update_history: [],
};

const contract_audit = 'Contract Audit';
const contract_drawer_card = 'Contract Drawer Card';

const withRouter = <T extends object>(Component: React.ComponentType<T>) => {
    const history = createBrowserHistory();
    const WrapperComponent = <U extends object>(props: T & U) => (
        <Router history={history}>
            <Component {...props} />
        </Router>
    );

    return WrapperComponent;
};
const ContractDrawerComponent = withRouter(ContractDrawer);

const default_mock_store = {
    common: {
        server_time: toMoment(),
    },
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getEndTime: jest.fn(() => true),
    isUserSold: jest.fn(() => true),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('react-transition-group', () => ({
    ...jest.requireActual('@deriv/shared'),
    CSSTransition: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('App/Components/Elements/ContentLoader', () => ({
    ...jest.requireActual('App/Components/Elements/ContentLoader'),
    PositionsCardLoader: jest.fn(() => <div>Position Card Loader</div>),
}));
jest.mock('App/Components/Elements/ContractAudit', () => jest.fn(() => <div>{contract_audit}</div>));
jest.mock('../contract-drawer-card', () =>
    jest.fn(props => (
        <div>
            {contract_drawer_card}
            <button onClick={props.onSwipedUp}>onSwipedUp</button>
            <button onClick={props.onSwipedDown}>onSwipedDown</button>
            <button onClick={props.toggleContractAuditDrawer}>toggleContractAuditDrawer</button>
        </div>
    ))
);

describe('<ContractDrawer />', () => {
    const mockContractDrawer = (mocked_params: React.ComponentProps<typeof ContractDrawer>) => {
        return (
            <TraderProviders store={mockStore(default_mock_store)}>
                <ContractDrawerComponent {...mocked_params} />
            </TraderProviders>
        );
    };
    it('should not render component if there is no contract_info', () => {
        const { container } = render(mockContractDrawer(mocked_props));

        expect(container).toBeEmptyDOMElement();
    });
    it('should render PositionsCardLoader component if  contract_info.status || contract_info.is_expired are falsy', () => {
        mocked_props.contract_info = { status: null, is_expired: 0 };
        render(mockContractDrawer(mocked_props));

        expect(screen.getByText('Position Card Loader')).toBeInTheDocument();
        expect(screen.queryByText(contract_drawer_card)).not.toBeInTheDocument();
        expect(screen.queryByText(contract_audit)).not.toBeInTheDocument();
    });
    it('should render component with Contract Drawer card and Contract Audit', () => {
        mocked_props.contract_info = {
            currency: 'USD',
            exit_tick_display_value: '2021.56',
            is_sold: 1,
            status: null,
            is_expired: 1,
        };
        render(mockContractDrawer(mocked_props));

        expect(screen.getByText(contract_drawer_card)).toBeInTheDocument();
        expect(screen.getByText(contract_audit)).toBeInTheDocument();
    });
    it('should render only Contract Drawer card by default on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        mocked_props.is_multiplier = true;
        render(mockContractDrawer(mocked_props));

        expect(screen.getByText(contract_drawer_card)).toBeInTheDocument();
        expect(screen.queryByText(contract_audit)).not.toBeInTheDocument();
    });
    it('should render contract_audit if user click on Contract Drawer card on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        const { rerender } = render(mockContractDrawer(mocked_props));
        expect(screen.queryByText(contract_audit)).not.toBeInTheDocument();

        userEvent.click(screen.getByText('toggleContractAuditDrawer'));
        rerender(mockContractDrawer(mocked_props));

        expect(screen.getByText(contract_audit)).toBeInTheDocument();
    });
    it('contract_audit appeared and then be hidden if user swiped up and then swiped down on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        const { rerender } = render(mockContractDrawer(mocked_props));
        expect(screen.queryByText(contract_audit)).not.toBeInTheDocument();

        userEvent.click(screen.getByText('onSwipedUp'));
        rerender(mockContractDrawer(mocked_props));
        expect(screen.getByText(contract_audit)).toBeInTheDocument();

        userEvent.click(screen.getByText('onSwipedDown'));
        rerender(mockContractDrawer(mocked_props));
        expect(screen.queryByText(contract_audit)).not.toBeInTheDocument();
    });
});
