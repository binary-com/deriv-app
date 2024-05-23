import React from 'react';
import CurrencyWrapper from 'Components/currency-wrapper';
import { render, screen } from '@testing-library/react';

describe('<CurrencyWrapper />', () => {
    it('should render currency prop', () => {
        render(<CurrencyWrapper currency='USD' />);
        expect(screen.getByText('USD')).toBeInTheDocument();
    });
});
