import React from 'react';
// import ReactDOM from 'react-dom';
// import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../trader-providers';
import MultiplierOptions from '../multiplier-options';

const default_mocked_props = {
    toggleModal: jest.fn(),
};
const default_mock_store = {
    modules: {
        trade: {
            amount: 0,
            multiplier: '',
            multiplier_range_list: [],
            onChange: jest.fn(),
        },
    },
};

jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/info', () =>
    jest.fn(props => (
        <div>
            <span>MultipliersInfo component</span>
            <span>{props.amount}</span>
        </div>
    ))
);
jest.mock('Modules/Trading/Components/Form/RadioGroupWithInfoMobile', () =>
    jest.fn(() => (
        <div>
            <span>RadioGroupWithInfoMobile component</span>
        </div>
    ))
);
jest.mock('Stores/Modules/Trading/Helpers/preview-proposal', () => ({
    ...jest.requireActual('Stores/Modules/Trading/Helpers/preview-proposal'),
    requestPreviewProposal: (store, new_store, fn) =>
        fn({
            proposal: { commission: '1%', limit_order: { stop_out: { order_amount: '10' } } },
            echo_req: { contract_type: 'MULTUP', amount: 20 },
            subscription: { id: '123' },
        }),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        forget: jest.fn(),
    },
}));

describe('<MultiplierOptions />', () => {
    const mockMultiplierOptions = (mocked_store, mocked_props) => {
        return (
            <TraderProviders store={mocked_store}>
                <MultiplierOptions {...mocked_props} />
            </TraderProviders>
        );
    };
    it('should render child components', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockMultiplierOptions(mock_root_store, default_mocked_props));

        expect(screen.getByText(/MultipliersInfo component/i)).toBeInTheDocument();
        expect(screen.getByText(/0/i)).toBeInTheDocument();
        expect(screen.getByText(/RadioGroupWithInfoMobile component/i)).toBeInTheDocument();
    });
    it('should change the amount after rerendering', () => {
        const new_mocked_store = { ...default_mock_store };
        new_mocked_store.modules = {
            trade: {
                amount: 20,
                multiplier: '',
                multiplier_range_list: [],
                onChange: jest.fn(),
            },
        };
        const mock_root_store = mockStore(new_mocked_store);
        const { rerender } = render(mockMultiplierOptions(mock_root_store, default_mocked_props));

        expect(screen.getByText(/0/i)).toBeInTheDocument();

        rerender(mockMultiplierOptions(mock_root_store, default_mocked_props));

        expect(screen.getByText(/20/i)).toBeInTheDocument();
    });
    it('should not change the amount after rerendering if echo_req.amount !== amount and amount is falsy', () => {
        const new_mocked_store = { ...default_mock_store };
        new_mocked_store.modules = {
            trade: {
                amount: 10,
                multiplier: '',
                multiplier_range_list: [],
                onChange: jest.fn(),
            },
        };
        const mock_root_store = mockStore(new_mocked_store);
        const { rerender } = render(mockMultiplierOptions(mock_root_store, default_mocked_props));

        rerender(mockMultiplierOptions(mock_root_store, default_mocked_props));

        expect(screen.queryByText(/20/i)).not.toBeInTheDocument();
    });
});
