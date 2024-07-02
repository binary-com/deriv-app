import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletMarketIcon from '../WalletMarketIcon';

describe('<WalletMarketIcon/>', () => {
    it('render svg properly', () => {
        render(<WalletMarketIcon icon='standard' />);

        const svgElement = screen.getByTestId('dt_wallet_icon');

        expect(svgElement).toBeInTheDocument();
    });

    it('render if its inside the defined Icon object', () => {
        render(<WalletMarketIcon icon='all' />);

        const svgElement = screen.getByTestId('dt_wallet_icon');

        expect(svgElement).toBeInTheDocument();
    });

    it('does not render if its not inside the defined Icon object', () => {
        const { container } = render(<WalletMarketIcon icon='' />);

        expect(container).toBeEmptyDOMElement();
    });

    it('render correct size when passed', () => {
        render(<WalletMarketIcon icon='all' size='sm' />);

        const svgElement = screen.getByTestId('dt_wallet_icon');
        expect(svgElement).toHaveAttribute('width', '24');
        expect(svgElement).toHaveAttribute('height', '24');
    });

    it('render correct width and height when passed', () => {
        render(<WalletMarketIcon height={12} icon='all' width={12} />);

        const svgElement = screen.getByTestId('dt_wallet_icon');
        expect(svgElement).toHaveAttribute('width', '12');
        expect(svgElement).toHaveAttribute('height', '12');
    });

    it('renders nothing when there is no svg provided', () => {
        const { container } = render(<WalletMarketIcon icon='' />);

        expect(container).toBeEmptyDOMElement();
    });
});
