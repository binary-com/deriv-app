import React from 'react';
import { FormikValues } from 'formik';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getPropertyValue, isDesktop, isMobile, useIsMounted, WS } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import ApiToken from '../api-token';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getPropertyValue: jest.fn(() => []),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
    useIsMounted: jest.fn().mockImplementation(() => () => true),
}));
jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true, // this property makes it work,
    default: 'mockedDefaultExport',
    WS: {
        apiToken: jest.fn(() =>
            Promise.resolve({
                api_token: {
                    tokens: [],
                },
            })
        ),
        authorized: {
            apiToken: jest.fn(() =>
                Promise.resolve({
                    api_token: {
                        tokens: [],
                    },
                })
            ),
        },
    },
    useWS: () => undefined,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

const modal_root_el = document.createElement('div');
beforeAll(() => {
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);
});

afterAll(() => {
    document.body.removeChild(modal_root_el);
});

describe('<ApiToken/>', () => {
    const admin_scope_description =
        'This scope will allow third-party apps to open accounts for you, manage your settings and token usage, and more.';
    const admin_scope_note =
        'To avoid loss of funds, do not share tokens with the Admin scope with unauthorised parties.';
    const learn_more_title = 'Learn more about API token';
    const read_scope_description =
        'This scope will allow third-party apps to view your account activity, settings, limits, balance sheets, trade purchase history, and more.';
    const our_access_description =
        "To access our mobile apps and other third-party apps, you'll first need to generate an API token.";
    const trading_info_scope_description =
        'This scope will allow third-party apps to withdraw to payment agents and make inter-account transfers for you.';
    const select_scopes_msg = 'Select scopes based on the access you need.';
    const token_creation_description = "Name your token and click on 'Create' to generate your token.";
    const token_using_description = 'Copy and paste the token into the app.';
    const trade_scope_description =
        'This scope will allow third-party apps to buy and sell contracts for you, renew your expired purchases, and top up your demo accounts.';
    const trading_info_description = 'This scope will allow third-party apps to view your trading history.';
    const your_access_description =
        "To access your mobile apps and other third-party apps, you'll first need to generate an API token.";

    let store = mockStore({});
    store = mockStore({
        client: {
            is_switching: false,
        },
    });
    const mock_props = {
        footer_ref: document.createElement('div'),
        is_app_settings: false,
        overlay_ref: document.createElement('div'),
        setIsOverlayShown: jest.fn(),
        WS: {
            apiToken: jest.fn(() =>
                Promise.resolve({
                    api_token: {
                        tokens: [],
                    },
                })
            ),
            authorized: {
                apiToken: jest.fn(() =>
                    Promise.resolve({
                        api_token: {
                            tokens: [],
                        },
                    })
                ),
            },
        },
    };

    it('should render ApiToken component without app_settings and footer', async () => {
        render(
            <StoreProvider store={store}>
                <ApiToken {...mock_props} />
            </StoreProvider>
        );

        expect(WS.authorized.apiToken).toHaveBeenCalled();

        expect(await screen.findByText(admin_scope_description)).toBeInTheDocument();
        expect(await screen.findByText(admin_scope_note)).toBeInTheDocument();
        expect(await screen.findByText(trading_info_scope_description)).toBeInTheDocument();
        expect(await screen.findByText(select_scopes_msg)).toBeInTheDocument();
        expect(await screen.findByText(token_creation_description)).toBeInTheDocument();
        expect(await screen.findByText(token_using_description)).toBeInTheDocument();
        expect(await screen.findByText(trade_scope_description)).toBeInTheDocument();
        expect(await screen.findByText(trading_info_description)).toBeInTheDocument();
        expect(await screen.findByText(your_access_description)).toBeInTheDocument();
        expect(await screen.findByText(read_scope_description)).toBeInTheDocument();
        expect(screen.queryByText(learn_more_title)).not.toBeInTheDocument();
    });

    it('should not render ApiToken component if is not mounted', () => {
        (useIsMounted as jest.Mock).mockImplementationOnce(() => () => false);

        render(
            <StoreProvider store={store}>
                <ApiToken {...mock_props} />
            </StoreProvider>
        );

        expect(WS.authorized.apiToken).toHaveBeenCalled();
        expect(screen.getByText('Loading')).toBeInTheDocument();

        expect(screen.queryByText(admin_scope_description)).not.toBeInTheDocument();
        expect(screen.queryByText(admin_scope_note)).not.toBeInTheDocument();
        expect(screen.queryByText(learn_more_title)).not.toBeInTheDocument();
        expect(screen.queryByText(trading_info_scope_description)).not.toBeInTheDocument();
        expect(screen.queryByText(select_scopes_msg)).not.toBeInTheDocument();
        expect(screen.queryByText(token_creation_description)).not.toBeInTheDocument();
        expect(screen.queryByText(token_using_description)).not.toBeInTheDocument();
        expect(screen.queryByText(trade_scope_description)).not.toBeInTheDocument();
        expect(screen.queryByText(trading_info_description)).not.toBeInTheDocument();
        expect(screen.queryByText(your_access_description)).not.toBeInTheDocument();
        expect(screen.queryByText(read_scope_description)).not.toBeInTheDocument();
    });

    it('should render ApiToken component without app_settings and footer for mobile', async () => {
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        (isDesktop as jest.Mock).mockReturnValueOnce(false);

        render(
            <StoreProvider store={store}>
                <ApiToken {...mock_props} />
            </StoreProvider>
        );

        expect(await screen.findByText(admin_scope_description)).toBeInTheDocument();
        expect(await screen.findByText(admin_scope_note)).toBeInTheDocument();
        expect(await screen.findByText(trading_info_scope_description)).toBeInTheDocument();
        expect(await screen.findByText(select_scopes_msg)).toBeInTheDocument();
        expect(await screen.findByText(token_creation_description)).toBeInTheDocument();
        expect(await screen.findByText(token_using_description)).toBeInTheDocument();
        expect(await screen.findByText(trade_scope_description)).toBeInTheDocument();
        expect(await screen.findByText(trading_info_description)).toBeInTheDocument();
        expect(await screen.findByText(read_scope_description)).toBeInTheDocument();
        expect(screen.queryByText(learn_more_title)).not.toBeInTheDocument();
    });

    it('should render ApiToken component with app_settings', async () => {
        mock_props.is_app_settings = true;

        render(
            <StoreProvider store={store}>
                <ApiToken {...mock_props} />
            </StoreProvider>
        );

        await waitFor(() => {
            expect(screen.queryByText(our_access_description)).not.toBeInTheDocument();
        });
    });

    it('should render ApiTokenFooter, show and close ApiTokenOverlay after triggering links', async () => {
        const footer_portal_root_el = document.createElement('div');
        document.body.appendChild(footer_portal_root_el);
        const overlay_portal_root_el = document.createElement('div');
        document.body.appendChild(overlay_portal_root_el);

        mock_props.footer_ref = footer_portal_root_el;
        mock_props.overlay_ref = overlay_portal_root_el;

        render(
            <StoreProvider store={store}>
                <ApiToken {...mock_props} />
            </StoreProvider>
        );

        expect(await screen.findByText(learn_more_title)).toBeInTheDocument();
        expect(screen.queryByText(our_access_description)).not.toBeInTheDocument();

        userEvent.click(await screen.findByText(learn_more_title));
        expect(await screen.findByText(our_access_description)).toBeInTheDocument();

        userEvent.click(await screen.findByRole('button', { name: /done/i }));
        expect(screen.queryByText(our_access_description)).not.toBeInTheDocument();

        document.body.removeChild(footer_portal_root_el);
        document.body.removeChild(overlay_portal_root_el);
    });

    it('should choose checkbox, enter a valid value and create token', async () => {
        render(
            <StoreProvider store={store}>
                <ApiToken {...mock_props} />
            </StoreProvider>
        );

        expect(screen.queryByText('New token name')).not.toBeInTheDocument();

        const checkboxes = await screen.findAllByRole('checkbox');
        const create_btn = await screen.findByRole('button');
        const read_checkbox = checkboxes.find((card: FormikValues) => card.name === 'read') as HTMLInputElement; // Typecasting it since find can return undefined as well
        const token_name_input = (await screen.findByLabelText('Token name')) as HTMLInputElement;

        expect(checkboxes).toHaveLength(5);
        expect(create_btn).toBeDisabled();
        expect(read_checkbox?.checked).toBeFalsy();
        expect(token_name_input?.value).toBe('');

        userEvent.click(read_checkbox);
        expect(read_checkbox?.checked).toBeTruthy();

        userEvent.type(token_name_input, '@#$');
        expect(await screen.findByText('Only letters, numbers, and underscores are allowed.')).toBeInTheDocument();
        userEvent.clear(token_name_input);

        userEvent.type(token_name_input, 'N');
        expect(await screen.findByText(/length of token name must be between/i)).toBeInTheDocument();
        userEvent.clear(token_name_input);

        userEvent.type(token_name_input, 'New test extra long name for erorr');
        expect(await screen.findByText(/maximum/i)).toBeInTheDocument();
        userEvent.clear(token_name_input);

        userEvent.type(token_name_input, 'New token name');
        await waitFor(() => {
            expect(token_name_input.value).toBe('New token name');
        });
        expect(create_btn).toBeEnabled();

        userEvent.click(create_btn);
        const updated_token_name_input = (await screen.findByLabelText('Token name')) as HTMLInputElement;
        expect(updated_token_name_input.value).toBe('');

        const createToken = WS.apiToken;
        expect(createToken).toHaveBeenCalledTimes(1);
    });

    it('should render created tokens and trigger delete', async () => {
        jest.useFakeTimers();

        (getPropertyValue as jest.Mock).mockReturnValue([
            {
                display_name: 'First test token',
                last_used: '',
                scopes: ['Read', 'Trade'],
                token: 'GBjsG2kM1uxtJtk',
                valid_for_ip: '',
            },
            {
                display_name: 'Second test token',
                last_used: '',
                scopes: ['Read', 'Payments', 'Trade'],
                token: 'GHjaD2f4gDg5gSE',
                valid_for_ip: '',
            },
        ]);

        render(
            <StoreProvider store={store}>
                <ApiToken {...mock_props} />
            </StoreProvider>
        );

        expect(await screen.findByText('First test token')).toBeInTheDocument();
        expect(await screen.findByText('Last used')).toBeInTheDocument();
        expect(await screen.findByText('Name')).toBeInTheDocument();
        expect(await screen.findByText('Token')).toBeInTheDocument();
        expect(await screen.findByText('Scopes')).toBeInTheDocument();
        expect(await screen.findByText('Second test token')).toBeInTheDocument();

        const delete_btns_1 = screen.getAllByTestId('dt_token_delete_icon');
        expect(delete_btns_1).toHaveLength(2);

        userEvent.click(delete_btns_1[0]);
        const no_btn_1 = screen.getByRole('button', { name: /cancel/i });
        expect(no_btn_1).toBeInTheDocument();

        userEvent.click(no_btn_1);
        await waitFor(() => {
            expect(no_btn_1).not.toBeInTheDocument();
        });

        const delete_btns_2 = await screen.findAllByTestId('dt_token_delete_icon');
        expect(delete_btns_2).toHaveLength(2);

        userEvent.click(delete_btns_2[0]);
        const yes_btn_1 = screen.getByRole('button', { name: /yes, delete/i });
        expect(yes_btn_1).toBeInTheDocument();

        userEvent.click(yes_btn_1);
        const deleteToken = WS.authorized.apiToken;
        expect(deleteToken).toHaveBeenCalled();
        await waitFor(() => {
            expect(yes_btn_1).not.toBeInTheDocument();
        });
    });

    it('should trigger hide/unhide icon and trigger copy icon, should show dialog only for admin scope', async () => {
        jest.useFakeTimers();

        const warning_msg =
            'Be careful who you share this token with. Anyone with this token can perform the following actions on your account behalf';

        (getPropertyValue as jest.Mock).mockReturnValue([
            {
                display_name: 'First test token',
                last_used: '',
                scopes: ['Read', 'Trade'],
                token: 'FirstTokenID',
                valid_for_ip: '',
            },
            {
                display_name: 'Second test token',
                last_used: '',
                scopes: ['Read', 'Trade', 'Admin'],
                token: 'SecondTokenID',
                valid_for_ip: '',
            },
        ]);

        render(
            <StoreProvider store={store}>
                <ApiToken {...mock_props} />
            </StoreProvider>
        );

        expect(await screen.findByText('First test token')).toBeInTheDocument();
        expect(screen.queryByText('FirstTokenID')).not.toBeInTheDocument();

        const toggle_visibility_btns = await screen.findAllByTestId('dt_toggle_visibility_icon');
        expect(toggle_visibility_btns).toHaveLength(2);

        userEvent.click(toggle_visibility_btns[0]);
        expect(screen.getByText('FirstTokenID')).toBeInTheDocument();

        userEvent.click(toggle_visibility_btns[1]);
        expect(screen.getByText('SecondTokenID')).toBeInTheDocument();

        const copy_btns_1 = await screen.findAllByTestId('dt_copy_token_icon');
        expect(copy_btns_1).toHaveLength(2);

        userEvent.click(copy_btns_1[0]);
        expect(screen.queryByText(warning_msg)).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(2100);
        });
        expect(screen.queryByTestId('dt_token_copied_icon')).not.toBeInTheDocument();

        userEvent.click(copy_btns_1[1]);
        expect(await screen.findByText(warning_msg)).toBeInTheDocument();

        const ok_btn = screen.getByRole('button', { name: /ok/i });
        expect(ok_btn).toBeInTheDocument();

        userEvent.click(ok_btn);

        jest.clearAllMocks();
    });

    it('should render created tokens for mobile', async () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);

        (getPropertyValue as jest.Mock).mockReturnValue([
            {
                display_name: 'First test token',
                last_used: '',
                scopes: ['Read', 'Trade'],
                token: 'FirstTokenID',
                valid_for_ip: '',
            },
            {
                display_name: 'Second test token',
                last_used: '',
                scopes: ['Read', 'Trade', 'Payments', 'Admin', 'Trading information'],
                token: 'SecondTokenID',
                valid_for_ip: '',
            },
            {
                display_name: 'Third test token',
                last_used: '03/02/2022',
                scopes: ['Read', 'Trade', 'Payments', 'Admin'],
                token: 'ThirdTokenID',
                valid_for_ip: '',
            },
        ]);

        render(
            <StoreProvider store={store}>
                <ApiToken {...mock_props} />
            </StoreProvider>
        );

        expect(await screen.findAllByText('Name')).toHaveLength(3);
        expect(await screen.findAllByText('Last Used')).toHaveLength(3);
        expect(await screen.findAllByText('Token')).toHaveLength(3);
        expect(await screen.findAllByText('Scopes')).toHaveLength(3);
        expect(await screen.findByText('First test token')).toBeInTheDocument();
        expect(await screen.findByText('Second test token')).toBeInTheDocument();
        expect(screen.queryByText('Action')).not.toBeInTheDocument();
        expect(screen.queryByText('SecondTokenID')).not.toBeInTheDocument();
        const never_used = await screen.findAllByText('Never');
        expect(never_used).toHaveLength(2);
    });

    it('should show token error if exists', async () => {
        WS.authorized.apiToken = jest.fn(() =>
            Promise.resolve({
                api_token: { tokens: [] },
                error: { message: 'New test error' },
            })
        );

        (getPropertyValue as jest.Mock).mockReturnValue('New test error');

        render(
            <StoreProvider store={store}>
                <ApiToken {...mock_props} />
            </StoreProvider>
        );

        expect(await screen.findByText('New test error')).toBeInTheDocument();
    });
});
