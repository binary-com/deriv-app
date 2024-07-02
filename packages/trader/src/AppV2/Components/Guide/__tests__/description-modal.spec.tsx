import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { CONTRACT_LIST, AVAILABLE_CONTRACTS } from 'AppV2/Utils/trade-types-utils';
import DescriptionModal from '../decription-modal';
import userEvent from '@testing-library/user-event';

const mockProps = {
    is_open: true,
    onClose: jest.fn(),
    onChipSelect: jest.fn(),
    onTermClick: jest.fn(),
    selected_contract_type: CONTRACT_LIST.ACCUMULATORS,
};
const mediaQueryList = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);

describe('DescriptionModal', () => {
    const renderDescriptionModal = () => {
        render(
            <StoreProvider store={mockStore({})}>
                <DescriptionModal {...mockProps} />
            </StoreProvider>
        );
    };

    beforeAll(() => {
        HTMLDialogElement.prototype.show = jest.fn();
        HTMLDialogElement.prototype.showModal = jest.fn();
        HTMLDialogElement.prototype.close = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render component', () => {
        renderDescriptionModal();

        AVAILABLE_CONTRACTS.forEach(({ id }) => expect(screen.getByText(id)).toBeInTheDocument());
        expect(screen.getByText('Got it')).toBeInTheDocument();
    });

    it('should open video player if user clicked on video preview', () => {
        renderDescriptionModal();

        expect(screen.queryByTestId('dt_video_player')).not.toBeInTheDocument();
        userEvent.click(screen.getByTestId('dt_video_preview'));

        expect(screen.getByTestId('dt_video_player')).toBeInTheDocument();
    });
});
