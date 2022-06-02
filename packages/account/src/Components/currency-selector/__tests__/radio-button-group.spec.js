import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import RadioButtonGroup from '../radio-button-group.jsx';

describe('<RadioButtonGroup/>', () => {
    const props = {
        label: 'samplelable',
        className: 'sampleclass',
        item_count: 2,
        description: 'This is a description',
        is_fiat: true,
    };
    const fiat_limit_msg = 'You are limited to one fiat currency only';

    it('should render currencyselector', () => {
        render(<RadioButtonGroup {...props} />);
        expect(screen.getByText('samplelable')).toBeInTheDocument();
    });

    it('should not display label if is_title_enabled is false', () => {
        render(<RadioButtonGroup is_title_enabled='false' />);
        expect(screen.queryByText('samplelable')).not.toBeInTheDocument();
    });

    it('should show limited_fiat msg if is_fiat and has_fiat are true', () => {
        render(<RadioButtonGroup {...props} has_fiat />);
        expect(screen.getByText(fiat_limit_msg)).toBeInTheDocument();
    });

    it('should render the children', () => {
        render(
            <RadioButtonGroup {...props}>
                <h1>Test children</h1>
            </RadioButtonGroup>
        );
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('if is_fiat is true it should show description on clicking the child component', () => {
        render(
            <RadioButtonGroup {...props}>
                <h1>Currency</h1>
            </RadioButtonGroup>
        );
        fireEvent.click(screen.getByRole('heading', { level: 1 }));
        expect(screen.getByText('This is a description')).toBeInTheDocument();
    });

    it('if is_fiat is false it should not show description on clicking the child component', () => {
        render(
            <RadioButtonGroup {...props}  is_fiat={false}>
                <button>Currency</button>
            </RadioButtonGroup>
        );
        fireEvent.click(screen.getByRole('button'));
        expect(screen.queryByText('This is a description')).not.toBeInTheDocument();
    });
});
