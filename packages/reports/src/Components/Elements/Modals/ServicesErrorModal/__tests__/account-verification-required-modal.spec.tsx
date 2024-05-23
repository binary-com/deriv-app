import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import AccountVerificationRequiredModal from '../account-verification-required-modal';

type TModal = React.FC<{
    children: React.ReactNode;
    is_open: boolean;
    title: string;
    height: string;
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
            is_mobile: true,
        },
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => true),
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    const Modal: TModal = jest.fn(({ children, is_open, title, height }) => {
        if (is_open) {
            return (
                <div data-testid='modal'>
                    <h3>{title}</h3>
                    <p>{height}</p>
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
describe('<AccountVerificationRequiredModal />', () => {
    let mocked_props: React.ComponentProps<typeof AccountVerificationRequiredModal>;
    const history = createBrowserHistory();
    const renderWithRouter = (component: React.ReactElement) => {
        return render(<Router history={history}>{component}</Router>);
    };

    beforeEach(() => {
        mocked_props = {
            onConfirm: jest.fn(),
            is_visible: true,
        };
    });
    it('height should be auto if isMobile is true', () => {
        render(<AccountVerificationRequiredModal {...mocked_props} />);
        expect(screen.getByText('auto')).toBeInTheDocument();
    });
    it('height should be 220px if isMobile is false', () => {
        (useStore as jest.Mock).mockReturnValue({
            ui: {
                is_mobile: false,
            },
        });
        render(<AccountVerificationRequiredModal {...mocked_props} />);
        expect(screen.getByText('220px')).toBeInTheDocument();
    });
    it('should render modal title, modal description, and submit button.', () => {
        render(<AccountVerificationRequiredModal {...mocked_props} />);
        expect(screen.getByText(/account verification required/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /Please submit your proof of identity and proof of address to verify your account and continue trading./i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/submit proof/i)).toBeInTheDocument();
    });
    it('should return null when is_visible is false', () => {
        mocked_props.is_visible = false;
        const { container } = render(<AccountVerificationRequiredModal {...mocked_props} />);
        expect(container).toBeEmptyDOMElement();
    });
    it('should navigate to proof_of_identity url on clicking on submit button', () => {
        renderWithRouter(<AccountVerificationRequiredModal {...mocked_props} />);
        const submit_proof_button = screen.getByText(/submit proof/i);
        userEvent.click(submit_proof_button);
        expect(history.location.pathname).toBe(routes.proof_of_identity);
    });
});
