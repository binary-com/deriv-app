import { Router } from 'react-router';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultiActionButtonGroup from '../multi-action-button-group';
import { createBrowserHistory } from 'history';
import { routes } from '@deriv/shared';

const mock_props = {
    link_to: routes.trade,
    onAction: jest.fn(),
    is_buttons_disabled: false,
    is_real: true,
};

type TMockProps = {
    link_to: string;
    onAction: jest.Mock;
    is_buttons_disabled: boolean;
    is_real: boolean;
};

jest.mock('Components/trade-button', () => {
    const TradeButton = ({ link_to, onAction, is_buttons_disabled }: TMockProps) => (
        <a href={link_to}>
            <button onClick={onAction} disabled={is_buttons_disabled}>
                Open
            </button>
        </a>
    );
    return TradeButton;
});

describe('Test Cases for Multi Action Button Group:', () => {
    it('should display "Open" and "Transfer" button within component', () => {
        render(<MultiActionButtonGroup {...mock_props} />);

        expect(screen.getByText('Open')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
    });

    it('should display "Top up" button instead of "Transfer" if it is not real', () => {
        render(<MultiActionButtonGroup {...mock_props} is_real={false} />);

        expect(screen.getByText('Open')).toBeInTheDocument();
        expect(screen.getByText('Top up')).toBeInTheDocument();
        expect(screen.queryByText('Transfer')).not.toBeInTheDocument();
    });

    it('should disable "Open" button if "is_buttons_disabled" is true', () => {
        render(<MultiActionButtonGroup {...mock_props} is_buttons_disabled />);

        const open_btn = screen.getByText('Open');
        expect(open_btn).toBeDisabled();
    });

    it('should execute function when clicking on "Open"', () => {
        render(<MultiActionButtonGroup {...mock_props} />);

        const open_btn = screen.getByText('Open');
        userEvent.click(open_btn);
        expect(mock_props.onAction).toHaveBeenCalled();
    });

    it('should redirect to Trade page after "Open" button is clicked', () => {
        const history = createBrowserHistory();
        render(
            <Router history={history}>
                <MultiActionButtonGroup {...mock_props} is_real />
            </Router>
        );
        expect(screen.getByRole('link')).toHaveAttribute('href', routes.trade);
    });
});
