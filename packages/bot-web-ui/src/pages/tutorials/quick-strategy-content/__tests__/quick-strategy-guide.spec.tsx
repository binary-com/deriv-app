import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QuickStrategyGuides from '../quick-strategy-guides';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('<QuickStrategyGuides />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the component', () => {
        render(<QuickStrategyGuides />, {
            wrapper,
        });
        expect(screen.getByText('Quick strategy guides')).toBeInTheDocument();
        expect(screen.getByText('About Martingale')).toBeInTheDocument();
    });

    it('should render the component with quick strategy description', () => {
        render(<QuickStrategyGuides />, {
            wrapper,
        });

        userEvent.click(screen.getByText('About Martingale'));

        const description = screen.getByText('Exploring the Martingale strategy in Deriv Bot');
        expect(description).toBeInTheDocument();
        expect(description).toHaveStyle('--text-size: var(--text-size-xs);');
    });

    it('should render the component with xs font when on mobile', () => {
        mock_store.ui.is_desktop = true;
        render(<QuickStrategyGuides />, {
            wrapper,
        });

        const title = screen.getByText('Quick strategy guides');
        expect(title).toHaveStyle('--text-size: var(--text-size-s);');
    });
});
