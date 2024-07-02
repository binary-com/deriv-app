import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { useStores } from 'Stores/index';
import BlockUserRow from '../block-user-row';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        setSelectedAdState: jest.fn(),
    },
    general_store: {
        is_barred: false,
    },
    my_profile_store: {
        onClickUnblock: jest.fn(),
    },
};

const block_user_row_props = {
    row: {
        id: '1',
        is_blocked: 0,
        name: 'test',
    },
};

const history = createMemoryHistory();

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<BlockUserRow/>', () => {
    it('should render BlockUserRow component', () => {
        render(<BlockUserRow {...block_user_row_props} />);

        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Block' })).toBeInTheDocument();
    });

    it('should allow user to click on advertiser name if the user is not barred', () => {
        const { id, name } = block_user_row_props.row;

        render(
            <Router history={history}>
                <BlockUserRow {...block_user_row_props} />
            </Router>
        );

        const advertiserName = screen.getByText('test');

        userEvent.click(advertiserName);

        expect(mock_store.buy_sell_store.setSelectedAdState).toBeCalledWith({ advertiser_details: { id, name } });
    });

    it('should render the Block button if advertiser is not blocked and call onClickUnblock when clicked', () => {
        render(<BlockUserRow {...block_user_row_props} />);

        const blockButton = screen.getByRole('button', { name: 'Block' });

        expect(blockButton).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Unblock' })).not.toBeInTheDocument();

        userEvent.click(blockButton);

        expect(mock_store.my_profile_store.onClickUnblock).toBeCalledWith(block_user_row_props.row);
    });

    it('should render the Unblock button if advertiser is blocked and call onClickUnblock when clicked', () => {
        block_user_row_props.row.is_blocked = 1;

        render(<BlockUserRow {...block_user_row_props} />);

        const unblockButton = screen.getByRole('button', { name: 'Unblock' });

        expect(unblockButton).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Block' })).not.toBeInTheDocument();

        userEvent.click(unblockButton);

        expect(mock_store.my_profile_store.onClickUnblock).toBeCalledWith(block_user_row_props.row);
    });
});
