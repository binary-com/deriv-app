import React from 'react';
import { render, screen } from '@testing-library/react';
import { getContractTypeDisplay, CONTRACT_TYPES } from '@deriv/shared';
import ContractTypeCell from '../contract-type-cell';

jest.mock('../../../icon-trade-types', () => jest.fn(({ type }) => <div>Icon trade type: {type}</div>));

const mock_props: React.ComponentProps<typeof ContractTypeCell> = {
    displayed_trade_param: '',
    getContractTypeDisplay,
    is_high_low: false,
    is_multipliers: false,
    is_turbos: false,
    type: CONTRACT_TYPES.VANILLA.CALL,
};

describe('<ContractTypeCell />', () => {
    it('should render correct icon and contract type display name for passed type', () => {
        render(<ContractTypeCell {...mock_props} />);

        expect(screen.getByText(/vanillalongcall/i)).toBeInTheDocument();
        expect(screen.getByText('Call')).toBeInTheDocument();
    });

    it('should render specific icon with postfix "_barrier" if is_high_low === true and it is not Vanilla contract', () => {
        render(<ContractTypeCell {...mock_props} is_high_low type={CONTRACT_TYPES.LB_CALL} />);

        expect(screen.getByText(/_barrier/i)).toBeInTheDocument();
    });

    it('should render specific contract type display name for Multipliers', () => {
        render(<ContractTypeCell {...mock_props} is_multipliers type={CONTRACT_TYPES.MULTIPLIER.DOWN} />);

        expect(screen.getByText('Multipliers')).toBeInTheDocument();
        expect(screen.queryByText('Up')).not.toBeInTheDocument();
    });

    it('should render specific contract type display name for Turbos', () => {
        render(<ContractTypeCell {...mock_props} is_turbos type={CONTRACT_TYPES.TURBOS.LONG} />);

        expect(screen.getByText('Turbos')).toBeInTheDocument();
        expect(screen.queryByText('Up')).not.toBeInTheDocument();
    });

    it('should not render contract type display name if type is invalid', () => {
        const mock_trade_type = 'invalid';
        render(<ContractTypeCell {...mock_props} type={mock_trade_type} />);

        expect(screen.queryByText(mock_trade_type)).not.toBeInTheDocument();
    });

    it('should render displayed trade parameters content if displayed_trade_param was passed', () => {
        const mock_trade_param = 'Displayed trade parameters';
        render(<ContractTypeCell {...mock_props} displayed_trade_param={mock_trade_param} />);

        expect(screen.getByText(mock_trade_param)).toBeInTheDocument();
    });
});
