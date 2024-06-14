import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TutorialsTab from '../tutorials';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('<TutorialsTab />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({
        ui: {
            is_mobile_or_tablet: true,
        },
    });
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        mock_DBot_store?.quick_strategy?.setValue('durationtype', 't');
        mock_DBot_store?.quick_strategy?.setSelectedStrategy('MARTINGALE');
        mock_DBot_store?.quick_strategy?.setFormVisibility(true);
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render tutorials tab', () => {
        const { container } = render(<TutorialsTab />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });
});
