import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores/index';
import Dp2pBlockedDescription from '../dp2p-blocked-description';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

window.LiveChatWidget = {
    call: jest.fn(),
    get: jest.fn(),
    init: jest.fn(),
    on: jest.fn(),
};

describe('<Dp2pBlockedDescription />', () => {
    it('it should return `P2P transactions are locked. This feature is not available for payment agents.`', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                is_p2p_blocked_for_pa: true,
                is_high_risk: true,
                is_blocked: false,
            },
        });
        render(<Dp2pBlockedDescription />);
        expect(
            screen.getByText('P2P transactions are locked. This feature is not available for payment agents.')
        ).toBeInTheDocument();
    });

    it('it should return `To enable this feature you must complete the following:`', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                is_p2p_blocked_for_pa: false,
                is_high_risk: true,
                is_blocked: false,
            },
        });
        render(<Dp2pBlockedDescription />);
        expect(screen.getByText('To enable this feature you must complete the following:')).toBeInTheDocument();
    });

    it('it should return `Please use live chat to contact our Customer Support team for help.` and open live chat when clicking on the `live chat`', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                is_p2p_blocked_for_pa: false,
                is_high_risk: false,
                is_blocked: false,
            },
        });

        render(<Dp2pBlockedDescription />);
        expect(screen.getByText(/to contact our Customer Support team for help./)).toBeInTheDocument();

        const live_chat_text = screen.getByText(/live chat/i);
        expect(live_chat_text).toBeInTheDocument();

        userEvent.click(live_chat_text);
        expect(window.LiveChatWidget.call).toHaveBeenCalledTimes(1);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });
});
