import React from 'react';
import { ProposalOpenContract } from '@deriv/api-types';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import SummaryCard from '../summary-card';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    ContractCard: jest.fn(() => <div>ContractCard</div>),
}));

jest.mock('Components/contract-card-loading', () => jest.fn(() => 'ContractCardLoader'));

const mock_contract_info: ProposalOpenContract = { account_id: 95381528 };

describe('SummaryCard', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});
    beforeAll(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render SummaryCard component', () => {
        render(<SummaryCard is_contract_loading={false} />, { wrapper });

        const summary_card = screen.getByTestId('dt_mock_summary_card');

        expect(summary_card).toBeInTheDocument();
    });

    it('the SummaryCard should be rendered with the inactive style when the contract is inactive, the contract is not loading, and the contract_info is null or absent', () => {
        render(<SummaryCard is_contract_loading={false} contract_info={null} />, { wrapper });

        const summary_card = screen.getByTestId('dt_mock_summary_card');

        expect(summary_card).toBeInTheDocument();
        expect(summary_card).toHaveClass('db-summary-card--inactive');
    });

    it('when the contract is loading, the SummaryCard should render the inner component ContractCardLoader, for the mobile version the mobile style should be applied', () => {
        mock_store.ui.is_desktop = false;
        mock_DBot_store?.run_panel.setContractStage(1);
        mock_DBot_store?.summary_card.onBotContractEvent({ is_sold: 1 });

        render(<SummaryCard is_contract_loading={true} contract_info={mock_contract_info} />, { wrapper });

        const summary_card = screen.getByTestId('dt_mock_summary_card');
        const contract_card_loader = screen.getByText('ContractCardLoader');
        expect(summary_card).toHaveClass('db-summary-card--completed-mobile');

        expect(summary_card).toBeInTheDocument();
        expect(contract_card_loader).toBeInTheDocument();
    });

    it('the SummaryCard should render the inner component ContractCard when the contract is not loading and the contract info exists', () => {
        render(<SummaryCard is_contract_loading={false} contract_info={mock_contract_info} />, { wrapper });

        const summary_card = screen.getByTestId('dt_mock_summary_card');
        const contract_card = screen.getByText('ContractCard');

        expect(summary_card).toBeInTheDocument();
        expect(contract_card).toBeInTheDocument();
    });
});
