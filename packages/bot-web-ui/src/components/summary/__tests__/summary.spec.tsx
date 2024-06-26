import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Summary from '../summary';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('Summary', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});
    beforeAll(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('The Summary component must be rendered for mobile version with expected class', () => {
        mock_store.ui.is_desktop = false;
        render(<Summary is_drawer_open={true} />, { wrapper });

        const summary = screen.getByTestId('mock-summary');

        expect(summary).toBeInTheDocument();
        expect(summary).toHaveClass('run-panel-tab__content--mobile');
    });

    it('The Summary component must be rendered for desktop version with expected class', () => {
        mock_store.ui.is_desktop = true;
        render(<Summary is_drawer_open={false} />, { wrapper });

        const summary = screen.getByTestId('mock-summary');

        expect(summary).toBeInTheDocument();
        expect(summary).toHaveClass('run-panel-tab__content');
    });
});
