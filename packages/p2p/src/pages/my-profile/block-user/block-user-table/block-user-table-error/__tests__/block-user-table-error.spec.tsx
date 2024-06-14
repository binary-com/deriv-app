import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores/index';
import BlockUserTableError from '../block-user-table-error';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_profile_store: {
        setActiveTab: jest.fn(),
    },
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

describe('<BlockUserTableError />', () => {
    it('should render the BlockUserTableError component', () => {
        render(<BlockUserTableError error_message='test error' />);

        expect(screen.getByText('Blocked advertisers')).toBeInTheDocument();
        expect(screen.getAllByText('test error')).toHaveLength(2);
    });

    it('should call setActiveTab when clicking return icon', () => {
        render(<BlockUserTableError error_message='test error' />);

        const pageReturnIcon = screen.getByTestId('dt_mobile_full_page_return_icon');

        userEvent.click(pageReturnIcon);

        expect(mock_store.my_profile_store.setActiveTab).toBeCalledWith(my_profile_tabs.MY_STATS);
    });
});
