import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import StopBotModalContent from '../../bot-builder/stop-bot-modal-content';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mocked_props = {
    is_running: true,
    is_dialog_open: false,
    is_contract_dialog_open: false,
    is_stop_bot_dialog_open: true,
    is_multiplier: false,
    closeMultiplierContract: jest.fn(),
    onOkButtonClick: jest.fn(),
    toggleStopBotDialog: jest.fn(),
};

describe('StopBotModalContent', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element,
        mock_DBot_store: RootStore | undefined,
        modal_root_el: HTMLElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
        mock_DBot_store?.quick_strategy?.toggleStopBotDialog();
    });

    beforeEach(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the StopBotModalContent component', () => {
        const { container } = render(<StopBotModalContent {...mocked_props} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render the StopBotModalContent component with close contract message', () => {
        const close_contract = /Close your contract now or keep it running./i;
        render(<StopBotModalContent {...mocked_props} is_contract_dialog_open is_multiplier />, {
            wrapper,
        });
        expect(screen.getByText(close_contract)).toBeInTheDocument();
    });

    it('should render the StopBotModalContent component with stop bot message', () => {
        const stop_bot = 'Stopping the current bot will load the Quick Strategy you just created to the workspace.';
        render(<StopBotModalContent {...mocked_props} />, {
            wrapper,
        });
        expect(screen.getByText(stop_bot)).toBeInTheDocument();
    });
});
