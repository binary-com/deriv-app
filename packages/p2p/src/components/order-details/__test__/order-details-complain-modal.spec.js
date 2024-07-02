import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { requestWS } from 'Utils/websocket';
import OrderDetailsComplainModal from '../order-details-complain-modal.jsx';

const el_modal = document.createElement('div');

jest.mock('Utils/websocket', () => ({
    ...jest.requireActual('Utils/websocket'),
    requestWS: jest.fn(),
}));

describe('<OrderDetailsComplainModal/>', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });
    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render complain modal in desktop ', () => {
        render(<OrderDetailsComplainModal should_show_complain_modal />);

        expect(screen.getByText("What's your complaint?")).toBeInTheDocument();
    });

    it('should show modal that accepts complaint from user', () => {
        render(<OrderDetailsComplainModal hideComplainOrderModal={jest.fn()} />);

        expect(screen.queryByText("What's your complaint?")).not.toBeInTheDocument();
    });

    it('should disable button when no complain is provided', () => {
        render(<OrderDetailsComplainModal should_show_complain_modal />);

        expect(screen.getByRole('button', { name: /Submit/i })).toBeDisabled();
    });

    it('should submit the complain when complain is provided as input', () => {
        requestWS.mockResolvedValue({ value: 'P2P Test' });
        render(<OrderDetailsComplainModal should_show_complain_modal hideComplainOrderModal={jest.fn()} />);
        fireEvent.click(screen.getAllByRole('radio')[1]);
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(requestWS).toHaveBeenCalled();
    });

    it('should display error message when error response is received', async () => {
        requestWS.mockResolvedValue({ error: { message: 'Some error' } });
        render(<OrderDetailsComplainModal should_show_complain_modal hideComplainOrderModal={jest.fn()} />);
        act(() => {
            fireEvent.click(screen.getAllByRole('radio')[1]);
        });
        act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        });

        await waitFor(() => {
            expect(screen.getByText('Some error')).toBeInTheDocument();
        });
    });

    it('should show Complaint header in mobile view', () => {
        render(<OrderDetailsComplainModal should_show_complain_modal is_buy_order_for_user />);

        expect(screen.getByText('Complaint')).toBeInTheDocument();
    });
});
