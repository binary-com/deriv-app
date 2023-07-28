import React from 'react';
import { toPng } from 'html-to-image';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { base64_images } from 'Constants/base64-images';
import ShareMyAdsModal from '../share-my-ads-modal';

const el_modal = document.createElement('div');

const mock_advert = {
    account_currency: 'USD',
    id: '128812781',
    max_order_amount_limit_display: '2.00',
    min_order_amount_limit_display: '1.00',
    rate_display: '+0.16',
    type: 'buy',
};

const mock_modal_manager = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('html-to-image', () => ({
    toPng: jest.fn(),
}));

jest.mock('react-qrcode-logo', () => ({ QRCode: () => <div>QR code</div> }));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DesktopWrapper: jest.fn(({ children }) => children),
    MobileWrapper: jest.fn(({ children }) => children),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<ShareMyAdsModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the ShareMyAdsModal', () => {
        render(<ShareMyAdsModal advert={mock_advert} />);

        expect(screen.getByText('Share this ad')).toBeInTheDocument();
        expect(screen.getByText('Promote your ad by sharing the QR code and link.')).toBeInTheDocument();
        expect(screen.getByText('QR code')).toBeInTheDocument();
    });

    it('should toggle the modal', () => {
        render(<ShareMyAdsModal advert={mock_advert} />);

        const close_icon = screen.getByTestId('dt-close-modal-icon');
        userEvent.click(close_icon);

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });

    it('should call setShowPopup when clicking on Share link', () => {
        render(<ShareMyAdsModal advert={mock_advert} />);

        const share_link_button = screen.getByRole('button', { name: 'Share link' });

        userEvent.click(share_link_button);

        expect(screen.getByTestId('dt_share_my-ads_popup')).toBeInTheDocument();
    });

    it('should call onCopy function when clicking on copy icon', async () => {
        const writeText = jest.fn();

        Object.assign(navigator, {
            clipboard: {
                writeText,
            },
        });

        jest.useFakeTimers();

        render(<ShareMyAdsModal advert={mock_advert} />);

        const copy_button = screen.getByRole('button', { name: 'Copy link' });

        userEvent.click(copy_button);

        await act(async () => {
            jest.runAllTimers();
            await Promise.resolve();
        });

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
    });

    it('should call handleGenerateImage function when clicking on Download this QR code button', async () => {
        const dataUrl = base64_images.dp2p_logo;

        (toPng as jest.MockedFunction<typeof toPng>).mockResolvedValueOnce(dataUrl);

        render(<ShareMyAdsModal advert={mock_advert} />);

        const download_button = screen.getByRole('button', { name: 'Download this QR code' });
        userEvent.click(download_button);

        expect(toPng).toHaveBeenCalled();
    });
});
