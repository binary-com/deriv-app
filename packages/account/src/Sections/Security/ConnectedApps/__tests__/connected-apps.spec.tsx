import React from 'react';
import { OauthApps } from '@deriv/api-types';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConnectedApps from '../connected-apps';
import { WS } from '@deriv/shared';
import { getConnectedAppsScopes } from '../template-helper';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

const mock_connected_apps: OauthApps = [
    {
        name: 'Local',
        app_markup_percentage: 0,
        app_id: 9999,
        scopes: ['read', 'admin', 'trade', 'payments'],
        last_used: '2021-10-31 06:49:52',
        official: 0,
        appstore: '',
        github: '',
        googleplay: '',
        homepage: '',
        redirect_uri: '',
        verification_uri: '',
        active: 0,
    },
];
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            send: jest.fn(() => ({ oauth_apps: mock_connected_apps })),
        },
    },
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => <div>Mocked Loading</div>),
}));
jest.mock('../connected-apps-earn-more', () => jest.fn(() => <div>Mocked Earn More</div>));
jest.mock('../connected-apps-empty', () => jest.fn(() => <div>Mocked Empty Apps</div>));
jest.mock('../connected-apps-know-more', () => jest.fn(() => <div>Mocked Know More</div>));

describe('ConnectedApps', () => {
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 50 });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 50 });
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight as PropertyDescriptor);
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth as PropertyDescriptor);
        document.body.removeChild(modal_root_el);
    });

    const renderComponent = (mock_store = mockStore({})) =>
        render(
            <StoreProvider store={mock_store}>
                <ConnectedApps />
            </StoreProvider>
        );

    it('should render the Loading component initially', async () => {
        renderComponent();

        expect(screen.getByText(/Mocked Loading/i)).toBeInTheDocument();
    });

    it("should render the 'Know more' component", async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Mocked Know More/i)).toBeInTheDocument();
        });
    });

    it("should render the 'Earn more' component", async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Mocked Earn More/i)).toBeInTheDocument();
        });
    });

    it('should render the app list in Desktop view', async () => {
        renderComponent();
        const mock_permissions = getConnectedAppsScopes(mock_connected_apps[0]?.scopes);

        await waitFor(() => {
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText(mock_connected_apps[0].name)).toBeInTheDocument();
            expect(screen.getByText('Last login')).toBeInTheDocument();
            if (mock_connected_apps[0]?.last_used) {
                expect(screen.getByText(mock_connected_apps[0].last_used)).toBeInTheDocument();
            } else {
                expect(mock_connected_apps[0].last_used).not.toBeNull();
            }
            expect(screen.getByText('Permission')).toBeInTheDocument();
            if (mock_permissions) {
                expect(screen.getByText(mock_permissions)).toBeInTheDocument();
            } else {
                expect(mock_permissions).not.toBeNull();
            }
            expect(screen.getByRole('button', { name: 'Revoke access' })).toBeInTheDocument();
        });
    });

    it('should render the app list in responsive view', async () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        renderComponent();
        const mock_permissions = getConnectedAppsScopes(mock_connected_apps[0]?.scopes);

        await waitFor(() => {
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText(mock_connected_apps[0].name)).toBeInTheDocument();
            expect(screen.getByText('Last login')).toBeInTheDocument();
            if (mock_connected_apps[0]?.last_used) {
                expect(screen.getByText(mock_connected_apps[0].last_used)).toBeInTheDocument();
            } else {
                expect(mock_connected_apps[0].last_used).not.toBeNull();
            }
            expect(screen.getByText('Permission')).toBeInTheDocument();
            if (mock_permissions) {
                expect(screen.getByText(mock_permissions)).toBeInTheDocument();
            } else {
                expect(mock_permissions).not.toBeNull();
            }
            expect(screen.getByRole('button', { name: 'Revoke access' })).toBeInTheDocument();
        });
    });

    it('should open the modal to revoke access on clicking the button', async () => {
        renderComponent();

        await waitFor(() => {
            const revoke_button = screen.getByRole('button', { name: 'Revoke access' });
            expect(revoke_button).toBeInTheDocument();
            userEvent.click(revoke_button);
            expect(screen.getByText(/Confirm revoke access\?/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();

            const confirm_button = screen.getByRole('button', { name: 'Confirm' });
            expect(confirm_button).toBeInTheDocument();
            userEvent.click(confirm_button);
            expect(WS.authorized.send).toBeCalled();
        });
    });

    it('should render the empty apps informative text component if there are no connected apps', async () => {
        (WS.authorized.send as jest.Mock).mockReturnValue({ oauth_apps: [] });
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Mocked Empty Apps/i)).toBeInTheDocument();
        });
    });
});
