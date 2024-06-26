import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { readFiles } from '@deriv/shared';
import FileUploader from '../file-uploader';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    compressImageFiles: jest.fn(() => Promise.resolve([{ path: 'hello.pdf' }])),
    readFiles: jest.fn(),
}));
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

describe('<FileUploader />', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        jest.clearAllMocks();
    });

    const props: React.ComponentProps<typeof FileUploader> = {
        onFileDrop: jest.fn(),
    };

    const large_file_error_msg = /file size should be 8mb or less/i;
    const file_not_supported_msg = /file uploaded is not supported/i;
    const drop_click_msg = /drag and drop a file or click to browse your files/i;
    const click_msg = /click here to browse your files/i;

    it('should render FileUploader component in desktop mode', () => {
        render(<FileUploader {...props} />);
        expect(screen.getByText(drop_click_msg)).toBeInTheDocument();
    });

    it('should render FileUploader component in mobile mode', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<FileUploader {...props} />);
        expect(screen.getByText(click_msg)).toBeInTheDocument();
    });

    it('should upload supported file', async () => {
        render(<FileUploader {...props} />);

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });

        const input: HTMLInputElement = screen.getByTestId('dt_file_upload_input');
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(input?.files?.[0]).toBe(file);
            expect(input.files).toHaveLength(1);
        });
    });

    it('should show error message when unsupported file is uploaded', async () => {
        render(<FileUploader {...props} />);

        const file = new File(['hello'], 'hello.html', { type: 'html' });
        const input = screen.getByTestId('dt_file_upload_input');
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText(file_not_supported_msg)).toBeInTheDocument();
        });
    });

    it('should show error message when multiple files are uploaded', async () => {
        render(<FileUploader {...props} />);

        const files = [
            new File(['hello'], 'hello.png', { type: 'image/png' }),
            new File(['there'], 'there.png', { type: 'image/png' }),
        ];
        const input = screen.getByTestId('dt_file_upload_input');
        fireEvent.change(input, { target: { files: [files] } });

        await waitFor(() => {
            expect(screen.getByText(file_not_supported_msg)).toBeInTheDocument();
        });
    });

    it('should show error message when larger files are uploaded', async () => {
        render(<FileUploader {...props} />);
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        Object.defineProperty(file, 'size', { value: 1024 * 1024 * 10 });

        const input = screen.getByTestId('dt_file_upload_input');
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText(large_file_error_msg)).toBeInTheDocument();
        });
    });

    it('should remove the file when close icon is clicked', async () => {
        render(<FileUploader {...props} />);
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });

        const input: HTMLInputElement = screen.getByTestId('dt_file_upload_input');
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText(/hello\.png/i)).toBeInTheDocument();
            expect(input?.files?.[0]).toBe(file);
            expect(input.files).toHaveLength(1);
        });

        const close_icon = screen.getByTestId('dt_remove_file_icon');
        expect(close_icon).toBeInTheDocument();
        fireEvent.click(close_icon);

        await waitFor(() => {
            expect(screen.queryByText(/hello\.png/i)).not.toBeInTheDocument();
        });
    });

    it('upload methods should reject if readFile returns empty array ', async () => {
        (readFiles as jest.Mock).mockResolvedValue([]);

        render(<FileUploader {...props} />);
        const blob = new Blob(['sample_data']);
        const file = new File([blob], 'hello.pdf', { type: 'application/pdf' });

        const input = screen.getByTestId('dt_file_upload_input') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(screen.getByText(/hello\.pdf/i)).toBeInTheDocument();
            expect(input?.files?.[0]).toBe(file);
        });

        expect(props.onFileDrop).toBeCalled();
    });
});
