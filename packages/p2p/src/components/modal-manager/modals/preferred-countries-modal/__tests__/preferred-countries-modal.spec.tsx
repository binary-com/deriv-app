import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PreferredCountriesModal from '../preferred-countries-modal';

const country_list = [
    { text: 'ad', value: 'Andorra' },
    { text: 'af', value: 'Afghanistan' },
    { text: 'ag', value: 'Antigua and Barbuda' },
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
const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore({})}>{children}</StoreProvider>
);

const mock_props = {
    country_list,
    eligible_countries: ['Andorra', 'Afghanistan'],
    onApply: jest.fn(),
};

describe('<PreferredCountriesModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });
    afterAll(() => {
        document.body.removeChild(el_modal);
    });
    it('should render the component', () => {
        render(<PreferredCountriesModal {...mock_props} />, { wrapper });
        expect(screen.getByText('Preferred countries')).toBeInTheDocument();

        const checkbox_ad = screen.getByRole('checkbox', { name: 'ad' });
        const checkbox_af = screen.getByRole('checkbox', { name: 'af' });
        const checkbox_ag = screen.getByRole('checkbox', { name: 'ag' });

        expect(checkbox_ad).toBeChecked();
        expect(checkbox_af).toBeChecked();
        expect(checkbox_ag).not.toBeChecked();
    });

    it('should uncheck all selected countries when clear button is clicked', () => {
        render(<PreferredCountriesModal {...mock_props} />, { wrapper });
        const clear_button = screen.getByRole('button', { name: 'Clear' });
        userEvent.click(clear_button);

        const checkbox_ad = screen.getByRole('checkbox', { name: 'ad' });
        const checkbox_af = screen.getByRole('checkbox', { name: 'af' });
        const checkbox_ag = screen.getByRole('checkbox', { name: 'ag' });

        expect(checkbox_ad).not.toBeChecked();
        expect(checkbox_af).not.toBeChecked();
        expect(checkbox_ag).not.toBeChecked();
    });

    it('should call onApply and hideModal when apply button is clicked after checking country', () => {
        render(<PreferredCountriesModal {...mock_props} />, {
            wrapper,
        });

        const checkbox_ad = screen.getByRole('checkbox', { name: 'ag' });
        const apply_button = screen.getByRole('button', { name: 'Apply' });

        userEvent.click(checkbox_ad);
        userEvent.click(apply_button);

        expect(mock_props.onApply).toHaveBeenCalledWith(['Andorra', 'Afghanistan', 'Antigua and Barbuda']);
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });

    it('should call hideModal when the x icon is clicked', () => {
        render(<PreferredCountriesModal {...mock_props} />, {
            wrapper,
        });

        const close_icon = screen.getByTestId('dt_modal_close_icon');
        userEvent.click(close_icon);

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });
});
