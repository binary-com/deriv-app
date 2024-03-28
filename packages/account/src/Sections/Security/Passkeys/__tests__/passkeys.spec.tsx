import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { useGetPasskeysList, useRegisterPasskey } from '@deriv/hooks';
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

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetPasskeysList: jest.fn(() => ({})),
    useRegisterPasskey: jest.fn(() => ({})),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>MockLoading</div>,
}));

describe('Passkeys', () => {
    const mock_store = mockStore({
        ui: { is_mobile: true },
        client: { is_passkey_supported: true },
        common: { network_status: { class: 'online' } },
    });
    const create_passkey = 'Create passkey';

    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
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
        expect(screen.getByText('Effortless login with passkeys')).toBeInTheDocument();
        expect(screen.getByText('Tips:')).toBeInTheDocument();
        const create_passkey_button = screen.getByRole('button', { name: create_passkey });
        userEvent.click(create_passkey_button);
        expect(mockStartPasskeyRegistration).toBeCalledTimes(1);
    });
    it('renders success screen when new passkeys created', () => {
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            is_passkey_registered: true,
        });

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.getByText('Success!')).toBeInTheDocument();
    });
    it("doesn't render existed passkeys for desktop", () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: mock_passkeys_list,
        });

        mock_store.ui.is_mobile = false;
        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.queryByText(passkey_name_1)).not.toBeInTheDocument();
        expect(screen.queryByText(passkey_name_2)).not.toBeInTheDocument();

        mock_store.ui.is_mobile = true;
    });
    it('renders loader if passkeys list is loading', () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            is_passkeys_list_loading: true,
        });

        mock_store.client.is_passkey_supported = false;

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        expect(screen.getByText('MockLoading')).toBeInTheDocument();
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

        const continue_button = screen.getByRole('button', { name: /continue/i });
        userEvent.click(continue_button);
        expect(mockCreatePasskey).toBeCalledTimes(1);
    });
    it('renders passkeys registration error modal and triggers closing', async () => {
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            passkey_registration_error: { message: 'registration test error' },
            clearPasskeyRegistrationError: mockClearPasskeyRegistrationError,
        });

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        const try_again_button = screen.getByRole('button', { name: /try again/i });
        expect(screen.getByText('registration test error')).toBeInTheDocument();
        userEvent.click(try_again_button);
        await waitFor(() => {
            expect(mockClearPasskeyRegistrationError).toBeCalledTimes(1);
        });
    });
    it('renders passkeys list error modal and triggers closing', async () => {
        (useRegisterPasskey as jest.Mock).mockReturnValue({
            passkey_registration_error: null,
        });

        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list_error: { message: 'list test error' },
            reloadPasskeysList: mockReloadPasskeysList,
        });

        render(
            <RenderWrapper>
                <Passkeys />
            </RenderWrapper>
        );

        const try_again_button = screen.getByRole('button', { name: /try again/i });
        expect(screen.getByText('list test error')).toBeInTheDocument();
        userEvent.click(try_again_button);
        await waitFor(() => {
            expect(mockReloadPasskeysList).toBeCalledTimes(1);
        });
    });
});
