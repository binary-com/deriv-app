import React from 'react';
import { render, screen } from '@testing-library/react';
import { CONTRACT_LIST, AVAILABLE_CONTRACTS } from 'AppV2/Utils/trade-types-utils';
import GuideDescriptionModal from '../guide-description-modal';
import userEvent from '@testing-library/user-event';

const mockProps = {
    contract_list: AVAILABLE_CONTRACTS,
    is_open: true,
    onChipSelect: jest.fn(),
    onClose: jest.fn(),
    onTermClick: jest.fn(),
    selected_contract_type: CONTRACT_LIST.ACCUMULATORS,
    show_guide_for_selected_contract: false,
};

jest.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: jest.fn(() => <div>DotLottieReact</div>),
}));

describe('DescriptionModal', () => {
    beforeAll(() => {
        HTMLDialogElement.prototype.show = jest.fn();
        HTMLDialogElement.prototype.showModal = jest.fn();
        HTMLDialogElement.prototype.close = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render component', () => {
        render(<GuideDescriptionModal {...mockProps} />);

        AVAILABLE_CONTRACTS.forEach(({ id }) => expect(screen.getByText(id)).toBeInTheDocument());
        expect(screen.getByText('Got it')).toBeInTheDocument();
    });

    it('should open video player if user clicked on video preview', () => {
        render(<GuideDescriptionModal {...mockProps} />);

        expect(screen.queryByTestId('dt_video_player')).not.toBeInTheDocument();
        userEvent.click(screen.getByTestId('dt_video_preview'));

        expect(screen.getByTestId('dt_video_player')).toBeInTheDocument();
    });

    it('should render component with description for only for selected trade type if show_guide_for_selected_contract === true', () => {
        render(<GuideDescriptionModal {...mockProps} show_guide_for_selected_contract />);

        AVAILABLE_CONTRACTS.forEach(({ id }) =>
            id === CONTRACT_LIST.ACCUMULATORS
                ? expect(screen.getByText(id)).toBeInTheDocument()
                : expect(screen.queryByText(id)).not.toBeInTheDocument()
        );
    });
});
