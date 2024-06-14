import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QSInputLabel from '../qs-input-label';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('<QSInputLabel />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_mobile_or_tablet: true,
            },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render QSInputLabel', () => {
        const { container } = render(<QSInputLabel />, {
            wrapper,
        });

        expect(container).toBeInTheDocument();
    });

    it('should render label', () => {
        render(<QSInputLabel label='Duration' />, {
            wrapper,
        });

        expect(screen.getByText('Duration')).toBeInTheDocument();
    });

    it('should render description', () => {
        render(<QSInputLabel label='Duration' description='this is duration field' />, {
            wrapper,
        });
        userEvent.click(screen.getByTestId('dt_popover_wrapper'));
        act(() => {
            fireEvent.mouseOver(screen.getByText('Duration'));
        });
        expect(screen.getByText('this is duration field')).toBeInTheDocument();
    });
});
