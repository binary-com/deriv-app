import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TransactionDetails from '../transaction-details';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('../transaction-details-desktop', () => ({
    __esModule: true,
    default: () => <div>Desktop Details</div>,
}));

jest.mock('../transaction-details-mobile', () => ({
    __esModule: true,
    default: () => <div>Mobile Details</div>,
}));
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

const mock_ws = {
    authorized: {
        subscribeProposalOpenContract: jest.fn(),
        send: jest.fn(),
    },
    storage: {
        send: jest.fn(),
    },
    contractUpdate: jest.fn(),
    subscribeTicksHistory: jest.fn(),
    forgetStream: jest.fn(),
    activeSymbols: jest.fn(),
    send: jest.fn(),
};
describe('TransactionDetails', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    const mock_store = mockStore({});
    const wrapper = (mock_store: ReturnType<typeof mockStore>) => {
        const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );

        return Component;
    };

    it('should render Desktop component based on Desktop', async () => {
        mock_store.ui.is_desktop = true;

        await waitFor(() => render(<TransactionDetails />, { wrapper: wrapper(mock_store) }));
        expect(screen.queryByText('Desktop Details')).toBeInTheDocument();
    });

    it('should render Mobile component on mobile', async () => {
        mock_store.ui.is_desktop = false;

        await waitFor(() => render(<TransactionDetails />, { wrapper: wrapper(mock_store) }));
        expect(screen.getByText('Mobile Details')).toBeInTheDocument();
    });
});
