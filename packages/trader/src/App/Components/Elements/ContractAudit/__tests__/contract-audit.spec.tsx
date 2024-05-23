import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockContractInfo } from '@deriv/shared';
import ContractAudit from '../contract-audit';

const ContractDetails = 'ContractDetails';
const ContractHistory = 'ContractHistory';
const mocked_default_props: React.ComponentProps<typeof ContractAudit> = {
    contract_info: mockContractInfo(),
    contract_update_history: [{ order_date: 1700482235 }, { order_date: 1700482236 }],
    is_multiplier: true,
    is_accumulator: false,
    is_history_tab_active: false,
    is_turbos: false,
    is_vanilla: false,
    current_language: 'EN',
    toggleHistoryTab: jest.fn(),
    contract_end_time: 1700482235,
    duration: 3,
    duration_unit: 'm',
    exit_spot: '2428.68',
    is_dark_theme: false,
    is_open: false,
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Tabs: jest.fn(({ onTabItemClick, children }) => <div onClick={() => onTabItemClick(0)}>{children}</div>),
}));
jest.mock('../contract-details', () => jest.fn(() => <div>{ContractDetails}</div>));
jest.mock('../contract-history', () => jest.fn(() => <div>{ContractHistory}</div>));

describe('<ContractAudit />', () => {
    it('should render only ContractDetails component if is_multiplier, is_accumulator and is_turbos are falsy', () => {
        render(<ContractAudit {...mocked_default_props} is_multiplier={false} />);

        expect(screen.getByText(ContractDetails)).toBeInTheDocument();
        expect(screen.queryByText(ContractHistory)).not.toBeInTheDocument();
    });

    it('should render ContractDetails and ContractHistory components if is_multiplier, is_accumulator or is_turbos is true', () => {
        render(<ContractAudit {...mocked_default_props} />);

        expect(screen.getByText(ContractDetails)).toBeInTheDocument();
        expect(screen.getByText(ContractHistory)).toBeInTheDocument();
    });

    it('should call toggleHistoryTab function if onTabItemClick function was called with 0 index', () => {
        render(<ContractAudit {...mocked_default_props} />);

        userEvent.click(screen.getByText(ContractDetails));

        expect(mocked_default_props.toggleHistoryTab).toBeCalled();
    });
});
