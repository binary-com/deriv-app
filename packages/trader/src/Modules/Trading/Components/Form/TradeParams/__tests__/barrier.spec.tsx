import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { useTraderStore } from 'Stores/useTraderStores';
import TraderProviders from '../../../../../../trader-providers';
import Barrier from '../barrier';

const mockedInputField = 'Mocked Input Field Component';
const mockedLabeledQuantityInputMobile = 'Mocked Labeled Quantity Input Mobile Component';
const mockedValueMovement = 'Mocked Value Movement Component';
const barrier_1 = '1020';
const barrier_2 = '1025';
const default_props = {
    is_minimized: true,
    is_absolute_only: false,
};
const mock_default_store = {
    modules: {
        trade: {
            barrier_1,
            barrier_2,
            barrier_count: 1,
            barrier_pipsize: 1,
            duration_unit: 'm',
            onChange: jest.fn(),
            validation_errors: {} as ReturnType<typeof useTraderStore>['validation_errors'],
            proposal_info: {} as ReturnType<typeof useTraderStore>['proposal_info'],
            trade_types: {} as ReturnType<typeof useTraderStore>['trade_types'],
        },
    },
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    InputField: jest.fn(() => <div>{mockedInputField}</div>),
    Modal: jest.fn(({ children, onClick }) => (
        <div>
            <button onClick={onClick}>Modal</button>
            {children}
        </div>
    )),
}));

jest.mock('../../LabeledQuantityInputMobile', () => jest.fn(() => <div>{mockedLabeledQuantityInputMobile}</div>));
jest.mock('../../Purchase/value-movement', () => jest.fn(() => <div>{mockedValueMovement}</div>));

describe('<Barrier />', () => {
    const mockBarrier = (mocked_store: TCoreStores, mocked_props: React.ComponentProps<typeof Barrier>) => {
        return (
            <TraderProviders store={mocked_store}>
                <Barrier {...mocked_props} />
            </TraderProviders>
        );
    };

    it('should render only barrier_1 if barrier_count === 1 and is_minimized === true', () => {
        render(mockBarrier(mockStore(mock_default_store), default_props));

        expect(screen.getByText(barrier_1)).toBeInTheDocument();
        expect(screen.queryByText(barrier_2)).not.toBeInTheDocument();
        expect(screen.queryByText(mockedInputField)).not.toBeInTheDocument();
    });
    it('should render both barriers if barrier_count === 2 and is_minimized === true', () => {
        mock_default_store.modules.trade.barrier_count = 2;
        render(mockBarrier(mockStore(mock_default_store), default_props));

        expect(screen.getByText(barrier_1)).toBeInTheDocument();
        expect(screen.getByText(barrier_2)).toBeInTheDocument();
        expect(screen.queryByText(mockedInputField)).not.toBeInTheDocument();
    });
    it('should render both InputField components with barriers if barrier_count === 2 and is_minimized === false', () => {
        default_props.is_minimized = false;
        render(mockBarrier(mockStore(mock_default_store), default_props));

        expect(screen.getAllByText(mockedInputField)).toHaveLength(2);
        expect(screen.getByText('Barriers')).toBeInTheDocument();
    });
});
