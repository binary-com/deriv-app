import React from 'react';
import { useStores } from 'Stores';
import { fireEvent, render, screen } from '@testing-library/react';
import MyProfilePrivacy from '../my-profile-privacy.jsx';

const test_name = 'P2P test';
const mock_general_store = {
    should_show_real_name: true,
};
const mock_profile_store = {
    handleToggle: jest.fn(),
    full_name: test_name,
};
jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        general_store: { ...mock_general_store },
        my_profile_store: { ...mock_profile_store },
    })),
}));

describe('<MyProfilePrivacy/>', () => {
    it('should render privacy setting text', () => {
        render(<MyProfilePrivacy />);

        expect(screen.getByText('Privacy setting')).toBeInTheDocument();
        expect(screen.getByText(`Show my real name (${test_name})`)).toBeInTheDocument();
    });

    it('should render toggle checkbox on load', () => {
        render(<MyProfilePrivacy />);

        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should hide the real name if the status is set to disable', () => {
        useStores.mockImplementation(() => ({
            general_store: { ...mock_general_store, should_show_real_name: false },
            my_profile_store: { ...mock_profile_store },
        }));
        render(<MyProfilePrivacy />);

        expect(screen.queryByText(test_name)).not.toBeInTheDocument();
    });

    it('should trigger handleToggle method on toggling the input', () => {
        const { my_profile_store } = useStores();
        render(<MyProfilePrivacy />);
        fireEvent.click(screen.getByRole('checkbox'));
        
        expect(my_profile_store.handleToggle).toHaveBeenCalled();
    });
});
