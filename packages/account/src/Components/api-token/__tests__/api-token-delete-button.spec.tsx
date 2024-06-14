import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TApiContext, TToken } from '../../../Types';
import ApiTokenContext from '../api-token-context';
import ApiTokenDeleteButton from '../api-token-delete-button';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
}));

describe('ApiTokenDeleteButton', () => {
    let modal_root_el: HTMLElement;

    const delete_this_token_text = 'Delete this token';
    const delete_confirmation_text = 'Are you sure you want to delete this token?';
    const cancel_button_text = 'Cancel';
    const delete_button_text = 'Yes, delete';

    const mock_props: TApiContext = {
        api_tokens: [
            {
                display_name: '',
                last_used: '',
                scopes: [],
                token: '',
            },
        ],
        deleteToken: jest.fn(() => Promise.resolve()),
    };

    const mock_token: { token: TToken } = {
        token: {
            display_name: 'Token 1',
            last_used: '12/31/2022',
            scopes: ['read', 'trade'],
            token: '1234567',
        },
    };

    const renderAPIDeleteButton = () => {
        render(
            <ApiTokenContext.Provider value={mock_props}>
                <ApiTokenDeleteButton {...mock_token} />
            </ApiTokenContext.Provider>
        );
    };

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render ApiTokenDeleteButton', () => {
        renderAPIDeleteButton();
        expect(screen.getByTestId('dt_token_delete_icon')).toBeInTheDocument();
        expect(screen.queryByText(delete_this_token_text)).not.toBeInTheDocument();
    });

    it('should display Delete this token when mouse enter', () => {
        renderAPIDeleteButton();
        const delete_icon = screen.getByTestId('dt_token_delete_icon');
        userEvent.hover(delete_icon);
        expect(screen.getByText(delete_this_token_text)).toBeInTheDocument();
    });

    it('should not display Delete this token when mouse leave', () => {
        renderAPIDeleteButton();
        const delete_icon = screen.getByTestId('dt_token_delete_icon');
        userEvent.hover(delete_icon);
        expect(screen.getByText(delete_this_token_text)).toBeInTheDocument();
        userEvent.unhover(delete_icon);
        expect(screen.queryByText(delete_this_token_text)).not.toBeInTheDocument();
    });

    it('should display Popup when delete icon is clicked', () => {
        renderAPIDeleteButton();
        const delete_icon = screen.getByTestId('dt_token_delete_icon');
        userEvent.click(delete_icon);
        expect(screen.getByText('Delete token')).toBeInTheDocument();
        expect(screen.getByText(delete_confirmation_text)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: cancel_button_text })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: delete_button_text })).toBeInTheDocument();
    });

    it('should close the modal when clicked on Cancel', async () => {
        renderAPIDeleteButton();
        const delete_icon = screen.getByTestId('dt_token_delete_icon');
        userEvent.click(delete_icon);
        expect(screen.getByRole('button', { name: cancel_button_text })).toBeInTheDocument();
        const cancel_button = screen.getByRole('button', { name: cancel_button_text });
        userEvent.click(cancel_button);
        await waitFor(() => expect(screen.queryByText('Delete token')).not.toBeInTheDocument());
        expect(screen.queryByText(delete_confirmation_text)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: cancel_button_text })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: delete_button_text })).not.toBeInTheDocument();
    });

    it('should should trigger deleteToken when clicked on Yes, delete', () => {
        renderAPIDeleteButton();
        const delete_icon = screen.getByTestId('dt_token_delete_icon');
        userEvent.click(delete_icon);
        expect(screen.getByRole('button', { name: cancel_button_text })).toBeInTheDocument();
        const delete_token_button = screen.getByRole('button', { name: delete_button_text });
        userEvent.click(delete_token_button);
        expect(mock_props.deleteToken).toBeCalled();
    });
});
