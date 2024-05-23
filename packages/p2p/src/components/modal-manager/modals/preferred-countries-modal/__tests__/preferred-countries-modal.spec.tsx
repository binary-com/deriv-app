import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PreferredCountriesModal from '../preferred-countries-modal';

const country_list = [
    { text: 'ad', value: 'Andorra' },
    { text: 'af', value: 'Afghanistan' },
];

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const el_modal = document.createElement('div');
const wrapper = ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>;

describe('<PreferredCountriesModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });
    afterAll(() => {
        document.body.removeChild(el_modal);
    });
    it('should render the component', () => {
        render(<PreferredCountriesModal country_list={country_list} eligible_countries={['ad', 'af']} />, { wrapper });
        expect(screen.getByText('Preferred countries')).toBeInTheDocument();

        const checkbox_ad = screen.getByRole('checkbox', { name: 'ad' });
        const checkbox_af = screen.getByRole('checkbox', { name: 'af' });
        expect(checkbox_ad).toBeInTheDocument();
        expect(checkbox_af).toBeInTheDocument();
    });
});
