import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Analytics } from '@deriv-com/analytics';
import { APIProvider } from '@deriv/api';
import { useGetPasskeysList, useRegisterPasskey } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import Passkeys from '../passkeys';
import PasskeysList from '../components/passkeys-list';

const passkey_name_1 = 'Test Passkey 1';
const passkey_name_2 = 'Test Passkey 2';

export const mock_passkeys_list: React.ComponentProps<typeof PasskeysList>['passkeys_list'] = [
    {
        id: 1,
        name: passkey_name_1,
        last_used: 1633024800000,
        created_at: 1633024800000,
        stored_on: '',
        icon: 'Test Icon 1',
        passkey_id: 'mock-id-1',
    },
    {
        id: 2,
        name: passkey_name_2,
        last_used: 1633124800000,
        created_at: 1634024800000,
        stored_on: '',
        icon: 'Test Icon 2',
        passkey_id: 'mock-id-2',
    },
];

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetPasskeysList: jest.fn(() => ({})),
    useRegisterPasskey: jest.fn(() => ({})),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>MockLoading</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getOSNameWithUAParser: () => 'test OS',
}));

describe('Passkeys', () => {
    let mock_store: ReturnType<typeof mockStore>, modal_root_el: HTMLElement;
    const create_passkey = 'Create passkey';
    const error_message = 'We’re experiencing a temporary issue in processing your request. Please try again later.';
    const error_title = 'Unable to process your request';

    const tracking_event = 'ce_passkey_account_settings_form';
    const getAnalyticsParams = (
        action: string,
        additional_data: { error_message?: string; subform_name?: string } = {}
    ) => ({
        action,
        form_name: tracking_event,
        operating_system: 'test OS',
        ...additional_data,
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        mock_store = mockStore({
            ui: { is_mobile_or_tablet: true },
            client: { is_passkey_supported: true },
            common: { network_status: { class: 'online' } },
        });
        jest.clearAllMocks();
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    const RenderWrapper = ({ children }: React.PropsWithChildren) => (
        <MemoryRouter>
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        </MemoryRouter>
    );

    const mockCreatePasskey = jest.fn();
    const mockStartPasskeyRegistration = jest.fn();
    const mockClearPasskeyRegistrationError = jest.fn();
    const mockReloadPasskeysList = jest.fn();

    it("doesn't render existed passkeys for desktop", () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: mock_passkeys_list,
        });

        mock_store.ui.is_mobile_or_tablet = false;
        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.queryByText(passkey_name_1)).not.toBeInTheDocument();
        expect(screen.queryByText(passkey_name_2)).not.toBeInTheDocument();
        expect(Analytics.trackEvent).not.toHaveBeenCalled();
    });

    it('renders loader if passkeys list is loading', () => {
        mock_store.ui.is_mobile_or_tablet = true;
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            is_passkeys_list_loading: true,
        });

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.getByText('MockLoading')).toBeInTheDocument();
        expect(Analytics.trackEvent).not.toHaveBeenCalled();
    });

    it('renders loader if network_status is offline', () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            is_passkeys_list_loading: false,
        });

        mock_store.common.network_status.class = 'offline';

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.getByText('MockLoading')).toBeInTheDocument();
        expect(Analytics.trackEvent).not.toHaveBeenCalled();
    });

    it('renders existed passkeys correctly and triggers new passkey creation', async () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: mock_passkeys_list,
        });
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            startPasskeyRegistration: mockStartPasskeyRegistration,
        });

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );
        expect(screen.getByText(passkey_name_1)).toBeInTheDocument();
        expect(screen.getByText(passkey_name_2)).toBeInTheDocument();

        const create_passkey_button = screen.getByRole('button', { name: create_passkey });
        userEvent.click(create_passkey_button);
        expect(mockStartPasskeyRegistration).toBeCalledTimes(1);
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            tracking_event,
            getAnalyticsParams('create_passkey_started', { subform_name: 'passkey_main' })
        );
    });

    it("renders 'Experience safer logins' page when no passkey created, trigger 'Learn more' screen, trigger passkey creation", () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: [],
        });
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            startPasskeyRegistration: mockStartPasskeyRegistration,
        });

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.getByText('Experience safer logins')).toBeInTheDocument();
        const learn_more_button = screen.getByRole('button', { name: 'Learn more' });
        userEvent.click(learn_more_button);
        expect(Analytics.trackEvent).toHaveBeenCalledWith(tracking_event, getAnalyticsParams('info_open'));

        expect(screen.getByText('Effortless login with passkeys')).toBeInTheDocument();
        expect(screen.getByText('Tips:')).toBeInTheDocument();
        const create_passkey_button = screen.getByRole('button', { name: create_passkey });
        userEvent.click(create_passkey_button);
        expect(mockStartPasskeyRegistration).toBeCalledTimes(1);
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            tracking_event,
            getAnalyticsParams('create_passkey_started', { subform_name: 'passkey_info' })
        );
    });

    it('renders success screen when new passkeys created and open "add more passkeys" ', () => {
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            is_passkey_registered: true,
        });

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            tracking_event,
            getAnalyticsParams('create_passkey_finished')
        );
        const add_more_passkeys_button = screen.getByRole('button', { name: 'Add more passkeys' });
        userEvent.click(add_more_passkeys_button);
        expect(Analytics.trackEvent).toHaveBeenCalledWith(tracking_event, getAnalyticsParams('add_more_passkeys'));

        const create_passkey_button = screen.getByRole('button', { name: 'Create passkey' });
        expect(create_passkey_button).toBeInTheDocument();
        expect(screen.queryByText('Success!')).not.toBeInTheDocument();
    });

    it('renders success screen when new passkeys created and open tradershub ', () => {
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            is_passkey_registered: true,
        });

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            tracking_event,
            getAnalyticsParams('create_passkey_finished')
        );

        const continue_trading_button = screen.getByRole('button', { name: 'Continue trading' });
        userEvent.click(continue_trading_button);
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            tracking_event,
            getAnalyticsParams('create_passkey_continue_trading')
        );
        expect(mockHistoryPush).toHaveBeenCalledWith(routes.traders_hub);
    });

    it('renders passkeys creation modal and triggers new passkey creation', async () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            is_passkeys_list_loading: false,
        });
        mock_store.client.is_passkey_supported = true;

        (useRegisterPasskey as jest.Mock).mockReturnValue({
            createPasskey: mockCreatePasskey,
            is_passkey_registration_started: true,
        });

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.getByText('Just a reminder')).toBeInTheDocument();
        expect(screen.getByText('Enable screen lock on your device.')).toBeInTheDocument();
        expect(screen.getByText('Enable bluetooth.')).toBeInTheDocument();
        expect(screen.getByText('Sign in to your Google or iCloud account.')).toBeInTheDocument();

        const continue_button = screen.getByRole('button', { name: /continue/i });
        userEvent.click(continue_button);
        expect(mockCreatePasskey).toBeCalledTimes(1);
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            tracking_event,
            getAnalyticsParams('create_passkey_reminder_passed')
        );
    });

    it('renders passkeys registration error modal and triggers closing', async () => {
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            passkey_registration_error: { message: 'error' },
            clearPasskeyRegistrationError: mockClearPasskeyRegistrationError,
        });

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        const ok_button = screen.getByRole('button', { name: /ok/i });
        expect(screen.getByText(error_message)).toBeInTheDocument();
        expect(screen.getByText(error_title)).toBeInTheDocument();
        userEvent.click(ok_button);
        await waitFor(() => {
            expect(mockClearPasskeyRegistrationError).toBeCalledTimes(1);
            expect(mockHistoryPush).toHaveBeenCalledWith(routes.traders_hub);
        });
    });

    it('renders passkeys list error modal and triggers closing', async () => {
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            passkey_registration_error: null,
        });

        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list_error: { message: 'error' },
            reloadPasskeysList: mockReloadPasskeysList,
        });

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        const ok_button = screen.getByRole('button', { name: /ok/i });
        expect(screen.getByText(error_message)).toBeInTheDocument();
        expect(screen.getByText(error_title)).toBeInTheDocument();
        userEvent.click(ok_button);
        expect(mockHistoryPush).toHaveBeenCalledWith(routes.traders_hub);
    });
});
