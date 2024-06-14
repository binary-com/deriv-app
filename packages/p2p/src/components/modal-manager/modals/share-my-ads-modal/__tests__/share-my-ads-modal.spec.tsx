import React from 'react';
import html2canvas from 'html2canvas';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareMyAdsModal from '../share-my-ads-modal';

const el_modal = document.createElement('div');

const mock_advert = {
    account_currency: 'USD',
    advertiser_details: {
        id: '123',
    },
    id: '1234',
    max_order_amount_limit_display: '2.00',
    min_order_amount_limit_display: '1.00',
    local_currency: 'IDR',
    rate_display: '+0.16',
    type: 'buy',
};

const mock_modal_manager = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('html2canvas', () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue({
        toDataURL: jest.fn(),
    }),
}));

jest.mock('qrcode.react', () => ({ QRCodeSVG: () => <div>QR code</div> }));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DesktopWrapper: jest.fn(({ children }) => children),
    MobileOrTabletWrapper: jest.fn(({ children }) => children),
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

        const close_icon = screen.getByTestId('dt_modal_close_icon');
        userEvent.click(close_icon);

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });

    it('should call setShowPopup when clicking on Share link', () => {
        const mockShare = jest.fn().mockResolvedValue(true);
        global.navigator.share = mockShare;

        render(<ShareMyAdsModal advert={mock_advert} />);

        const share_link_button = screen.getByRole('button', { name: 'Share link' });

        userEvent.click(share_link_button);

        expect(mockShare).toBeCalled();
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

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            `${window.location.href}cashier/p2p/advertiser?id=${mock_advert.advertiser_details.id}&advert_id=${mock_advert.id}`
        );
    });

    it('should call html2canvas function when clicking on Download this QR code button', async () => {
        render(<ShareMyAdsModal advert={mock_advert} />);

        const download_button = screen.getByRole('button', { name: 'Download this QR code' });
        userEvent.click(download_button);

        expect(html2canvas).toBeCalled();
    });
});
