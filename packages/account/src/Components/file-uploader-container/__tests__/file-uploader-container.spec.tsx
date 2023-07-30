import React from 'react';
import { render, screen } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import FileUploaderContainer from '../file-uploader-container';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => 'mockedIcon'),
    };
});
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
    WS: {
        getSocket: jest.fn(),
    },
}));

describe('<FileUploaderContainer />', () => {
    let mock_props: React.ComponentProps<typeof FileUploaderContainer>;

    beforeEach(() => {
        mock_props = {
            examples: '',
            files_description: '',
            getSocket: jest.fn(),
            onFileDrop: jest.fn(),
            onRef: jest.fn(),
            settings: {},
        };

        (isDesktop as jest.Mock).mockReturnValue(true);
        (isMobile as jest.Mock).mockReturnValue(false);
        jest.clearAllMocks();
    });

    const file_size_msg = /maximum size: 8MB/i;
    const file_type_msg = /supported formats: JPEG, JPG, PNG and PDF only/i;
    const file_warning_msg = /remember, selfies, pictures of houses, or non-related images will be rejected./i;
    const hint_msg_desktop = /drag and drop a file or click to browse your files/i;
    const hint_msg_mobile = /click here to browse your files/i;

    const runCommonTests = () => {
        expect(screen.getByTestId('dt_file_uploader_container')).toBeInTheDocument();
        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.getByText(file_size_msg)).toBeInTheDocument();
        expect(screen.getByText(file_type_msg)).toBeInTheDocument();
        expect(screen.getByText(file_warning_msg)).toBeInTheDocument();
    };

    it('should render FileUploaderContainer component and show descriptions', () => {
        render(<FileUploaderContainer {...mock_props} />);
        runCommonTests();
    });

    it('should render FileUploaderContainer component if getSocket is not passed as prop', () => {
        delete mock_props.getSocket;
        render(<FileUploaderContainer {...mock_props} />);
        runCommonTests();
    });

    it('files description and examples should be shown when passed', () => {
        mock_props.files_description = <div>Files descriptions</div>;
        mock_props.examples = <div>Files failures examples</div>;

        render(<FileUploaderContainer {...mock_props} />);
        expect(screen.getByText('Files descriptions')).toBeInTheDocument();
        expect(screen.getByText('Files failures examples')).toBeInTheDocument();
    });

    it('should show hint message for desktop', () => {
        render(<FileUploaderContainer {...mock_props} />);
        expect(screen.getByText(hint_msg_desktop)).toBeInTheDocument();
        expect(screen.queryByText(hint_msg_mobile)).not.toBeInTheDocument();
    });

    it('should show hint message for mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);

        render(<FileUploaderContainer {...mock_props} />);
        expect(screen.getByText(hint_msg_mobile)).toBeInTheDocument();
        expect(screen.queryByText(hint_msg_desktop)).not.toBeInTheDocument();
    });

    it('should call ref function on rendering the component', () => {
        render(<FileUploaderContainer {...mock_props} />);

        expect(mock_props.onRef).toHaveBeenCalled();
    });
});
