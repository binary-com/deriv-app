import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import StrategyDescription from '../strategy-description';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
};

const mock_strategy_description_props = {
    item: {
        type: 'text',
        content: ['test'],
        src: 'test',
        alt: 'test',
    },
    font_size: 's',
};

describe('<StrategyDescription />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        mock_DBot_store?.quick_strategy.setFormVisibility(true);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('renders the StrategyDescription component', () => {
        render(<StrategyDescription {...mock_strategy_description_props} />, {
            wrapper,
        });

        expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('renders the StrategyDescription component when item type is italic', () => {
        mock_strategy_description_props.item.type = 'text_italic';
        render(<StrategyDescription {...mock_strategy_description_props} />, {
            wrapper,
        });

        expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('renders the StrategyDescription component when item type is media', () => {
        mock_strategy_description_props.item.type = 'media';
        render(<StrategyDescription {...mock_strategy_description_props} />, {
            wrapper,
        });

        expect(screen.getByAltText('test')).toBeInTheDocument();
    });
});
