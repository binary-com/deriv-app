import React from 'react';
import { useHover } from 'usehooks-ts';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DepositCryptoAddress from '../DepositCryptoAddress';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('usehooks-ts', () => ({
    useCopyToClipboard: jest.fn(() => [true, jest.fn()]),
    useHover: jest.fn(),
}));

describe('DepositCryptoAddress', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        HTMLCanvasElement.prototype.getContext = jest.fn();
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useHover as jest.Mock).mockReturnValue(false);
    });

    it('should show crypto address after the address fetched', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<DepositCryptoAddress depositCryptoAddress='1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' />);
        expect(screen.getByText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBeInTheDocument();
    });

    it('should show QR code', () => {
        render(<DepositCryptoAddress depositCryptoAddress='1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' />);
        expect(screen.getByTestId('dt_deposit-crypto-address-qr-code')).toBeInTheDocument();
    });

    it('should show copy text when hovering', async () => {
        (useHover as jest.Mock).mockReturnValue(true);
        render(<DepositCryptoAddress depositCryptoAddress='1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' />);
        await userEvent.hover(screen.getByRole('button'));
        expect(screen.getByText('Copy')).toBeInTheDocument();
    });
});
