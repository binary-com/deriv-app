import React from 'react';
import { screen, render } from '@testing-library/react';
import CompanyWideLimitExceededModal from '../company-wide-limit-exceeded-modal';

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

jest.mock('@deriv/stores', () => ({
    ...jest.requireActual('@deriv/stores'),
    observer: jest.fn(x => x),
    useStore: jest.fn(() => ({
        ui: {
            is_mobile: false,
        },
    })),
}));

describe('<CompanyWideLimitExceeded />', () => {
    const mocked_props = {
        is_visible: true,
        onConfirm: jest.fn(),
    };
    it('should render modal title, modal description, and modal button.', () => {
        render(<CompanyWideLimitExceededModal {...mocked_props} />);
        expect(screen.getByText(/purchase error/i)).toBeInTheDocument();
        expect(
            screen.getByText(/no further trading is allowed on this contract type for the current trading session./i)
        ).toBeInTheDocument();
        expect(screen.getByText(/ok/i)).toBeInTheDocument();
    });
    it('should return null when is_visible is false', () => {
        mocked_props.is_visible = false;
        const { container } = render(<CompanyWideLimitExceededModal {...mocked_props} />);
        expect(container).toBeEmptyDOMElement();
    });
});
