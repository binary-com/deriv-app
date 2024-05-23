import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { History, createMemoryHistory } from 'history';
import Reports from '../reports';
import { Analytics } from '@deriv-com/analytics';
import { StoreProvider, mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv-com/analytics', () => ({
    Analytics: {
        trackEvent: jest.fn(),
    },
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getSelectedRoute: jest.fn(({ routes, pathname }) => {
        return routes.find((route: { path: string }) => route.path === pathname) || routes[0];
    }),
}));

const mockSelectNative = jest.fn();
const mockVerticalTab = jest.fn();
const route1 = '/report1';
const route2 = '/report2';
const onCloseClick = 'onclose-click';
const report1Text = 'Report 1';
const report2Text = 'Report 2';
const Loading = 'Loading';
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DesktopWrapper: jest.fn(({ children }) => children),
    MobileWrapper: jest.fn(({ children }) => children),
    Div100vhContainer: jest.fn(({ children }) => children),
    FadeWrapper: jest.fn(({ children }) => children),
    Loading: () => <div>{Loading}</div>,
    PageOverlay: jest.fn(({ children, onClickClose }) => (
        <div>
            <button data-testid={onCloseClick} onClick={onClickClose}>
                close
            </button>
            Overlay
            {children}
        </div>
    )),
    VerticalTab: (props: any) => {
        mockVerticalTab(props);
        return <div>Vertical Tab</div>;
    },
    SelectNative: (props: { onChange: React.ChangeEventHandler<HTMLSelectElement> | undefined; list_items: any[] }) => {
        mockSelectNative(props);
        return (
            <select onChange={props.onChange}>
                {props.list_items.map(item => (
                    <option key={item.value} value={item.value}>
                        {item.text}
                    </option>
                ))}
            </select>
        );
    },
}));

const mock = {
    client: {
        is_logged_in: true,
        is_logging_in: false,
    },
    common: {
        is_from_derivgo: false,
        routeBackInApp: jest.fn(),
    },
    ui: {
        is_reports_visible: true,
        setReportsTabIndex: jest.fn(),
        reports_route_tab_index: 1,
        toggleReports: jest.fn(),
        setVerticalTabIndex: jest.fn(),
    },
};

jest.mock('@deriv/stores', () => ({
    ...jest.requireActual('@deriv/stores'),
    observer: jest.fn(x => x),
}));

const routes = [
    { path: route1, component: () => <div>{report1Text}</div>, getTitle: () => report1Text, default: true },
    { path: route2, component: () => <div>{report2Text}</div>, getTitle: () => report2Text },
];

describe('Reports', () => {
    let store = mockStore(mock);

    beforeEach(() => {
        store = mockStore(mock);
        jest.clearAllMocks();
    });

    const renderReports = (store: TStores, history: History) => {
        render(
            <StoreProvider store={store}>
                <Router history={history}>
                    <Reports history={history} location={history.location} routes={routes} />
                </Router>
            </StoreProvider>
        );
    };
    test('renders Reports component', () => {
        const history = createMemoryHistory();
        renderReports(store, history);
        expect(screen.getAllByText(report1Text).length).toBeGreaterThan(0);
        expect(screen.getAllByText(report2Text).length).toBeGreaterThan(0);
    });

    test('shows loader when is_logged_in is false', () => {
        const history = createMemoryHistory();
        store = mockStore({
            ...mock,
            client: {
                ...mock.client,
                is_logged_in: false,
                is_logging_in: true,
            },
        });
        renderReports(store, history);
        expect(screen.getByText(Loading)).toBeInTheDocument();
    });

    test('tracks Analytics events on open and close', () => {
        const history = createMemoryHistory();
        const { unmount } = render(
            <StoreProvider store={store}>
                <Router history={history}>
                    <Reports history={history} location={history.location} routes={routes} />
                </Router>
            </StoreProvider>
        );

        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            'ce_reports_form',
            expect.objectContaining({ action: 'open' })
        );
        unmount();
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            'ce_reports_form',
            expect.objectContaining({ action: 'close' })
        );
    });

    test('navigates to a different route on select change', () => {
        const history = createMemoryHistory();
        renderReports(store, history);
        userEvent.selectOptions(screen.getByRole('combobox'), route2);
        expect(history.location.pathname).toBe(route2);
    });

    test('calls routeBackInApp on close button click', () => {
        const mockRouteBackInApp = jest.fn();
        store = mockStore({
            ...mock,
            common: {
                ...mock.common,
                routeBackInApp: mockRouteBackInApp,
            },
        });
        const history = createMemoryHistory();
        renderReports(store, history);
        userEvent.click(screen.getByTestId(onCloseClick));
        expect(mockRouteBackInApp).toHaveBeenCalled();
    });

    test('sets vertical_tab_index to 0 if the selected route is default', () => {
        const history = createMemoryHistory();
        history.push(route1);
        renderReports(store, history);

        expect(mockVerticalTab).toHaveBeenCalledWith(
            expect.objectContaining({
                vertical_tab_index: 0,
            })
        );
    });

    test('sets vertical_tab_index to reports_route_tab_index if the selected route is not default', () => {
        const history = createMemoryHistory();
        history.push(route2);
        renderReports(store, history);

        expect(mockVerticalTab).toHaveBeenCalledWith(
            expect.objectContaining({
                vertical_tab_index: mock.ui.reports_route_tab_index,
            })
        );
    });
});
