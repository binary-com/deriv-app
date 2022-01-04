import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import PaymentAgentTransferConfirm from '../payment-agent-transfer-confirm';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

beforeAll(() => {
    const portal_root = document.createElement('div');
    portal_root.setAttribute('id', 'modal_root');
    document.body.appendChild(portal_root);
});

afterEach(cleanup);

describe('<PaymentAgentTransferConfirm />', () => {
    const amount = 10;
    const currency = 'testCurrency';
    const description = 'testDescription';
    const error = {
        code: 'testCode',
        message: 'testMessage',
    };
    const header = 'Please confirm the transaction details in order to complete the transfer:';
    const requestPaymentAgentTransfer = jest.fn();
    const setIsTryTransferSuccessful = jest.fn();
    const transfer_to = 'test';

    it('component should be rendered', () => {
        const { container } = render(<PaymentAgentTransferConfirm transfer_to={transfer_to} />);

        expect(container.querySelector('.cashier__wrapper--confirm')).toBeInTheDocument();
    });

    it('header should be rendered', () => {
        render(<PaymentAgentTransferConfirm transfer_to={transfer_to} />);

        expect(screen.getByText(header)).toBeInTheDocument();
    });

    it('component <Row /> should be rendered when has data', () => {
        const { container } = render(<PaymentAgentTransferConfirm transfer_to={transfer_to} />);

        expect(container.querySelector('.confirm__row')).toBeInTheDocument();
    });

    it('component <FormError /> should be rendered when has an error', () => {
        render(<PaymentAgentTransferConfirm error={error} transfer_to={transfer_to} />);

        expect(screen.getByText('testMessage')).toBeInTheDocument();
    });

    it(`setIsTryTransferSuccessful func should be triggered when click on 'Back' button`, () => {
        render(
            <PaymentAgentTransferConfirm
                setIsTryTransferSuccessful={setIsTryTransferSuccessful}
                transfer_to={transfer_to}
            />
        );

        const btn = screen.getByText('Back');
        fireEvent.click(btn);
        expect(setIsTryTransferSuccessful).toBeCalledTimes(1);
    });

    it(`requestPaymentAgentTransfer func should be triggered when click on 'Confirm' button`, () => {
        render(
            <PaymentAgentTransferConfirm
                amount={amount}
                currency={currency}
                description={description}
                requestPaymentAgentTransfer={requestPaymentAgentTransfer}
                transfer_to={transfer_to}
            />
        );

        const btn = screen.getByText('Confirm');
        fireEvent.click(btn);
        expect(requestPaymentAgentTransfer).toBeCalledTimes(1);
    });
});
