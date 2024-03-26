import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores/index';
import MyAdsFloatingRateSwitchModal from '../my-ads-floating-rate-switch-modal';

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const mock_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        toggleMyAdsRateSwitchModal: jest.fn(),
        selected_ad_type: 'fixed',
    },
    floating_rate_store: {
        reached_target_date: false,
        rate_type: 'float',
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store_values),
}));

describe('<MyAdsFloatingRateSwitchModal />', () => {
    let el_modal: HTMLElement;
    beforeAll(() => {
        el_modal = document.createElement('div');
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });
    it('should render MyAdsFloatingRateSwitchModal component with corresponding message when rate type is float', () => {
        render(<MyAdsFloatingRateSwitchModal />);
        expect(screen.getByText('Set a floating rate for your ad.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Set floating rate' })).toBeInTheDocument();
    });
    it('should render MyAdsFloatingRateSwitchModal component with corresponding message when rate type is fixed', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_store_values,
            floating_rate_store: {
                ...mock_store_values.floating_rate_store,
                rate_type: 'fixed',
            },
            my_ads_store: {
                ...mock_store_values.my_ads_store,
                selected_ad_type: 'float',
            },
        });
        render(<MyAdsFloatingRateSwitchModal />);
        expect(screen.getByText('Set a fixed rate for your ad.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Set fixed rate' })).toBeInTheDocument();
    });
    it('should show Cancel button when target date is reached', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_store_values,
            floating_rate_store: {
                ...mock_store_values.floating_rate_store,
                reached_target_date: true,
            },
        });
        render(<MyAdsFloatingRateSwitchModal />);
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
    it('should handle onClick for set button', () => {
        render(<MyAdsFloatingRateSwitchModal />);
        const set_button = screen.getByRole('button', { name: 'Set floating rate' });
        userEvent.click(set_button);
        expect(mock_store_values.my_ads_store.toggleMyAdsRateSwitchModal).toHaveBeenCalledWith('float', true);
    });
    it("should handle onClick for clicking I'll do this later button", () => {
        render(<MyAdsFloatingRateSwitchModal />);
        const button = screen.getByRole('button', { name: "I'll do this later" });
        userEvent.click(button);
        expect(mock_store_values.my_ads_store.toggleMyAdsRateSwitchModal).toHaveBeenCalledWith('fixed', false);
    });
    it('should handle onClick for cancel button', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_store_values,
            floating_rate_store: {
                ...mock_store_values.floating_rate_store,
                reached_target_date: true,
            },
        });
        render(<MyAdsFloatingRateSwitchModal />);
        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancel_button);
        expect(mock_store_values.my_ads_store.toggleMyAdsRateSwitchModal).toHaveBeenCalledWith('fixed', true);
    });
});
