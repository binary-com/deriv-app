import { fireEvent, render, screen } from '@testing-library/react';
import Card from '../Card.jsx';
import React from 'react';
import test_data from './test-data';

describe('Card.jsx', () => {
    let card, values;
    beforeAll(() => {
        card = test_data.requests[0];
        values = { data: [{ files: [], files_required: 1 }] };
    });
    it('Should render a card', () => {
        render(
            <Card card={card} index={0} handleBlur={jest.fn()} values={values} setFieldValue={jest.fn()} error={{}} />
        );
        expect(screen.getByTestId(card.id, { exact: true })).toBeInTheDocument();
    });
    it('Should render an expanded card on button click', () => {
        render(
            <Card
                card={card}
                handleChange={jest.fn()}
                handleBlur={jest.fn()}
                values={values}
                setFieldValue={jest.fn()}
                index={0}
                error={{ files: [null] }}
            />
        );
        const button = screen.getByTestId('proof-of-ownership-button', { exact: true });
        fireEvent.click(button);
        expect(
            screen.getAllByText('Accepted formats: pdf, jpeg, jpg, and png. Max file size: 8MB', {
                exact: true,
            })[0]
        ).toBeInTheDocument();
    });
});
