import React from 'react';
import { render, screen } from '@testing-library/react';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import VideoPreview from '../video-preview';

const mock_props = { contract_type: CONTRACT_LIST.ACCUMULATORS, toggleVideoPlayer: jest.fn(), video_src: '' };
const content = 'Watch this video to learn about this trade type.';

describe('VideoPreview', () => {
    it('should render component if contract type is not Turbos', () => {
        render(<VideoPreview {...mock_props} />);

        expect(screen.getByText(content)).toBeInTheDocument();
    });

    it('should not render component if contract type is Turbos', () => {
        render(<VideoPreview {...mock_props} contract_type={CONTRACT_LIST.TURBOS} />);

        expect(screen.queryByText(content)).not.toBeInTheDocument();
    });
});
