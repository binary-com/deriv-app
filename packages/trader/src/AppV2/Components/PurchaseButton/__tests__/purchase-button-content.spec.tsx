import React from 'react';
import { render, screen } from '@testing-library/react';
import { getLocalizedBasis } from '@deriv/shared';
import PurchaseButtonContent from '../purchase-button-content';

type TInfo = React.ComponentProps<typeof PurchaseButtonContent>['info'];

const mock_props = {
    currency: 'USD',
    has_open_accu_contract: false,
    info: {
        obj_contract_basis: {
            text: 'Payout',
            value: 19.23,
        },
    } as TInfo,
    is_multiplier: false,
    is_turbos: false,
    is_vanilla: false,
    is_reverse: false,
};
const wrapper_data_test_id = 'dt_purchase_button_wrapper';
const localized_basis = getLocalizedBasis();

describe('PurchaseButtonContent', () => {
    it('should render empty wrapper with specific className if info prop is empty object or falsy', () => {
        render(<PurchaseButtonContent {...mock_props} info={{} as TInfo} />);

        expect(screen.getByTestId(wrapper_data_test_id)).toHaveClass(
            'purchase-button__information__wrapper--disabled-placeholder'
        );
        expect(screen.queryByText(mock_props.currency)).not.toBeInTheDocument();
    });

    it('should render correct default text basis and amount if info was passed', () => {
        render(<PurchaseButtonContent {...mock_props} />);

        expect(screen.getByTestId(wrapper_data_test_id)).not.toHaveClass(
            'purchase-button__information__wrapper--disabled-placeholder'
        );
        expect(screen.getByText(localized_basis.payout)).toBeInTheDocument();
        expect(screen.getByText(/19.23/)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
    });

    it('should apply specific className to wrapper when is_reverse is true', () => {
        render(<PurchaseButtonContent {...mock_props} is_reverse />);

        expect(screen.getByTestId(wrapper_data_test_id)).toHaveClass('purchase-button__information__wrapper--reverse');
    });

    it('should render correct specific text basis and amount for Multipliers', () => {
        const multipliers_info = {
            has_error: false,
            has_error_details: false,
            obj_contract_basis: {
                text: '',
                value: '',
            },
            stake: '10.00',
        };
        render(<PurchaseButtonContent {...mock_props} is_multiplier info={multipliers_info as TInfo} />);

        expect(screen.getByText(localized_basis.stake)).toBeInTheDocument();
        expect(screen.getByText(/10/)).toBeInTheDocument();
        expect(screen.getByText(/USD/i)).toBeInTheDocument();
    });

    it('should not render button content if has_no_button_content === true and there is no error', () => {
        const { container } = render(<PurchaseButtonContent {...mock_props} has_no_button_content />);

        expect(container).toBeEmptyDOMElement();
    });
});
