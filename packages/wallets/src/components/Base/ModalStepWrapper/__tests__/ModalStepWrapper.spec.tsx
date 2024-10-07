import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from '../../../ModalProvider';
import ModalStepWrapper from '../ModalStepWrapper';

const mockhideFn = jest.fn();
jest.mock('../../../ModalProvider', () => ({
    ...jest.requireActual('../../../ModalProvider'),
    useModal: jest.fn(() => ({
        hide: mockhideFn,
        setModalOptions: jest.fn(),
    })),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('ModalStepWrapper', () => {
    const MockComponent = (props: React.ComponentProps<typeof ModalStepWrapper>) => (
        <ModalProvider>
            <ModalStepWrapper {...props}>
                <div>test</div>
            </ModalStepWrapper>
        </ModalProvider>
    );

    it('should render ModalStepWrapper on default values', () => {
        render(<MockComponent />);
        const element = screen.getByTestId('dt_modal_step_wrapper');
        expect(element).toHaveClass('wallets-modal-step-wrapper');
        const headerElement = screen.getByTestId('dt_modal_step_wrapper_header');
        expect(headerElement).toBeInTheDocument();
        const footerElement = screen.queryByTestId('dt_modal_step_wrapper_footer');
        expect(footerElement).not.toBeInTheDocument();
    });

    it('should render the children passed to ModalStepWrapper', () => {
        render(<MockComponent />);
        const children = screen.getByText('test');
        expect(children).toBeInTheDocument();
    });

    it('should render correctly with title', () => {
        render(<MockComponent title='Test Title' />);
        const title = screen.getByText('Test Title');
        expect(title).toBeInTheDocument();
    });

    it('should render correctly with shouldHideHeader true', () => {
        render(<MockComponent shouldHideHeader title='Test Title' />);
        const title = screen.queryByText('Test Title');
        const closeIcon = screen.queryByTestId('dt_modal_step_wrapper_header_icon');
        expect(title).not.toBeInTheDocument();
        expect(closeIcon).not.toBeInTheDocument();
    });

    it('should render correctly with shouldHideDerivAppHeader true', () => {
        render(<MockComponent shouldHideDerivAppHeader />);
        const element = screen.getByTestId('dt_modal_step_wrapper');
        expect(element).toHaveClass('wallets-modal-step-wrapper--hide-deriv-app-header');
    });

    it('should render correctly with renderFooter', () => {
        render(<MockComponent renderFooter={() => <div>Footer</div>} />);
        const footerElement = screen.getByTestId('dt_modal_step_wrapper_footer');
        expect(footerElement).toBeInTheDocument();
    });

    it('should render correctly with shouldFixedFooter false and renderFooter', () => {
        render(<MockComponent renderFooter={() => <div>Footer</div>} shouldFixedFooter={false} />);
        const bodyElement = screen.getByTestId('dt_modal_step_wrapper_body');
        const footerElement = within(bodyElement).getByTestId('dt_modal_step_wrapper_footer');
        expect(footerElement).toBeInTheDocument();
    });

    it('should close modal on close icon click', async () => {
        render(<MockComponent renderFooter={() => <div>Footer</div>} />);
        const closeIcon = screen.getByTestId('dt_modal_step_wrapper_header_icon');
        await userEvent.click(closeIcon);
        expect(mockhideFn).toHaveBeenCalled();
    });

    it('should close modal on escape if shouldPreventCloseOnEscape false', async () => {
        const { container } = render(<MockComponent renderFooter={() => <div>Footer</div>} />);
        await userEvent.type(container, '{esc}');
        expect(mockhideFn).toHaveBeenCalled();
    });

    it('should not close modal on escape if shouldPreventCloseOnEscape true', async () => {
        const { container } = render(
            <MockComponent renderFooter={() => <div>Footer</div>} shouldPreventCloseOnEscape />
        );
        await userEvent.type(container, '{esc}');
        expect(mockhideFn).not.toHaveBeenCalled();
    });
});
