import React from 'react';
import { useCopyToClipboard, useHover } from 'usehooks-ts';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useDevice from '../../../../hooks/useDevice';
import WalletClipboard from '../WalletClipboard';

jest.mock('usehooks-ts', () => ({
    useCopyToClipboard: jest.fn(),
    useHover: jest.fn(),
}));

jest.mock('../../../../hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('WalletClipboard', () => {
    let mockCopy: jest.Mock;
    const mockUseDevice = useDevice as jest.Mock;
    const mockUseHover = useHover as jest.Mock;
    const mockUseCopyToClipboard = useCopyToClipboard as jest.Mock;
    const renderComponent = () => render(<WalletClipboard textCopy='Sample text to copy' />);

    beforeEach(() => {
        mockCopy = jest.fn();
        mockUseCopyToClipboard.mockReturnValue([null, mockCopy]);
        mockUseHover.mockReturnValue(false);
        mockUseDevice.mockReturnValue({ isMobile: false });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the button with copy icon initially', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.queryByRole('button')).toBeInTheDocument();
            expect(screen.queryByTestId('dt_legacy_copy_icon')).toBeInTheDocument();
        });
    });
    it('clears timeout on unmount', async () => {
        jest.useFakeTimers();
        const { unmount } = await renderComponent();
        unmount();

        jest.runAllTimers();

        expect(clearTimeout).toHaveBeenCalled();
    });

    describe('when hovered', () => {
        it('shows tooltip with "Copy" message', async () => {
            mockUseHover.mockReturnValue(true);
            renderComponent();

            await waitFor(() => {
                expect(screen.queryByText('Copy')).toBeInTheDocument();
            });
        });
    });

    describe('when hovered and clicked', () => {
        const renderScenario = async () => {
            mockUseHover.mockReturnValue(true);
            const { unmount } = renderComponent();
            const button = await screen.findByRole('button');
            await userEvent.click(button);

            return { unmount };
        };

        it('renders the button with won icon', async () => {
            await renderScenario();

            await waitFor(() => {
                expect(screen.queryByTestId('dt_legacy_won_icon')).toBeInTheDocument();
            });
        });
        it('calls copy function with textCopy', async () => {
            await renderScenario();

            expect(mockCopy).toHaveBeenCalledWith('Sample text to copy');
        });
        it('shows tooltip with "Copied!" message', async () => {
            await renderScenario();

            await waitFor(() => {
                expect(screen.queryByText('Copied!')).toBeInTheDocument();
            });
        });
        it("doesn't show tooltip on mobile", async () => {
            mockUseDevice.mockReturnValue({ isMobile: true });
            await renderScenario();

            await waitFor(() => {
                expect(screen.queryByText('Copy')).not.toBeInTheDocument();
                expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
            });
        });
        it('resets the icon and message after 2 seconds', async () => {
            jest.useFakeTimers();
            await renderScenario();

            await waitFor(() => {
                expect(screen.queryByText('Copied!')).toBeInTheDocument();
                expect(screen.queryByTestId('dt_legacy_won_icon')).toBeInTheDocument();
            });

            act(() => {
                jest.advanceTimersByTime(2000);
            });

            await waitFor(() => {
                expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
                expect(screen.queryByTestId('dt_legacy_copy_icon')).toBeInTheDocument();
            });
        });
    });
});
