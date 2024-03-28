import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useManualForm } from '../../../../hooks';
import { ManualUpload } from '../ManualUpload';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('../../../../hooks', () => ({
    ...jest.requireActual('../../../../hooks'),
    useManualForm: jest.fn().mockReturnValue({
        isExpiryDateRequired: true,
        isLoading: false,
        poiService: 'manual',
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useOnfido: jest.fn(() => ({
        data: {},
        isOnfidoInitialized: true,
        isServiceTokenLoading: false,
    })),
}));

describe('ManualUpload', () => {
    beforeAll(() => {
        global.URL.createObjectURL = jest.fn();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should render DocumentSelection when no document is selected', () => {
        render(<ManualUpload countryCode='in' />);

        expect(screen.getByText('Please upload one of the following documents:')).toBeInTheDocument();
        expect(screen.getAllByTestId('dt_manual_document_types')).toHaveLength(3);
    });

    it('should render 4 documents for Nigeria', () => {
        render(<ManualUpload countryCode='ng' />);

        expect(screen.getAllByTestId('dt_manual_document_types')).toHaveLength(4);
    });

    it('should render ManualUploadContainer when a document is selected', () => {
        render(<ManualUpload countryCode='in' />);

        const elDocumentType = screen.getAllByTestId('dt_manual_document_types')[0];
        userEvent.click(elDocumentType);

        expect(screen.queryByText('Please upload one of the following documents:')).not.toBeInTheDocument();
        expect(screen.getAllByRole('textbox')).toHaveLength(2);
    });

    it('should disable Next button when form is not filled', () => {
        render(<ManualUpload countryCode='in' />);

        const elDocumentType = screen.getAllByTestId('dt_manual_document_types')[1];
        userEvent.click(elDocumentType);

        const elNextButton = screen.getByRole('button', { name: /Next/ });
        expect(elNextButton).toBeDisabled();
    });

    it('should enable Next button when form is filled', async () => {
        (useManualForm as jest.Mock).mockReturnValue({
            isExpiryDateRequired: false,
            isLoading: false,
            poiService: 'manual',
        });
        render(<ManualUpload countryCode='ng' />);

        const elDocumentType = screen.getAllByTestId('dt_manual_document_types')[0];
        userEvent.click(elDocumentType);

        const elInput = screen.getByRole('textbox', { name: /Passport number/ });
        userEvent.type(elInput, '123456');

        const file = new File(['test file content'], 'test-file.pdf', { type: 'application/pdf' });

        await waitFor(() => {
            const input = screen.getByTestId('dt_dropzone_input');
            userEvent.upload(input, file);
        });

        expect(screen.getByRole('button', { name: /Next/ })).toBeEnabled();
    });

    it('should enable selfie page after filling document details', async () => {
        (useManualForm as jest.Mock).mockReturnValue({
            isExpiryDateRequired: false,
            isLoading: false,
            poiService: 'manual',
        });
        render(<ManualUpload countryCode='ng' />);

        const elDocumentType = screen.getAllByTestId('dt_manual_document_types')[0];
        userEvent.click(elDocumentType);

        const elInput = screen.getByRole('textbox', { name: /Passport number/ });
        userEvent.type(elInput, '123456');

        const file = new File(['test file content'], 'test-file.pdf', { type: 'application/pdf' });

        await waitFor(() => {
            const input = screen.getByTestId('dt_dropzone_input');
            userEvent.upload(input, file);
        });
        await waitFor(() => {
            const elNextButton = screen.getByRole('button', { name: /Next/ });
            userEvent.click(elNextButton);
        });

        expect(screen.getAllByText(/Upload your selfie/)).toHaveLength(2);
    });

    it('should render DocumentSelection when back button is clicked', () => {
        render(<ManualUpload countryCode='in' />);

        const elDocumentType = screen.getAllByTestId('dt_manual_document_types')[0];
        userEvent.click(elDocumentType);

        expect(screen.queryByTestId('dt_manual_document_types')).not.toBeInTheDocument();

        const elBackButton = screen.getByText(/Back/);
        userEvent.click(elBackButton);

        expect(screen.getAllByTestId('dt_manual_document_types')).toHaveLength(3);
    });

    it('should render OnfidoContainer when poiService is onfido', () => {
        (useManualForm as jest.Mock).mockReturnValue({
            isExpiryDateRequired: false,
            isLoading: false,
            poiService: 'onfido',
        });
        render(<ManualUpload countryCode='ng' />);

        const elDocumentType = screen.getAllByTestId('dt_manual_document_types')[3];
        userEvent.click(elDocumentType);

        expect(screen.getByTestId('dt_onfido_element')).toBeVisible();
    });
});
