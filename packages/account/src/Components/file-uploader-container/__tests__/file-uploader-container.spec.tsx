import React from 'react';
import { render, screen } from '@testing-library/react';
import FileUploaderContainer from '../file-uploader-container';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => 'mockedIcon'),
    };
});
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

describe('<FileUploaderContainer />', () => {
    let mock_props: React.ComponentProps<typeof FileUploaderContainer>;

    beforeEach(() => {
        mock_props = {
            examples: '',
            files_description: '',
            onFileDrop: jest.fn(),
        };
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        jest.clearAllMocks();
    });
    const file_size_msg = /maximum size: 8MB/i;
    const file_type_msg = /supported formats: JPEG, JPG, PNG, PDF, and GIF only/i;
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
        render(<FileUploaderContainer {...mock_props} />);
        runCommonTests();
    });

    it('files description and examples should be shown when passed', () => {
        mock_props.files_description = <div>Files description</div>;
        mock_props.examples = <div>Files failure examples</div>;

        render(<FileUploaderContainer {...mock_props} />);
        expect(screen.getByText('Files description')).toBeInTheDocument();
        expect(screen.getByText('Files failure examples')).toBeInTheDocument();
    });

    it('should show hint message for desktop', () => {
        render(<FileUploaderContainer {...mock_props} />);
        expect(screen.getByText(hint_msg_desktop)).toBeInTheDocument();
        expect(screen.queryByText(hint_msg_mobile)).not.toBeInTheDocument();
    });

    it('should show hint message for mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<FileUploaderContainer {...mock_props} />);
        expect(screen.getByText(hint_msg_mobile)).toBeInTheDocument();
        expect(screen.queryByText(hint_msg_desktop)).not.toBeInTheDocument();
    });
});
