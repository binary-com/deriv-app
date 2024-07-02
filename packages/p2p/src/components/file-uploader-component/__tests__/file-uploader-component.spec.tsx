import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploaderComponent from '../file-uploader-component';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    compressImageFiles: jest.fn(() => Promise.resolve([{ path: 'hello.pdf' }])),
    readFiles: jest.fn(),
}));

jest.mock('@binary-com/binary-document-uploader');

describe('<FileUploaderComponent />', () => {
    const file: File = new File(['hello'], 'hello.png', { type: 'image/png' });
    const props = {
        accept: 'image/pdf, image/png',
        hover_message: 'hover here',
        max_size: 2097152,
        multiple: false,
        onDropAccepted: jest.fn(),
        onDropRejected: jest.fn(),
        validation_error_message: '',
        onClickClose: jest.fn(),
        upload_message: 'upload here',
        value: [] as File[],
    };

    it('should render FileUploaderComponent component in desktop mode', async () => {
        render(<FileUploaderComponent {...props} />);
        expect(screen.getByText('upload here')).toBeInTheDocument();
    });

    it('should upload supported file', async () => {
        props.value = [file];

        render(<FileUploaderComponent {...props} />);

        const input = screen.getByTestId('dt_file_upload_input') as HTMLInputElement;
        userEvent.upload(input, file);

        await waitFor(() => {
            if (input.files) {
                expect(input.files[0]).toBe(file);
                expect(input.files).toHaveLength(1);
            }
        });

        expect(screen.getByText('hello.png')).toBeInTheDocument();
    });

    it('should show validation_error_message when unsupported file is uploaded', async () => {
        props.validation_error_message = 'error';

        render(<FileUploaderComponent {...props} />);

        const unsupported_file = new File(['hello'], 'hello.html', { type: 'html' });
        const input = screen.getByTestId('dt_file_upload_input');
        userEvent.upload(input, unsupported_file);

        await waitFor(() => {
            expect(screen.getByText('error')).toBeInTheDocument();
        });
    });

    it('should render validation error message if validation_error_message is passed as a function', () => {
        props.validation_error_message = () => 'error';

        render(<FileUploaderComponent {...props} />);

        expect(screen.getByText('error')).toBeInTheDocument();
    });

    it('should return multiple files and single filenames if multiple is true, values > 0 and validation_error_message is empty', async () => {
        const file_bye: File = new File(['bye'], 'bye.png', { type: 'image/png' });
        props.multiple = true;
        props.value = [file, file_bye];
        props.validation_error_message = '';

        render(<FileUploaderComponent {...props} />);

        const input = screen.getByTestId('dt_file_upload_input') as HTMLInputElement;
        userEvent.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText('hello.png')).toBeInTheDocument();
            expect(screen.getByText('bye.png')).toBeInTheDocument();
        });
    });
});
