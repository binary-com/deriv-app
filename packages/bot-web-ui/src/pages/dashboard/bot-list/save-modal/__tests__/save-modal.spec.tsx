import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import DashboardStore from 'Stores/dashboard-store';
import GoogleDriveStore from 'Stores/google-drive-store';
import LoadModalStore from 'Stores/load-modal-store';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import SaveModal from '../save-modal';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const dashboard_strategy = {
    name: '',
    xml: '',
    save_type: '',
    timestamp: 1,
};

const dashboard_strategies = [
    { ...dashboard_strategy, name: 'Strategy1', id: '1' },
    { ...dashboard_strategy, name: 'Strategy2', id: '2' },
];

describe('RecentComponent', () => {
    let modal_root_el: HTMLElement,
        wrapper: ({ children }: { children: JSX.Element }) => JSX.Element,
        mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({
        ui: {
            setCurrentFocus: jest.fn(),
            is_mobile: false,
        },
    });
    mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    mock_DBot_store = {
        ...mock_DBot_store,
        dashboard: {
            ...mock_DBot_store.dashboard,
            active_tab: 1,
        } as DashboardStore,
        load_modal: {
            ...mock_DBot_store.load_modal,
            dashboard_strategies,
        } as LoadModalStore,
        save_modal: {
            ...mock_DBot_store.save_modal,
            bot_name: 'sample',
            button_status: 0,
            updateBotName: jest.fn(),
            onConfirmSave: jest.fn(),
            validateBotName: jest.fn(),
            toggleSaveModal: jest.fn(),
            is_save_modal_open: true,
        },
        google_drive: {
            ...mock_DBot_store.google_drive,
            is_authorised: true,
        } as GoogleDriveStore,
    };

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('Should render SaveModal in desktop', () => {
        render(<SaveModal />, { wrapper });
        const modal_text = screen.getByText(/Enter your bot name, choose to save on your computer or Google Drive/i);

        expect(modal_text).toBeInTheDocument();
    });

    it('Should render SaveModal in mobile mode', () => {
        mock_store.ui.is_desktop = false;
        render(<SaveModal />, { wrapper });
        const modal_text = screen.getByText(/Enter your bot name, choose to save on your computer or Google Drive/i);

        expect(modal_text).toBeInTheDocument();
    });

    it('Should check save to Google Drive ', async () => {
        mock_store.ui.is_desktop = false;
        render(<SaveModal />, { wrapper });

        userEvent.click(screen.getByRole('radio', { name: /Google Drive/i }));
        await waitFor(async () => {
            userEvent.click(screen.getByRole('button', { name: /Save/i }));
        });

        expect(mock_DBot_store?.save_modal.onConfirmSave).toHaveBeenCalledWith(
            { bot_name: 'sample', is_local: false, save_as_collection: false },
            expect.anything()
        );
    });

    it('Should check save to  Local', async () => {
        mock_store.ui.is_desktop = false;
        render(<SaveModal />, { wrapper });

        userEvent.click(screen.getByRole('radio', { name: /Local/i }));
        await waitFor(async () => {
            userEvent.click(screen.getByRole('button', { name: /Save/i }));
        });

        expect(mock_DBot_store?.save_modal.onConfirmSave).toHaveBeenCalledWith(
            { bot_name: 'sample', is_local: true, save_as_collection: false },
            expect.anything()
        );
    });

    it('Should check save to bot-name empty ', async () => {
        if (mock_DBot_store) {
            (mock_DBot_store.save_modal.validateBotName as jest.Mock).mockReturnValue({
                bot_name: 'Strategy name cannot be empty',
            });
        }
        render(<SaveModal />, { wrapper });
        const input = screen.getByRole('textbox', { name: /Bot name/i });

        userEvent.clear(input);
        userEvent.click(screen.getByRole('radio', { name: /Local/i }));
        fireEvent.blur(input);

        expect(await screen.findByText(/Strategy name cannot be empty/i)).toBeInTheDocument();
    });
});
