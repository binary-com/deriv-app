import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasskeyModal from '../passkey-modal';

describe('PasskeyModal', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const test_header = 'Test Header';
    const test_description = 'Test Description';
    const test_button_text = 'Test Button';

    it('renders the modal correctly and responds to user interaction', () => {
        const handleClick = jest.fn();
        render(
            <PasskeyModal
                has_close_icon
                is_modal_open
                header={<span>{test_header}</span>}
                description={<span>{test_description}</span>}
                button_text={<span>{test_button_text}</span>}
                onButtonClick={handleClick}
            />
        );

        const close_icon = screen.getByTestId('dt_modal_close_icon');
        expect(screen.getByText(test_header)).toBeInTheDocument();
        expect(screen.getByText(test_description)).toBeInTheDocument();
        expect(screen.getByText(test_button_text)).toBeInTheDocument();
        expect(close_icon).toBeInTheDocument();

        userEvent.click(screen.getByText('Test Button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders the modal without header and close icon', () => {
        const handleClick = jest.fn();
        render(
            <PasskeyModal
                has_close_icon={false}
                is_modal_open
                description={<span>{test_description}</span>}
                button_text={<span>{test_button_text}</span>}
                onButtonClick={handleClick}
            />
        );

        const close_icon = screen.queryByTestId('dt_modal_close_icon');
        expect(screen.queryByText(test_header)).not.toBeInTheDocument();
        expect(screen.getByText(test_description)).toBeInTheDocument();
        expect(screen.getByText(test_button_text)).toBeInTheDocument();
        expect(close_icon).not.toBeInTheDocument();

        userEvent.click(screen.getByText(test_button_text));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
