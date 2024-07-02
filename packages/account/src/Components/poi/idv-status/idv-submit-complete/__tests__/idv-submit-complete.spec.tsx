import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { IDV_ERROR_STATUS } from '@deriv/shared';
import IdvSubmitComplete from '../idv-submit-complete';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightWaitingPoiIcon: () => 'DerivLightWaitingPoiIcon',
}));

type TIdvSubmitCompleteProps = React.ComponentProps<typeof IdvSubmitComplete>;

describe('<IdvSubmitComplete/>', () => {
    const mock_props: TIdvSubmitCompleteProps = {
        needs_poa: false,
        is_from_external: false,
        redirect_button: '',
    };

    const store = mockStore({
        client: {
            account_status: {
                p2p_poa_required: 0,
                authentication: {
                    attempts: {
                        count: 0,
                        history: [],
                    },
                },
            },
        },
    });

    const renderComponent = ({ props = mock_props, store_config = store }) =>
        render(
            <StoreProvider store={store_config}>
                <BrowserRouter>
                    <IdvSubmitComplete {...props} />
                </BrowserRouter>
            </StoreProvider>
        );

    it('should render IdvSubmitComplete component external, no needs_poa, without mismatch_status', () => {
        const new_props: TIdvSubmitCompleteProps = {
            ...mock_props,
            redirect_button: 'Mock Redirect Button',
        };
        renderComponent({ props: new_props });

        expect(screen.getByText('DerivLightWaitingPoiIcon')).toBeInTheDocument();
        expect(screen.getByText('Mock Redirect Button')).toBeInTheDocument();
        expect(screen.getByText('Your documents were submitted successfully')).toBeInTheDocument();
        expect(
            screen.getByText('We’ll review your documents and notify you of its status within 5 minutes.')
        ).toBeInTheDocument();
        expect(screen.queryByText('Your profile is updated')).not.toBeInTheDocument();
        expect(screen.queryByText('Your document has been submitted')).not.toBeInTheDocument();
        expect(
            screen.queryByText(
                "We'll review your proof of identity again and will give you an update as soon as possible."
            )
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Next, we'll need your proof of address.")).not.toBeInTheDocument();
    });

    it('should render IdvSubmitComplete component needs_poa not external, without mismatch_status and redirect_button', () => {
        const new_props: TIdvSubmitCompleteProps = {
            ...mock_props,
            needs_poa: true,
        };

        renderComponent({ props: new_props });

        expect(screen.getByText('DerivLightWaitingPoiIcon')).toBeInTheDocument();
        expect(screen.getByText('Your documents were submitted successfully')).toBeInTheDocument();
        expect(screen.getByText('Submit proof of address')).toBeInTheDocument();
        expect(screen.getByText("Next, we'll need your proof of address.")).toBeInTheDocument();
        expect(screen.queryByText('Your profile is updated')).not.toBeInTheDocument();
        expect(screen.queryByText('Your document has been submitted')).not.toBeInTheDocument();
        expect(
            screen.queryByText(
                "We'll review your proof of identity again and will give you an update as soon as possible."
            )
        ).not.toBeInTheDocument();
    });

    it('should render IdvSubmitComplete component with mismatch_status ', () => {
        const new_store = mockStore({
            client: {
                is_already_attempted: true,
            },
        });

        const new_props: TIdvSubmitCompleteProps = {
            ...mock_props,
            mismatch_status: IDV_ERROR_STATUS.NameDobMismatch.code,
        };
        renderComponent({ props: new_props, store_config: new_store });

        expect(screen.getByText('DerivLightWaitingPoiIcon')).toBeInTheDocument();
        expect(screen.getByText('Your profile is updated')).toBeInTheDocument();
        expect(
            screen.getByText(
                "We'll review your proof of identity again and will give you an update as soon as possible."
            )
        ).toBeInTheDocument();
        expect(
            screen.queryByText('We’ll review your documents and notify you of its status within 5 minutes.')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Your documents were submitted successfully')).not.toBeInTheDocument();
        expect(screen.queryByText('Your document has been submitted')).not.toBeInTheDocument();
        expect(screen.queryByText("Next, we'll need your proof of address.")).not.toBeInTheDocument();
    });

    it('should render IdvSubmitComplete component with mismatch_status', () => {
        const new_store = mockStore({
            client: {
                is_already_attempted: true,
            },
        });

        const new_props: TIdvSubmitCompleteProps = {
            ...mock_props,
            mismatch_status: IDV_ERROR_STATUS.Expired.code,
        };
        renderComponent({ props: new_props, store_config: new_store });

        expect(screen.getByText('DerivLightWaitingPoiIcon')).toBeInTheDocument();
        expect(screen.getByText('Your document has been submitted')).toBeInTheDocument();
        expect(
            screen.getByText(
                "We'll review your proof of identity again and will give you an update as soon as possible."
            )
        ).toBeInTheDocument();
        expect(
            screen.queryByText('We’ll review your documents and notify you of its status within 5 minutes.')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Your profile is updated')).not.toBeInTheDocument();
        expect(screen.queryByText('Your documents were submitted successfully')).not.toBeInTheDocument();
        expect(screen.queryByText("Next, we'll need your proof of address.")).not.toBeInTheDocument();
    });
});
