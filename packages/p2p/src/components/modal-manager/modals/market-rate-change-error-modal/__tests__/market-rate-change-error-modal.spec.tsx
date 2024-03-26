import React from 'react';
import { render, screen } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import MarketRateChangeErrorModal from '../market-rate-change-error-modal';

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const el_modal = document.createElement('div');

describe('<MarketRateChangeErrorModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render MarketRateChangeErrorModal', () => {
        render(<MarketRateChangeErrorModal />);

        expect(
            screen.getByText('The rate of the advert has changed. Please try creating your order again.')
        ).toBeInTheDocument();
    });

    it('should render message if message is passed as a prop', () => {
        render(<MarketRateChangeErrorModal message='test message' />);

        expect(screen.getByText('test message')).toBeInTheDocument();
    });

    it('should close the modal on clicking try again button', () => {
        render(<MarketRateChangeErrorModal />);

        const button = screen.getByRole('button', { name: 'Try again' });
        button.click();
        expect(mock_modal_manager.hideModal).toBeCalledTimes(1);
    });
});
