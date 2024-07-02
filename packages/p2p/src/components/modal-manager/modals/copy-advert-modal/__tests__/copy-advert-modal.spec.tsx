import React from 'react';
import { render, screen } from '@testing-library/react';
import { APIProvider } from '@deriv/api';
import { mockStore, P2PSettingsProvider, StoreProvider } from '@deriv/stores';
import { adverts } from 'Pages/my-ads/__mocks__/mock-data';
import { useStores } from 'Stores/index';
import CopyAdvertModal from '../copy-advert-modal';

const wrapper = ({ children }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>
            <P2PSettingsProvider>{children}</P2PSettingsProvider>
        </StoreProvider>
    </APIProvider>
);

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        payment_method_ids: [],
        payment_method_names: [],
        setMinCompletionRate: jest.fn(),
        setMinJoinDays: jest.fn(),
        setShowEditAdForm: jest.fn(),
    },
};

const el_modal = document.createElement('div');

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => ({
        hideModal: jest.fn(),
        is_modal_open: true,
    })),
}));

describe('<CopyAdvertModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render CopyAdvertModal', () => {
        render(<CopyAdvertModal advert={adverts[0]} country_list={{}} />, { wrapper });

        expect(screen.getByText('Create a similar ad')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' }));
        expect(screen.getByRole('button', { name: 'Create ad' }));
    });
});
