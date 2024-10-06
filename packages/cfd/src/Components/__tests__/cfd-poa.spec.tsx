import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import CFDPOA from '../cfd-poa';
import CFDProviders from '../../cfd-providers';

const mock_kyc_auth_status_response = {
    kyc_auth_status: {
        address: {
            supported_documents: ['utility_bill', 'affidavit', 'poa_others'],
        },
    },
    isLoading: false,
    isSuccess: false,
};

jest.mock('@deriv/account/src/Components/forms/personal-details-form.jsx', () =>
    jest.fn(() => <div>PersonalDetailsForm</div>)
);
jest.mock('@deriv/account/src/Components/poa/common-mistakes/common-mistake-examples', () =>
    jest.fn(() => <div>CommonMistakeExamples</div>)
);

jest.mock('@deriv/account/src/hooks', () => ({
    useKycAuthStatus: jest.fn(() => mock_kyc_auth_status_response),
}));

jest.mock('@deriv/account/src/Components/leave-confirm', () => jest.fn(() => <div>LeaveConfirm</div>));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    validPostCode: jest.fn(() => true),
    validLength: jest.fn(() => true),
    validLetterSymbol: jest.fn(() => true),
    validAddress: jest.fn(() => ({
        is_ok: true,
    })),
    WS: {
        authorized: {
            storage: {
                getSettings: jest.fn().mockResolvedValue({
                    get_settings: {
                        address_line_1: 'test address_line_1',
                        address_line_2: 'test address_line_2',
                        address_city: 'test address_city',
                        address_state: 'test address_state',
                        address_postcode: 'test address_postcode',
                    },
                }),
                getAccountStatus: jest.fn().mockResolvedValue({
                    get_account_status: {
                        authentication: {
                            document: {
                                status: 'none',
                            },
                            identity: {
                                status: 'none',
                            },
                        },
                    },
                }),
            },
        },
        setSettings: jest.fn(() => Promise.resolve({ error: '' })),
        wait: jest.fn(() => Promise.resolve([])),
        getSocket: jest.fn().mockReturnValue({}),
    },
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useFileUploader: jest.fn(() => ({
        upload: jest.fn(),
    })),
}));

describe('<CFDPOA />', () => {
    const mock_props: React.ComponentProps<typeof CFDPOA> = {
        index: 0,
        onSave: jest.fn(),
        onSubmit: jest.fn(),
    };
    const mock_store = mockStore({
        client: {
            account_settings: {
                address_line_1: 'test address_line_1',
                address_line_2: 'test address_line_2',
                address_city: 'test address_city',
                address_state: 'test address_state',
                address_postcode: 'test address_postcode',
                country_code: 'in',
            },
            fetchResidenceList: jest.fn(() => Promise.resolve('')),
            getChangeableFields: jest.fn(() => []),
        },
    });

    it('should render CFDPOA and trigger buttons', async () => {
        render(
            <BrowserRouter>
                <CFDProviders store={mock_store}>
                    <CFDPOA {...mock_props} />
                </CFDProviders>
            </BrowserRouter>
        );

        expect(await screen.findByText('PersonalDetailsForm')).toBeInTheDocument();

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Continue');
        expect(button).toBeDisabled();

        const uploader = screen.getByTestId('dt_file_upload_input');
        const file = new File(['test file'], 'test_file.png', { type: 'image/png' });
        const dt_document_type = screen.getByRole('textbox', { name: /Type of document/ });
        fireEvent.change(dt_document_type, { target: { value: 'utility_bill' } });
        await waitFor(() => {
            userEvent.upload(uploader, file);
        });

        expect(button).toBeEnabled();

        userEvent.click(button);

        await waitFor(() => {
            expect(mock_props.onSave).toHaveBeenCalled();
            expect(mock_props.onSubmit).toHaveBeenCalled();
        });
    });

    it('should render duplicate document error message if has_submitted_duplicate_poa is true ', async () => {
        const setHasSubmittedDuplicatePOA = jest.fn();
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, setHasSubmittedDuplicatePOA]);

        render(
            <BrowserRouter>
                <CFDProviders store={mock_store}>
                    <CFDPOA {...mock_props} />
                </CFDProviders>
            </BrowserRouter>
        );
        expect(screen.getByText(/we could not verify your proof of address/i)).toBeInTheDocument();
        expect(screen.getByText(/proof of address documents upload failed/i)).toBeInTheDocument();
        expect(screen.getByText(/try again/i)).toBeInTheDocument();
        const submit_btn = screen.getByRole('button', { name: 'Try again' });

        userEvent.click(submit_btn);
        expect(setHasSubmittedDuplicatePOA).toHaveBeenCalledWith(false);
    });
});
