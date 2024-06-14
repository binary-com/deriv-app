import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { TProposalTypeInfo } from 'Types';
import CancelDealInfo from '../cancel-deal-info';
import TraderProviders from '../../../../../../trader-providers';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
}));

const deal_cancellation = 'Deal cancel. fee';
const price = '1,023.00 USD';
const mock_proposal_info: TProposalTypeInfo = {
    id: '129106862',
    cancellation: { ask_price: 1023, date_expiry: 1907128726 },
    has_error: false,
    growth_rate: 0,
    spot_time: 0,
    commission: 0.44,
    has_error_details: false,
    error_code: '',
    error_field: '',
    limit_order: undefined,
    message: '',
    obj_contract_basis: { text: 'mock text', value: 'mock value' },
    payout: 0,
    profit: '',
    returns: '',
    stake: '',
    spot: 0,
};

const default_mock_store = {
    modules: {
        trade: {
            currency: 'USD',
            has_cancellation: false,
        },
    },
};

describe('<CancelDealInfo />', () => {
    const mockCancelDealInfo = (mocked_store: TCoreStores, mock_proposal_info: TProposalTypeInfo) => {
        return (
            <TraderProviders store={mocked_store}>
                <CancelDealInfo proposal_info={mock_proposal_info} data_testid='cancellation-wrapper' />
            </TraderProviders>
        );
    };

    it('should not render component if has_cancellation is false', () => {
        const { container } = render(mockCancelDealInfo(mockStore(default_mock_store), mock_proposal_info));

        expect(container).toBeEmptyDOMElement();
    });
    it('should render component if has_cancellation is true', () => {
        default_mock_store.modules.trade.has_cancellation = true;
        render(mockCancelDealInfo(mockStore(default_mock_store), mock_proposal_info));

        expect(screen.getByText(deal_cancellation)).toBeInTheDocument();
        expect(screen.getByText(price)).toBeInTheDocument();
    });
    it('should not render Money component if has_error is true', () => {
        mock_proposal_info.has_error = true;
        render(mockCancelDealInfo(mockStore(default_mock_store), mock_proposal_info));

        expect(screen.getByText(deal_cancellation)).toBeInTheDocument();
        expect(screen.queryByText(price)).not.toBeInTheDocument();
    });
    it('should not render Money component if id is falsy and has_error is null or undefined', () => {
        mock_proposal_info.has_error = null as unknown as TProposalTypeInfo['has_error'];
        mock_proposal_info.id = '';
        render(mockCancelDealInfo(mockStore(default_mock_store), mock_proposal_info));

        expect(screen.getByText(deal_cancellation)).toBeInTheDocument();
        expect(screen.queryByText(price)).not.toBeInTheDocument();
    });
    it('should apply special className if clientHeight > 21', () => {
        const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
        Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
            configurable: true,
            value: 200,
        });
        render(mockCancelDealInfo(mockStore(default_mock_store), mock_proposal_info));

        expect(screen.getByTestId('cancellation-wrapper')).toHaveClass(
            'trade-container__cancel-deal-info trade-container__cancel-deal-info--row-layout'
        );

        Object.defineProperty(HTMLElement.prototype, 'clientHeight', { value: originalClientHeight });
    });
});
