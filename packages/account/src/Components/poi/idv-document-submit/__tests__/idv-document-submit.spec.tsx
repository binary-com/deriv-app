import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { isDocumentNumberValid } from 'Helpers/utils';
import IdvDocumentSubmit from '../idv-document-submit';
import { useDevice } from '@deriv-com/ui';
import { APIProvider } from '@deriv/api';

const mock_store = mockStore({
    client: {
        getChangeableFields: jest.fn(() => []),
    },
});

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightUploadPoiIcon: () => 'DerivLightUploadPoiIcon',
}));

jest.mock('Helpers/utils', () => ({
    ...jest.requireActual('Helpers/utils'),
    getDocumentData: jest.fn((country_code, key) => {
        const data = {
            tc: {
                document_1: {
                    new_display_name: '',
                    example_format: '5436454364243',
                },
                document_2: {
                    new_display_name: '',
                    example_format: 'A-52431',
                },
            },
        };

        const document = data[country_code as keyof typeof data];
        return document[key as keyof typeof document];
    }),
    isDocumentNumberValid: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    formatInput: jest.fn(() => '5436454364243'),
    WS: {
        send: jest.fn(() => Promise.resolve({ error: '' })),
        setSettings: jest.fn(() => Promise.resolve({ error: '' })),
        authorized: {
            storage: {
                getSettings: jest.fn(() => Promise.resolve({ error: '' })),
            },
        },
    },
    filterObjProperties: jest.fn(() => ({
        first_name: 'test',
        last_name: 'test',
        date_of_birth: '1970-01-01',
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

describe('<IdvDocumentSubmit/>', () => {
    const mock_props: React.ComponentProps<typeof IdvDocumentSubmit> = {
        handleBack: jest.fn(),
        handleSelectionNext: jest.fn(),
        handleViewComplete: jest.fn(),
        selected_country: {
            value: 'tc',
            identity: {
                services: {
                    idv: {
                        documents_supported: {
                            document_1: {
                                display_name: 'Test document 1 name',
                                format: '5436454364243',
                            },
                            document_2: {
                                display_name: 'Test document 2 name',
                                format: 'A54321',
                            },
                        },
                        has_visual_sample: 1,
                    },
                },
            },
        },
        getChangeableFields: jest.fn(() => []),
    };

    const renderComponent = () => {
        render(
            <APIProvider>
                <StoreProvider store={mock_store}>
                    <IdvDocumentSubmit {...mock_props} />
                </StoreProvider>
            </APIProvider>
        );
    };

    it('should render IdvDocumentSubmit component', () => {
        renderComponent();

        expect(screen.getByText(/Identity verification/i)).toBeInTheDocument();
        expect(screen.getByText(/details/i)).toBeInTheDocument();
        expect(screen.queryByText('New ID type name')).not.toBeInTheDocument();
        expect(screen.queryByText('Please select a document type.')).not.toBeInTheDocument();

        const inputs = screen.getAllByRole<HTMLTextAreaElement>('textbox');
        expect(inputs).toHaveLength(5);
        expect(inputs[0].name).toBe('document_type');
        expect(inputs[1].name).toBe('document_number');
    });

    it('should  trigger "go back" button, inputs and check document_type validation after rendering IdvDocumentSubmit component', async () => {
        renderComponent();

        const backBtn = screen.getByRole('button', { name: /back/i });
        userEvent.click(backBtn);
        expect(mock_props.handleBack).toHaveBeenCalledTimes(1);

        const document_type_input = screen.getByLabelText('Choose the document type');
        const document_number_input = screen.getByPlaceholderText('Enter your document number');
        expect(document_number_input).toBeDisabled();
        expect(screen.queryByText('Test document 1 name')).not.toBeInTheDocument();
        expect(screen.queryByText('Test document 2 name')).not.toBeInTheDocument();

        userEvent.click(document_type_input);
        expect(await screen.findByText('Test document 1 name')).toBeInTheDocument();
        expect(await screen.findByText('Test document 2 name')).toBeInTheDocument();
        expect(screen.queryByText('Please select a document type.')).not.toBeInTheDocument();

        userEvent.tab();
        expect(await screen.findByText('Please select a document type.')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText('Test document 1 name')).not.toBeInTheDocument();
            expect(screen.queryByText('Test document 2 name')).not.toBeInTheDocument();
        });
    });

    it('should change inputs, check document_number validation and trigger "Verify" button after rendering IdvDocumentSubmit component', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });

        renderComponent();

        const verifyBtn = screen.getByRole('button', { name: /verify/i });
        expect(verifyBtn).toBeDisabled();

        const confirmation_checkbox = screen.getByLabelText(/i confirm that the name and date of birth/i);

        const document_type_input = screen.getByRole<HTMLTextAreaElement>('combobox');
        expect(document_type_input.name).toBe('document_type');
        const document_number_input = screen.getByPlaceholderText<HTMLTextAreaElement>('Enter your document number');
        expect(document_number_input.name).toBe('document_number');
        expect(document_number_input).toBeDisabled();

        userEvent.selectOptions(document_type_input, 'Test document 2 name');
        await waitFor(() => {
            expect(document_number_input).toBeEnabled();
        });
        expect(screen.queryByText(/please enter the correct format/i)).not.toBeInTheDocument();
        (isDocumentNumberValid as jest.Mock).mockReturnValueOnce('please enter your document number');
        fireEvent.blur(document_number_input);
        expect(await screen.findByText(/please enter your document number/i)).toBeInTheDocument();

        (isDocumentNumberValid as jest.Mock).mockReturnValueOnce('please enter the correct format');
        fireEvent.change(document_number_input, { target: { value: 'A-32523' } });
        expect(await screen.findByText(/please enter the correct format/i)).toBeInTheDocument();

        userEvent.type(document_number_input, '5436454364234');
        await waitFor(() => {
            expect(screen.queryByText(/please enter the correct format/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/please enter a valid ID number/i)).not.toBeInTheDocument();
            expect(confirmation_checkbox).toBeEnabled();
        });
        fireEvent.click(confirmation_checkbox);

        await waitFor(() => {
            expect(verifyBtn).toBeEnabled();
        });
        userEvent.click(verifyBtn);
        await waitFor(() => {
            expect(mock_props.handleViewComplete).toHaveBeenCalledTimes(1);
        });
    });
});
