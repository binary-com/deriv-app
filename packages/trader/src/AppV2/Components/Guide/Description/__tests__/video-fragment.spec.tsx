import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import VideoFragment from '../video-fragment';

const loader = 'dt_initial_loader';
const video_fragment = 'dt_video_fragment';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getUrlBase: jest.fn(() => 'video_src.mp4'),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isDesktop: false,
        isMobile: true,
        isTablet: false,
    })),
}));

describe('VideoFragment', () => {
    it('should render component with loader and video', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        render(<VideoFragment contract_type={CONTRACT_LIST.ACCUMULATORS} />);

        expect(screen.getByTestId(loader)).toBeInTheDocument();
        expect(screen.getByTestId(video_fragment)).toBeInTheDocument();
    });

    it('should render only video (without loader) when data is loaded', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<VideoFragment contract_type={CONTRACT_LIST.ACCUMULATORS} />);

        const video = screen.getByTestId(video_fragment);

        expect(screen.getByTestId(loader)).toBeInTheDocument();
        fireEvent.loadedData(video);
        expect(screen.queryByTestId(loader)).not.toBeInTheDocument();
        expect(screen.getByTestId(video_fragment)).toBeInTheDocument();
    });
});
