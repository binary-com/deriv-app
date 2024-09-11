import React from 'react';
import { render, screen } from '@testing-library/react';
import { api_error_codes } from 'Constants/api-error-codes';
import AdVisibilityErrorModal from '../ad-visibility-error-modal';

const mock_modal_manager_context = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: () => ({
        my_ads_store: {
            advert_details: {
                max_order_amount_limit_display: 100,
                account_currency: 'USD',
            },
        },
    }),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: () => mock_modal_manager_context,
}));

window.LiveChatWidget = {
    call: jest.fn(),
    get: jest.fn(),
    init: jest.fn(),
    on: jest.fn(),
};

describe('<AdVisibilityErrorModal/>', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    it('should render ad exceeds balance error', () => {
        render(<AdVisibilityErrorModal error_code={api_error_codes.AD_EXCEEDS_BALANCE} />);

        expect(screen.getByText("Your ad isn't visible to others")).toBeInTheDocument();
        expect(
            screen.getByText(
                /This could be because your account balance is insufficient, your ad amount exceeds your daily limit, or both/i
            )
        ).toBeInTheDocument();
    });

    it('should render ad exceeds daily limit error modal and can open live chat', () => {
        render(<AdVisibilityErrorModal error_code={api_error_codes.AD_EXCEEDS_DAILY_LIMIT} />);

        expect(screen.getByText('Your ad exceeds the daily limit')).toBeInTheDocument();
        expect(screen.getByText(/Your ad is not listed on /i)).toBeInTheDocument();
        expect(screen.getByText(/because the amount exceeds your daily limit of 100 USD./i)).toBeInTheDocument();

        const live_chat_text = screen.getByText(/live chat/i);
        expect(live_chat_text).toBeInTheDocument();
        live_chat_text.click();
        expect(window.LiveChatWidget.call).toHaveBeenCalledTimes(1);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });

    it('should render default error message', () => {
        render(<AdVisibilityErrorModal error_code={'Error'} />);

        expect(screen.getAllByText("Something's not right")).toHaveLength(2);
    });

    it('should hide modal when ok button is clicked', () => {
        render(<AdVisibilityErrorModal error_code={'Error'} />);

        const ok_button = screen.getByRole('button', { name: 'Ok' });
        expect(ok_button).toBeInTheDocument();
        ok_button.click();
        expect(mock_modal_manager_context.hideModal).toBeCalledTimes(1);
    });
});
