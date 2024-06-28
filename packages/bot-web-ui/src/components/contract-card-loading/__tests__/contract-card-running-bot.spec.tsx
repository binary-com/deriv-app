import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import ContractCardRunningBot, { message_running_bot } from '../contract-card-running-bot';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

describe('ContractCardRunningBot', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    beforeAll(() => {
        const mock_store = mockStore({});
        const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('renders ContractCardRunningBot with the Icon component with correct props', () => {
        const { container } = render(<ContractCardRunningBot />);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const svg = container.getElementsByTagName('svg')[0];
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('id', 'rotate-icon');
        expect(svg).toHaveClass('dc-icon--black');
        expect(svg).toHaveAttribute('height', '16');
        expect(svg).toHaveAttribute('width', '16');
    });

    it('renders ContractCardRunningBot with the Text component with the correct text and styles', () => {
        render(<ContractCardRunningBot />);
        const text = screen.getByText(message_running_bot);
        expect(text).toBeInTheDocument();
        expect(text).toHaveClass('dc-contract-card-message');
    });
});
