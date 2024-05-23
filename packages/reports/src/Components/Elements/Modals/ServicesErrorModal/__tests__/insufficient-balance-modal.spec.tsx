import React from 'react';
import { screen, render } from '@testing-library/react';
import InsufficientBalanceModal from '../insufficient-balance-modal';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { routes } from '@deriv/shared';
import userEvent from '@testing-library/user-event';

type TModal = React.FC<{
    children: React.ReactNode;
    is_open: boolean;
    title: string;
}> & {
    Body?: React.FC<{
        children: React.ReactNode;
    }>;
    Footer?: React.FC<{
        children: React.ReactNode;
    }>;
};

jest.mock('@deriv/stores', () => ({
    ...jest.requireActual('@deriv/stores'),
    observer: jest.fn(x => x),
    useStore: jest.fn(() => ({
        ui: {
            is_mobile: false,
        },
    })),
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    const Modal: TModal = jest.fn(({ children, is_open, title }) => {
        if (is_open) {
            return (
                <div data-testid='modal'>
                    <h3>{title}</h3>
                    {children}
                </div>
            );
        }
        return null;
    });
    Modal.Body = jest.fn(({ children }) => <div>{children}</div>);
    Modal.Footer = jest.fn(({ children }) => <div>{children}</div>);

    return {
        ...original_module,
        Modal,
    };
});

describe('<InsufficientBalanceModal />', () => {
    const mocked_props = {
        is_virtual: true,
        is_visible: true,
        message: 'test',
        toggleModal: jest.fn(),
    };

    const history = createBrowserHistory();
    const renderWithRouter = (component: React.ReactElement) => {
        return render(<Router history={history}>{component}</Router>);
    };

    it('modal title, and modal description should be rendered', () => {
        renderWithRouter(<InsufficientBalanceModal {...mocked_props} />);
        expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument();
        expect(screen.getByText(/test/i)).toBeInTheDocument();
    });
    it('button text should be OK if is_virtual is true and toggleModal should be called if user clicks on the button', () => {
        renderWithRouter(<InsufficientBalanceModal {...mocked_props} />);
        const button = screen.getByText(/ok/i);
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(mocked_props.toggleModal).toHaveBeenCalled();
    });
    it('button text should be "Deposit now" if is_virtual is false and should navigate to bla bla if you click on the button', () => {
        mocked_props.is_virtual = false;
        renderWithRouter(<InsufficientBalanceModal {...mocked_props} />);
        const button = screen.getByText(/deposit now/i);
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(history.location.pathname).toBe(routes.cashier_deposit);
    });
    it('should return null when is_visible is false', () => {
        mocked_props.is_visible = false;
        const { container } = renderWithRouter(<InsufficientBalanceModal {...mocked_props} />);
        expect(container).toBeEmptyDOMElement();
    });
});
