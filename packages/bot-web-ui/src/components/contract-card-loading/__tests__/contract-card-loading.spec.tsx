import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import ContractCardLoader from '../contract-card-loading';
import { contract_stages } from 'Constants/contract-stage';
import { message_running_bot } from '../contract-card-running-bot';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

describe('ContractCardLoader', () => {
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

    it('should render ContractCardLoader', () => {
        render(<ContractCardLoader />, {
            wrapper,
        });
        expect(screen.getByTestId('contract-card-loader')).toBeInTheDocument();
    });

    it('should render ContractCardLoader with default speed value', () => {
        render(<ContractCardLoader />, {
            wrapper,
        });
        const svgElement = screen.getByTestId('contract-card-loader');
        // eslint-disable-next-line testing-library/no-node-access
        const stopElement = svgElement.querySelector('animate'); // accessing the node directly to test the animation duration
        expect(stopElement).toHaveAttribute('dur', '3s');
    });

    it('should render ContractCardLoader with speed value passed as prop', () => {
        render(<ContractCardLoader speed={5} />, {
            wrapper,
        });
        const svgElement = screen.getByTestId('contract-card-loader');
        // eslint-disable-next-line testing-library/no-node-access
        const stopElement = svgElement.querySelector('animate'); // accessing the node directly to test the animation duration
        expect(stopElement).toHaveAttribute('dur', '5s');
    });

    it('should render ContractCardLoader with the Text component when contract stage is running bot', () => {
        render(<ContractCardLoader contract_stage={contract_stages.RUNNING} />, {
            wrapper,
        });
        const text = screen.getByText(message_running_bot);
        expect(text).toBeInTheDocument();
    });
});
