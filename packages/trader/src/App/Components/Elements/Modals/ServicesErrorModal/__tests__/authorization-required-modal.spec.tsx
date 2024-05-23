import React from 'react';
import { screen, render } from '@testing-library/react';
import AuthorizationRequiredModal from '../authorization-required-modal';
import { redirectToLogin, redirectToSignUp } from '@deriv/shared';
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

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    redirectToLogin: jest.fn(),
    redirectToSignUp: jest.fn(),
}));

describe('<AuthorizationRequiredModal />', () => {
    const mocked_props = {
        is_visible: true,
        toggleModal: jest.fn(),
        is_logged_in: true,
    };

    it('modal title, modal description, log in button, and signup button to be rendered', () => {
        render(<AuthorizationRequiredModal {...mocked_props} />);
        expect(screen.getByText(/start trading with us/i)).toBeInTheDocument();
        expect(screen.getByText(/Log in or create a free account to place a trade/i)).toBeInTheDocument();
        expect(screen.getByText('Log in')).toBeInTheDocument();
        expect(screen.getByText(/create free account/i)).toBeInTheDocument();
    });
    it('redirectToLogin should be called when Log in button is clicked', () => {
        render(<AuthorizationRequiredModal {...mocked_props} />);
        userEvent.click(screen.getByText('Log in'));
        expect(redirectToLogin).toHaveBeenCalled();
    });
    it('redirectToSignUp should be called when Log in button is clicked', () => {
        render(<AuthorizationRequiredModal {...mocked_props} />);
        userEvent.click(screen.getByText(/create free account/i));
        expect(redirectToSignUp).toHaveBeenCalled();
    });
    it('should return null when is_visible is false', () => {
        mocked_props.is_visible = false;
        const { container } = render(<AuthorizationRequiredModal {...mocked_props} />);
        expect(container).toBeEmptyDOMElement();
    });
});
