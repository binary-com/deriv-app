import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';
import PaymentAgentTransferReceipt from '../payment-agent-transfer-receipt';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<PaymentAgentTransferReceipt />', () => {
    const history = createBrowserHistory();

    it('component should render', () => {
        const currency = 'currency';
        const receipt = {
            amount_transferred: 'someAmount',
            client_id: 'id',
        };
        const component = render(
            <Router history={history}>
                <PaymentAgentTransferReceipt currency={currency} receipt={receipt} />
            </Router>
        );

        expect(component.container.querySelector('.payment-agent-transfer-receipt__wrapper')).toBeInTheDocument();
    });

    it(`should redirect to statement page when click on 'View in statement' button`, () => {
        const currency = 'currency';
        const receipt = {
            amount_transferred: 'someAmount',
            client_id: 'id',
        };
        const resetPaymentAgentTransfer = jest.fn();
        const statement = 'statement';

        render(
            <Router history={history}>
                <PaymentAgentTransferReceipt
                    currency={currency}
                    receipt={receipt}
                    resetPaymentAgentTransfer={resetPaymentAgentTransfer}
                />
            </Router>
        );

        const btn = screen.getByText('View in statement');
        fireEvent.click(btn);

        expect(history.location.pathname).toBe(routes[statement]);
    });

    it(`resetPaymentAgentTransfer func should be triggered when click on 'Make a new transfer' button`, () => {
        const currency = 'currency';
        const receipt = {
            amount_transferred: 'someAmount',
            client_id: 'id',
        };
        const resetPaymentAgentTransfer = jest.fn();

        render(
            <Router history={history}>
                <PaymentAgentTransferReceipt
                    currency={currency}
                    receipt={receipt}
                    resetPaymentAgentTransfer={resetPaymentAgentTransfer}
                />
            </Router>
        );

        const btn = screen.getByText('Make a new transfer');
        fireEvent.click(btn);

        expect(resetPaymentAgentTransfer).toBeCalledTimes(1);
    });
});
