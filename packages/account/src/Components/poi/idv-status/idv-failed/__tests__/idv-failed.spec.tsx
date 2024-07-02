import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import IdvFailed from '../idv-failed';
import { IDV_ERROR_STATUS } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        wait: jest.fn().mockResolvedValue(true),
    },
    filterObjProperties: jest.fn(() => ({
        document_type: {
            id: '',
            text: '',
            value: '',
            example_format: '',
            sample_image: '',
        },
        document_number: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
    })),
}));

jest.mock('Components/forms/personal-details-form', () => jest.fn(() => <div>PersonalDetailsForm</div>));
jest.mock('Components/forms/idv-form', () => jest.fn(() => <div>IDVForm</div>));

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightNamePoiIcon: () => 'DerivLightNamePoiIcon',
    DerivLightNameDobPoiIcon: () => 'DerivLightNameDobPoiIcon',
    DerivLightDobPoiIcon: () => 'DerivLightDobPoiIcon',
}));

describe('<IdvFailed/>', () => {
    const mock_props: React.ComponentProps<typeof IdvFailed> = {
        getChangeableFields: jest.fn(() => []),
        is_from_external: false,
        residence_list: [],
        handleSubmit: jest.fn(),
        account_settings: {
            citizen: 'gh',
        },
        mismatch_status: IDV_ERROR_STATUS.NameMismatch.code,
        latest_status: {},
    };

    const store_config = mockStore({});

    const renderComponent = ({ props = mock_props, store = store_config }) =>
        render(
            <StoreProvider store={store}>
                <IdvFailed {...props} />
            </StoreProvider>
        );

    it('should render IDVfailed component with name mismatch message', async () => {
        renderComponent({});

        await waitFor(() => {
            expect(screen.getByTestId(IDV_ERROR_STATUS.NameMismatch.code)).toBeInTheDocument();
            expect(screen.getByText('PersonalDetailsForm')).toBeInTheDocument();
        });
    });

    it('should render IDVfailed component with dob mismatch message', async () => {
        const new_props = { ...mock_props, mismatch_status: IDV_ERROR_STATUS.DobMismatch.code };
        renderComponent({ props: new_props });

        await waitFor(() => {
            expect(screen.getByTestId(IDV_ERROR_STATUS.DobMismatch.code)).toBeInTheDocument();
        });
    });

    it('should render IDVfailed component with name & DOB mismatch message', async () => {
        const new_props = {
            ...mock_props,
            mismatch_status: IDV_ERROR_STATUS.NameDobMismatch.code,
        };
        renderComponent({ props: new_props });

        await waitFor(() => {
            expect(screen.getByTestId(IDV_ERROR_STATUS.NameDobMismatch.code)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Update profile/i })).toBeInTheDocument();
        });
    });

    it('should render IDVfailed component with expired message', async () => {
        const new_props = { ...mock_props, mismatch_status: IDV_ERROR_STATUS.Expired.code };
        renderComponent({ props: new_props });

        await waitFor(() => {
            expect(screen.getByTestId(IDV_ERROR_STATUS.Expired.code)).toBeInTheDocument();
            expect(screen.getByText('IDVForm')).toBeInTheDocument();
            expect(screen.getByText('PersonalDetailsForm')).toBeInTheDocument();
        });
    });

    it('should render IDVfailed component with verification failed message', async () => {
        const new_props = { ...mock_props, mismatch_status: IDV_ERROR_STATUS.Failed.code };
        renderComponent({ props: new_props });

        await waitFor(() => {
            expect(screen.getByTestId(IDV_ERROR_STATUS.Failed.code)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Verify/i })).toBeInTheDocument();
        });
    });
});
