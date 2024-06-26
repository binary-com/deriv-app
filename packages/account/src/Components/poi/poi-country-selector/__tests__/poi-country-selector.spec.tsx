import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IDV_ERROR_STATUS, POIContext, TPOIContext } from '@deriv/shared';
import CountrySelector from '../poi-country-selector';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useResidenceList: jest.fn().mockReturnValue({
        data: [
            { value: 'Country 1', text: 'Country 1' },
            { value: 'Country 2', text: 'Country 2' },
            { value: 'Country 3', text: 'Country 3' },
        ],
    }),
}));

describe('<CountrySelector/>', () => {
    let mock_props: React.ComponentProps<typeof CountrySelector> = {
        handleSelectionNext: jest.fn(),
        is_from_external: false,
    };

    beforeEach(() => {
        mock_props = {
            handleSelectionNext: jest.fn(),
            is_from_external: false,
        };
    });

    const store_config = mockStore({});

    const poi_context_config: TPOIContext = {
        setSelectedCountry: jest.fn(),
        selected_country: {},
        setSubmissionService: jest.fn(),
        submission_status: 'selecting',
        setSubmissionStatus: jest.fn(),
        submission_service: 'idv',
    };

    const renderComponent = ({ props = mock_props, context = poi_context_config }) =>
        render(
            <APIProvider>
                <StoreProvider store={store_config}>
                    <POIContext.Provider value={context}>
                        <CountrySelector {...props} />
                    </POIContext.Provider>
                </StoreProvider>
            </APIProvider>
        );

    it('should render CountrySelector component external', () => {
        mock_props.is_from_external = true;

        renderComponent({ props: mock_props });

        expect(screen.getByText('Proof of identity')).toBeInTheDocument();
        expect(screen.getByText('In which country was your document issued?')).toBeInTheDocument();
        expect(screen.getByText('Country')).toBeInTheDocument();

        expect(screen.getByTestId('dt_external_dropdown')).toBeInTheDocument();
    });

    it('should show error message after clicking the input without choosing the country', async () => {
        renderComponent({});

        const field = screen.getByLabelText('Country');
        const next_btn = screen.getByRole('button');

        expect(field).toBeInTheDocument();
        expect(screen.queryByText(/please select a valid country of document issuance/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/please select the country of document issuance/i)).not.toBeInTheDocument();

        fireEvent.blur(field);
        expect(await screen.findByText(/please select the country of document issuance/i)).toBeInTheDocument();
        expect(next_btn).toBeDisabled();

        fireEvent.change(field, { target: { value: 'invalid country' } });
        expect(await screen.findByText(/please select a valid country of document issuance/i)).toBeInTheDocument();
        expect(next_btn).toBeDisabled();
    });

    it('should render error status and country selector when error is verification failed or expired', () => {
        mock_props.mismatch_status = IDV_ERROR_STATUS.Failed.code;

        renderComponent({ props: mock_props });

        expect(screen.getByText('Your identity verification failed because:')).toBeInTheDocument();
        expect(
            screen.getByText('We were unable to verify the identity document with the details provided.')
        ).toBeInTheDocument();
        expect(screen.getByText('In which country was your document issued?')).toBeInTheDocument();

        expect(screen.getByTestId('dt_external_dropdown')).toBeInTheDocument();
    });

    it('should trigger selection functions and next button', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });

        const new_poi_context_config = {
            ...poi_context_config,
            selected_country: { value: 'Country 2', text: 'Country 2' },
        };

        renderComponent({ context: new_poi_context_config });

        const field = screen.getByRole('combobox');

        fireEvent.change(field, { target: { value: 'Country 2' } });

        const next_btn = screen.getByRole('button');
        expect(next_btn).toBeEnabled();

        fireEvent.click(next_btn);
        await waitFor(() => {
            expect(mock_props.handleSelectionNext).toHaveBeenCalledTimes(1);
        });
    });

    it('should render high risk error message', () => {
        mock_props.mismatch_status = IDV_ERROR_STATUS.HighRisk.code;

        renderComponent({ props: mock_props });

        expect(
            screen.getByText(
                'For enhanced security, we need to reverify your identity. Kindly resubmit your proof of identity to unlock your account.'
            )
        ).toBeInTheDocument();
    });
});
