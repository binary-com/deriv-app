import React, { ComponentProps } from 'react';
import { Formik } from 'formik';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as utils from '../../../../utils/idvFormUtils';
import { IDVForm } from '../IDVForm';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

type TIDVFormProps = ComponentProps<typeof IDVForm>;

const documentAName = 'Document 1';
const documentBName = 'Document 2';

const mockProps: TIDVFormProps = {
    countryCode: 'in',
    supportedDocuments: {
        document_1: {
            additional: {
                display_name: 'Additional Document',
                format: '^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$',
            },
            display_name: documentAName,
            format: '^[0-9]{12}$',
        },
        document_2: {
            display_name: documentBName,
            format: '^[a-zA-Z0-9]{10,17}$',
        },
    },
};

const mockDocumentConfig = {
    additional: {
        displayName: 'Additional doc',
        exampleFormat: 'ABCDE1234F',
        format: '^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$',
    },
    exampleFormat: '1234567890',
    id: 'document_1',
    text: documentAName,
    value: '^[0-9]{12}$',
};

describe('IDVForm', () => {
    const renderComponent = (props: TIDVFormProps = mockProps) => {
        return render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <IDVForm {...props} />
            </Formik>
        );
    };

    const documentTypeLabel = 'Choose the document type';

    const defaultIDVSkipMessage = 'I want to do this later';

    it('should render IDVForm', () => {
        renderComponent();

        expect(screen.getByText(/Choose the document type/i)).toBeInTheDocument();
        expect(screen.getByText(/Enter your document number/i)).toBeInTheDocument();
    });

    it('should throw error when IDVform is not wrapped with Formik', () => {
        expect(() => render(<IDVForm {...mockProps} />)).toThrowError();
    });

    it('Should change the document type value when document type is changed', async () => {
        jest.spyOn(utils, 'getSelectedDocumentConfigData').mockReturnValue(mockDocumentConfig);
        renderComponent();
        const elDocumentType = screen.getByLabelText(documentTypeLabel);

        expect(elDocumentType).toHaveValue('');

        userEvent.click(elDocumentType);

        userEvent.click(screen.getByText(documentAName));

        await waitFor(() => {
            expect(elDocumentType).toHaveValue('Document 1');
        });
    });

    it('should render the hint messages for the selected document', async () => {
        jest.spyOn(utils, 'getSelectedDocumentConfigData').mockReturnValue(mockDocumentConfig);
        renderComponent();
        const elDocumentType = screen.getByLabelText(documentTypeLabel);

        userEvent.click(elDocumentType);

        const elSelectedOption = await screen.findByText(documentAName);

        userEvent.click(elSelectedOption);

        expect(await screen.findByText('Example: 1234567890')).toBeInTheDocument();
    });

    it("Should hide document number field when 'I dont have any of these is chosen'", async () => {
        const newProps = {
            ...mockProps,
            allowDefaultValue: true,
        };

        renderComponent(newProps);

        const elDocumentTypeInput = screen.getByLabelText(documentTypeLabel);
        const elDocumentNumberInput = screen.getByText('Enter your document number');

        expect(elDocumentTypeInput).toBeVisible();
        expect(elDocumentNumberInput).toBeVisible();

        userEvent.click(elDocumentTypeInput);

        const elSelectedOption = await screen.findByText("I don't have any of these");

        userEvent.click(elSelectedOption);
        await waitFor(() => {
            expect(elDocumentNumberInput).not.toBeVisible();
        });
    });

    it('should display option to do it later when allowIDVSkip is set', () => {
        const newProps = {
            ...mockProps,
            allowDefaultValue: true,
            allowIDVSkip: true,
        };

        renderComponent(newProps);

        const elDocumentTypeInput = screen.getByLabelText(documentTypeLabel);
        userEvent.click(elDocumentTypeInput);

        expect(screen.getByText(defaultIDVSkipMessage));
    });

    it('should skip default option when allowDefaultValue is not set', () => {
        renderComponent();

        const elDocumentTypeInput = screen.getByLabelText(documentTypeLabel);
        userEvent.click(elDocumentTypeInput);

        expect(screen.queryByText(defaultIDVSkipMessage)).not.toBeInTheDocument();
        expect(screen.queryByText("I don't have any of these")).not.toBeInTheDocument();
    });
});
