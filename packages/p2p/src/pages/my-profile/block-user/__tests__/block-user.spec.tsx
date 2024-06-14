import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import BlockUser from '../block-user';

const el_modal = document.createElement('div');

const mock_trade_partners_list = [
    { id: '0', is_blocked: 0, name: 'testA' },
    { id: '1', is_blocked: 1, name: 'testB' },
];

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        show_advertiser_page: false,
    },
    general_store: {
        active_index: 3,
        block_unblock_user_error: '',
        error_code: '',
        setBlockUnblockUserError: jest.fn(),
    },
    my_profile_store: {
        active_tab: my_profile_tabs.MY_COUNTERPARTIES,
        block_user_sort_list: [
            {
                text: localize('All'),
                value: 'all_users',
            },
            {
                text: localize('Blocked'),
                value: 'blocked_users',
            },
        ],
        getSearchedTradePartners: jest.fn(),
        getTradePartnersList: jest.fn(),
        has_more_items_to_load: false,
        is_loading: false,
        onSubmit: jest.fn(),
        rendered_trade_partners_list: mock_trade_partners_list,
        selected_trade_partner: {
            is_blocked: 0,
            name: 'test',
        },
        setActiveTab: jest.fn(),
        setIsBlockUserTableLoading: jest.fn(),
        setSearchResults: jest.fn(),
        setSearchTerm: jest.fn(),
        setTradePartnersList: jest.fn(),
        should_show_block_user_list_header: false,
        trade_partners_list: mock_trade_partners_list,
    },
};

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    showModal: jest.fn(),
    useRegisterModalProps: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DesktopWrapper: jest.fn(({ children }) => children),
    MobileOrTabletWrapper: jest.fn(({ children }) => children),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('../block-user-list', () => jest.fn(() => <div>BlockUserList</div>));

describe('<BlockUser />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the BlockUser component', () => {
        render(<BlockUser />);

        expect(screen.getAllByText('BlockUserList')).toHaveLength(2);
    });

    it('should call setActiveTab when clicking on pageReturn', () => {
        render(<BlockUser />);

        const pageReturnIcon = screen.getByTestId('dt_mobile_full_page_return_icon');
        userEvent.click(pageReturnIcon);

        expect(mock_store.my_profile_store.setActiveTab).toBeCalledWith(my_profile_tabs.MY_STATS);
    });

    it('should call showModal and setBlockUnblockUserError when block_unblock_user_error changes', () => {
        mock_store.general_store.block_unblock_user_error = 'test error';

        render(<BlockUser />);

        expect(mock_modal_manager.showModal).toHaveBeenCalled();
        expect(mock_store.general_store.setBlockUnblockUserError).toHaveBeenCalledWith(null);
    });
});
