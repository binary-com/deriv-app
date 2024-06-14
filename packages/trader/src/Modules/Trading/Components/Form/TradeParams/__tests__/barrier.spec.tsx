import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { isDesktop, isMobile, isMobileOrTablet } from '@deriv/shared';
import TraderProviders from '../../../../../../trader-providers';
import Barrier from '../barrier';

const mocked_input_field = 'Mocked Input Field Component';
const mocked_labeled_quantity_input_mobile = 'Mocked Labeled Quantity Input Mobile Component';
const mocked_value_movement = 'Mocked Value Movement Component';
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
            validation_errors: {},
            proposal_info: { CALL: { spot: 2015.99, barrier: '2017.07' } },
            trade_types: { CALL: 'Higher', PUT: 'Lower' },
        },
    },
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true, isTablet: false, isMobile: false })),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    InputField: jest.fn(() => <div>{mocked_input_field}</div>),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobileOrTablet: jest.fn(() => false),
    isMobile: jest.fn(() => false),
}));
jest.mock('../../LabeledQuantityInputMobile', () =>
    jest.fn(props => (
        <div>
            <button
                onClick={() => {
                    props.onClick();
                    props.format(barrier_1);
                }}
            >
                {mocked_labeled_quantity_input_mobile}
            </button>
        </div>
    ))
);
jest.mock('../../Purchase/value-movement', () => jest.fn(() => <div>{mocked_value_movement}</div>));

describe('<Barrier />', () => {
    const mockBarrier = (mocked_store: TCoreStores, mocked_props: React.ComponentProps<typeof Barrier>) => {
        return (
            <TraderProviders store={mocked_store}>
                <Barrier {...mocked_props} />
            </TraderProviders>
        );
    };

    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component as React.ReactPortal;
        });
    });
    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });

    it('should render only barrier_1 if barrier_count === 1 and is_minimized === true', () => {
        render(mockBarrier(mockStore(mock_default_store), default_props));

        expect(screen.getByText(barrier_1)).toBeInTheDocument();
        expect(screen.queryByText(barrier_2)).not.toBeInTheDocument();
        expect(screen.queryByText(mocked_input_field)).not.toBeInTheDocument();
    });
    it('should render both barriers if barrier_count === 2 and is_minimized === true', () => {
        mock_default_store.modules.trade.barrier_count = 2;
        render(mockBarrier(mockStore(mock_default_store), default_props));

        expect(screen.getByText(barrier_1)).toBeInTheDocument();
        expect(screen.getByText(barrier_2)).toBeInTheDocument();
        expect(screen.queryByText(mocked_input_field)).not.toBeInTheDocument();
    });
    it('should render both InputField components with barriers if barrier_count === 2 and is_minimized === false', () => {
        default_props.is_minimized = false;
        render(mockBarrier(mockStore(mock_default_store), default_props));

        expect(screen.getByText('Barriers')).toBeInTheDocument();
        expect(screen.getAllByText(mocked_input_field)).toHaveLength(2);
    });
    it('should render both InputField components with barriers if barrier_count === 2 and is_minimized === false', () => {
        default_props.is_minimized = false;
        render(mockBarrier(mockStore(mock_default_store), default_props));

        expect(screen.getByText('Barriers')).toBeInTheDocument();
        expect(screen.getAllByText(mocked_input_field)).toHaveLength(2);
    });

    it('should render Modal for mobile devices after user clicked on LabeledQuantityInputMobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isMobileOrTablet as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false, isTablet: false, isMobile: true });
        render(mockBarrier(mockStore(mock_default_store), default_props));

        expect(screen.queryByText(/Current Price/i)).not.toBeInTheDocument();
        userEvent.click(screen.getAllByText(mocked_labeled_quantity_input_mobile)[0]);

        expect(screen.getByText(/Current Price/i)).toBeInTheDocument();
        expect(screen.getByText(mocked_value_movement)).toBeInTheDocument();
        expect(screen.getByText(/Barrier Price:/i)).toBeInTheDocument();
    });
});
