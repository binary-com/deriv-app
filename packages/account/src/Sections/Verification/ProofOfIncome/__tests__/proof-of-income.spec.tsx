import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WS } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import ProofOfIncome from '../proof-of-income';
import { income_status_codes } from '../proof-of-income-utils';
import { APIProvider } from '@deriv/api';

const mocked_account_status = {
    authentication: {
        attempts: { latest: { service: '' }, history: [] },
        document: {
            status: 'none',
        },
        identity: {
            status: 'none',
            services: { idv: {}, onfido: {}, manual: {} },
        },
        income: {
            status: income_status_codes.NONE,
        },
        needs_verification: [],
    },
    status: [],
};

const mock_kyc_auth_status_response = {
    kyc_auth_status: {
        address: {
            supported_documents: ['utility_bill', 'affidavit', 'poa_others'],
        },
    },
    isLoading: false,
    isSuccess: false,
};

jest.mock('@binary-com/binary-document-uploader');
jest.mock('Components/demo-message', () => jest.fn(() => 'MockedDemoMessage'));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            getAccountStatus: jest.fn(() =>
                Promise.resolve({
                    get_account_status: { ...mocked_account_status },
                })
            ),
        },
        getSocket: jest.fn(() => Promise.resolve()),
    },
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Redirect: jest.fn(() => <div>Redirect</div>),
}));

jest.mock('../../../../hooks', () => ({
    useKycAuthStatus: jest.fn(() => mock_kyc_auth_status_response),
}));

describe('ProofOfIncome', () => {
    const files_descriptions_title = 'The document must be recent and include your name and address:';
    const files_descriptions = [
        'The document must be up-to-date and signed by the issuance authority.',
        'The document must contain a letterhead.',
        'Invalid or incomplete documents shall be rejected.',
    ];
    const upload_warning = 'Remember, selfies, pictures of houses, or non-related images will be rejected.';
    const file_type_requirements = 'Supported formats: JPEG, JPG, PNG, PDF, and GIF only';

    let mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        mock_store = mockStore({});
    });

    const componentTestRender = (mock_store: ReturnType<typeof mockStore>) => {
        render(<ProofOfIncome />, {
            wrapper: ({ children }) => (
                <APIProvider>
                    <StoreProvider store={mock_store}>{children}</StoreProvider>
                </APIProvider>
            ),
        });
    };

    it('Should not render ProofOfIncome for demo account', () => {
        mock_store.client.is_virtual = true;
        componentTestRender(mock_store);

        expect(screen.getByText('MockedDemoMessage')).toBeInTheDocument();
    });

    it('Should redirect if ProofOfIncome is not required ', async () => {
        componentTestRender(mock_store);
        expect(await screen.findByText('Redirect')).toBeInTheDocument();
    });

    it('Should render ProofOfIncome form when it is required', async () => {
        const mocked_account_status_for_poinc_required = {
            authentication: {
                ...mocked_account_status.authentication,
                needs_verification: ['income'],
            },
            status: ['allow_document_upload', 'age_verification', 'authenticated'],
        };
        (WS.authorized.getAccountStatus as jest.Mock).mockResolvedValue({
            get_account_status: {
                ...mocked_account_status_for_poinc_required,
            },
        });

        componentTestRender(mock_store);
        expect(await screen.findByText(files_descriptions_title)).toBeInTheDocument();
        files_descriptions.forEach(description => {
            expect(screen.getByText(description)).toBeInTheDocument();
        });

        const dropdown_input = screen.getByPlaceholderText('Select your document*') as HTMLInputElement;
        expect(dropdown_input).toBeInTheDocument();
        expect(dropdown_input).toHaveValue('');
        const file_input = screen.getByTestId('dt_file_upload_input') as HTMLInputElement;
        expect(file_input.value).toBe('');
        expect(screen.getByText(upload_warning)).toBeVisible();
        expect(screen.getByText(file_type_requirements)).toBeVisible();
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Save and submit');
        expect(button).toBeDisabled();
    });

    it('Should render ProofOfIncome and upload the document successfully', async () => {
        const mocked_account_status_for_poinc_required = {
            authentication: {
                ...mocked_account_status.authentication,
                needs_verification: ['income'],
            },
            status: ['allow_document_upload', 'age_verification', 'authenticated'],
        };
        (WS.authorized.getAccountStatus as jest.Mock).mockResolvedValue({
            get_account_status: {
                ...mocked_account_status_for_poinc_required,
            },
        });

        componentTestRender(mock_store);
        const dropdown_input = (await screen.findByPlaceholderText('Select your document*')) as HTMLInputElement;
        expect(dropdown_input).toBeVisible();
        expect(dropdown_input.value).toBe('');
        const file_input = screen.getByTestId('dt_file_upload_input') as HTMLInputElement;
        expect(file_input.value).toBe('');
        expect(screen.getByText(upload_warning)).toBeVisible();
        expect(screen.getByText(file_type_requirements)).toBeVisible();
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Save and submit');
        expect(button).toBeDisabled();

        userEvent.type(dropdown_input, 'Tax return');
        await waitFor(() => {
            expect(dropdown_input.value).toBe('Tax return');
            expect(button).toBeDisabled();
        });

        const file = new File(['test document'], 'test_document.png', { type: 'image/png' });

        userEvent.upload(file_input, [file]);
        userEvent.type(dropdown_input, 'Tax return');

        await waitFor(() => {
            expect(file_input?.files?.[0]).toBe(file);
            expect(file_input.files).toHaveLength(1);
            expect(button).toBeEnabled();
        });
    });
});
