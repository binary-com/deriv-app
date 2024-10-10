import React from 'react';
import { render, screen } from '@testing-library/react';
import InstrumentsIconWithLabel from '../instruments-icon-with-label';

describe('<InstrumentsIconWithLabel />', () => {
    const mocked_props = {
        icon: 'example-icon',
        text: 'Synthethics',
        highlighted: true,
        className: 'trading-instruments__icon',
        is_asterisk: true,
    };

    it('should renders the component with correct props', () => {
        render(<InstrumentsIconWithLabel {...mocked_props} />);

        const iconElement = screen.getByTestId('dt_instruments_icon_container');
        const textElement = screen.getByText('Synthethics');
        const asteriskElement = screen.getByText('*');

        expect(iconElement).toBeInTheDocument();
        expect(iconElement).toHaveClass('trading-instruments__icon');
        expect(textElement).toBeInTheDocument();
        expect(asteriskElement).toBeInTheDocument();
    });

    it('should not apply opacity if "highlighted" prop is true', () => {
        render(<InstrumentsIconWithLabel {...mocked_props} highlighted={false} />);
        const containerElement = screen.getByTestId('dt_instruments_icon_container');
        expect(containerElement).toHaveStyle({ opacity: '0.2' });
    });

    it('should not apply opacity if "highlighted" prop is true', () => {
        render(<InstrumentsIconWithLabel {...mocked_props} />);
        const containerElement = screen.getByTestId('dt_instruments_icon_container');
        expect(containerElement).not.toHaveStyle({ opacity: '0.2' });
    });

    it('should show the asterisk span when "is_asterisk" prop is true', () => {
        render(<InstrumentsIconWithLabel {...mocked_props} />);
        const asteriskElement = screen.queryByText('*');
        expect(asteriskElement).toBeInTheDocument();
    });

    it('should hide the asterisk span when "is_asterisk" prop is false', () => {
        render(<InstrumentsIconWithLabel {...mocked_props} is_asterisk={false} />);
        const asteriskElement = screen.queryByText('*');
        expect(asteriskElement).not.toBeInTheDocument();
    });
});
