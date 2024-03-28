import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileCounterpartiesTableRow from '../MyProfileCounterpartiesTableRow';

const mockProps = {
    id: 'id1',
    is_blocked: false,
    nickname: 'nickname',
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/components/UserAvatar', () => ({
    UserAvatar: () => <div>UserAvatar</div>,
}));

jest.mock('@deriv/api-v2', () => ({
    p2p: {
        counterparty: {
            useBlock: () => ({
                mutate: jest.fn(),
            }),
            useUnblock: () => ({
                mutate: jest.fn(),
            }),
        },
    },
}));

const elModal = document.createElement('div');
describe('MyProfileCounterpartiesTableRow', () => {
    beforeAll(() => {
        elModal.setAttribute('id', 'v2_modal_root');
        document.body.appendChild(elModal);
    });

    afterAll(() => {
        document.body.removeChild(elModal);
    });
    it('should render the component as expected', () => {
        render(<MyProfileCounterpartiesTableRow {...mockProps} />);
        expect(screen.getByText('nickname')).toBeInTheDocument();
        expect(screen.getByText('Block')).toBeInTheDocument();
        expect(screen.getByText('UserAvatar')).toBeInTheDocument();
    });
    it('should handle open modal for click of block/unblock button in the row', async () => {
        render(<MyProfileCounterpartiesTableRow {...mockProps} />);
        userEvent.click(screen.getByText('Block'));
        await waitFor(() => {
            expect(screen.getByText('Block nickname?')).toBeInTheDocument();
        });
    });
    it('should close modal for onRequest close of modal', async () => {
        render(<MyProfileCounterpartiesTableRow {...mockProps} />);
        userEvent.click(screen.getByText('Block'));
        await waitFor(() => {
            expect(screen.getByText('Block nickname?')).toBeInTheDocument();
            const button = screen.getByRole('button', { name: 'Cancel' });
            userEvent.click(button);
        });
        await waitFor(() => {
            expect(screen.queryByText('Block nickname?')).not.toBeInTheDocument();
        });
    });
});
