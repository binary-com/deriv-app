import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Analytics } from '@deriv-com/analytics';
import { APIProvider } from '@deriv/api';
import { useGetPasskeysList, useRegisterPasskey, useRemovePasskey, useRenamePasskey } from '@deriv/hooks';
import { useDevice } from '@deriv-com/ui';
import { routes } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import Passkeys from '../passkeys';
import { PasskeysList } from '../components/passkeys-list';

const passkey_name_1 = 'Test Passkey 1';
const passkey_name_2 = 'Test Passkey 2';

export const mock_passkeys_list: ComponentProps<typeof PasskeysList>['passkeys_list'] = [
    {
        id: 1,
        name: passkey_name_1,
        last_used: 1633024800000,
        created_at: 1633024800000,
        stored_on: 'Test device 1',
        icon: 'Test Icon 1',
        passkey_id: 'mock-id-1',
    },
    {
        id: 2,
        name: passkey_name_2,
        last_used: 1633124800000,
        created_at: 1634024800000,
        stored_on: 'Test device 2',
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

jest.mock('@simplewebauthn/browser', () => ({
    ...jest.requireActual('@simplewebauthn/browser'),
    startRegistration: jest.fn(() => Promise.resolve({})),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetPasskeysList: jest.fn(() => ({})),
    useRemovePasskey: jest.fn(() => ({})),
    useRenamePasskey: jest.fn(() => ({})),
    useRegisterPasskey: jest.fn(() => ({
        startPasskeyRegistration: jest.fn().mockResolvedValue({}),
        createPasskey: jest.fn().mockResolvedValue({}),
    })),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>MockLoading</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getOSNameWithUAParser: () => 'test OS',
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: true })),
}));

describe('Passkeys', () => {
    let mock_store: ReturnType<typeof mockStore>, modal_root_el: HTMLElement;
    const create_passkey = 'Create passkey';
    const error_message = 'We’re experiencing a temporary issue in processing your request. Please try again later.';
    const error_title = 'Unable to process your request';
    const ok_button = /ok/i;
    const continue_button = /continue/i;

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

    const renderComponent = () => {
        render(
            <MemoryRouter>
                <APIProvider>
                    <StoreProvider store={mock_store}>
                        <Passkeys />
                    </StoreProvider>
                </APIProvider>
            </MemoryRouter>
        );
    };

    it('should not render existed passkeys for desktop and tablet', () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: mock_passkeys_list,
        });
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: false });

        renderComponent();

        expect(screen.queryByText(passkey_name_1)).not.toBeInTheDocument();
        expect(screen.queryByText(passkey_name_2)).not.toBeInTheDocument();
        expect(Analytics.trackEvent).not.toHaveBeenCalled();
    });

    it('renders loader if passkeys list is loading', () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            is_passkeys_list_loading: true,
        });

        renderComponent();

        expect(screen.getByText('MockLoading')).toBeInTheDocument();
        expect(Analytics.trackEvent).not.toHaveBeenCalled();
    });

    it('renders loader if network_status is offline', () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            is_passkeys_list_loading: false,
        });

        mock_store.common.network_status.class = 'offline';

        renderComponent();

        expect(screen.getByText('MockLoading')).toBeInTheDocument();
        expect(Analytics.trackEvent).not.toHaveBeenCalled();
    });

    it('renders passkeys list error modal and triggers closing', async () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list_error: { message: 'test passkey list error message' },
        });

        renderComponent();

        userEvent.click(screen.getByRole('button', { name: create_passkey }));
        userEvent.click(screen.getByRole('button', { name: continue_button }));

        await waitFor(() => {
            expect(screen.getByText(error_message)).toBeInTheDocument();
            expect(screen.getByText(error_title)).toBeInTheDocument();
        });

        userEvent.click(screen.getByRole('button', { name: ok_button }));
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            tracking_event,
            getAnalyticsParams('error', { error_message: 'test passkey list error message' })
        );
        expect(mockHistoryPush).toHaveBeenCalledWith(routes.traders_hub);
    });

    it('render existed passkeys for responsive', () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: mock_passkeys_list,
        });

        renderComponent();

        expect(screen.getByText(passkey_name_1)).toBeInTheDocument();
        expect(screen.getByText(passkey_name_2)).toBeInTheDocument();
        expect(Analytics.trackEvent).not.toHaveBeenCalled();
    });

    it('should trigger creation of new passkey ', async () => {
        const mockStartPasskeyRegistration = jest.fn();
        const mockCreatePasskey = jest.fn();

        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: mock_passkeys_list,
        });
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            startPasskeyRegistration: mockStartPasskeyRegistration,
            createPasskey: mockCreatePasskey,
        });

        renderComponent();

        expect(screen.getByText(passkey_name_1)).toBeInTheDocument();
        expect(screen.getByText(passkey_name_2)).toBeInTheDocument();

        userEvent.click(screen.getByRole('button', { name: create_passkey }));

        expect(mockStartPasskeyRegistration).toHaveBeenCalledTimes(1);
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            tracking_event,
            getAnalyticsParams('create_passkey_started', { subform_name: 'passkey_main' })
        );
        expect(screen.getByText('Just a reminder')).toBeInTheDocument();

        userEvent.click(screen.getByRole('button', { name: continue_button }));

        expect(mockCreatePasskey).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(screen.queryByText('Just a reminder')).not.toBeInTheDocument();
        });
    });

    it('should trigger removing of passkey ', async () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: mock_passkeys_list,
        });
        const mockUseRemovePasskey = jest.fn();

        (useRemovePasskey as jest.Mock).mockReturnValue({
            removePasskey: mockUseRemovePasskey,
        });

        renderComponent();

        userEvent.click(screen.getAllByTestId('dt_dropdown_display')[0]);

        await waitFor(() => {
            expect(screen.getByText('Rename')).toBeInTheDocument();
            expect(screen.getByText('Remove')).toBeInTheDocument();
        });

        userEvent.click(screen.getByText('Remove'));
        expect(mockUseRemovePasskey).toHaveBeenCalledTimes(1);
        expect(Analytics.trackEvent).toHaveBeenCalledWith(tracking_event, getAnalyticsParams('passkey_remove_started'));
    });

    it('should trigger renaming of passkey ', async () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: mock_passkeys_list,
        });
        const mockUseRenamePasskey = jest.fn();

        (useRenamePasskey as jest.Mock).mockReturnValue({
            renamePasskey: mockUseRenamePasskey,
        });

        renderComponent();

        userEvent.click(screen.getAllByTestId('dt_dropdown_display')[0]);

        await waitFor(() => {
            expect(screen.getByText('Rename')).toBeInTheDocument();
            expect(screen.getByText('Remove')).toBeInTheDocument();
        });

        userEvent.click(screen.getByText('Rename'));
        // expect(mockUseRenamePasskey).toHaveBeenCalledTimes(1);
        expect(Analytics.trackEvent).toHaveBeenCalledWith(tracking_event, getAnalyticsParams('passkey_rename_started'));

        // await waitFor(() => {
        //     // screen.debug();
        //     // TODO: improve this test
        // });
    });
});
