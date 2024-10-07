import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CFDPlatformsList from '../CFDPlatformsList';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(() => ({
        data: {
            currency_config: {
                is_crypto: false,
            },
        },
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({ push: mockPush })),
}));

// eslint-disable-next-line react/display-name
jest.mock('../CFDPlatformsListEmptyState', () => () => <div>CFDPlatformsListEmptyState</div>);

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    CFDPlatformsListAccounts: jest.fn(() => <div>CFDPlatformsListAccounts</div>),
}));

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>;
const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

describe('CFDPlatformsList', () => {
    describe('Mobile/Tablet view', () => {
        it('renders proper content', () => {
            //@ts-expect-error we only need partial action types
            mockUseDevice.mockReturnValueOnce({ isMobile: true });
            render(<CFDPlatformsList />);

            expect(
                screen.getByText('Trade bigger positions with less capital on a wide range of global markets.')
            ).toBeInTheDocument();
            expect(screen.getByText('Learn more')).toBeInTheDocument();
            expect(screen.getByText('Compare accounts')).toBeInTheDocument();
        });

        it('opens proper link when the user is clicking on `Learn more` text', () => {
            //@ts-expect-error we only need partial action types
            mockUseDevice.mockReturnValueOnce({ isMobile: true });
            render(<CFDPlatformsList />);

            const learnMoreEl = screen.getByRole('link', { name: 'Learn more' });

            expect(learnMoreEl).toHaveAttribute('href', 'https://deriv.com/trade-types/cfds/');
        });

        it('redirects to `/compare-accounts` route when the user is clicking on `Compare accounts` button', async () => {
            //@ts-expect-error we only need partial action types
            mockUseDevice.mockReturnValueOnce({ isMobile: true });
            render(<CFDPlatformsList />);

            const compareAccountsBtn = screen.getByText('Compare accounts');
            await userEvent.click(compareAccountsBtn);

            expect(mockPush).toHaveBeenCalledWith('/compare-accounts');
        });
    });

    describe('Desktop view', () => {
        it('renders proper content', () => {
            render(<CFDPlatformsList />);

            expect(screen.getByText('CFDs')).toBeInTheDocument();
            expect(
                screen.getByText('Trade bigger positions with less capital on a wide range of global markets.')
            ).toBeInTheDocument();
            expect(screen.getByText('Learn more')).toBeInTheDocument();
            expect(screen.getByText('Compare accounts')).toBeInTheDocument();
        });

        it('opens proper link when the user is clicking on `Learn more` text', () => {
            render(<CFDPlatformsList />);

            const learnMoreEl = screen.getByRole('link', { name: 'Learn more' });

            expect(learnMoreEl).toHaveAttribute('href', 'https://deriv.com/trade-types/cfds');
        });

        it('redirects to `/compare-accounts` route when the user is clicking on `Compare accounts` button', async () => {
            render(<CFDPlatformsList />);

            const compareAccountsBtn = screen.getByText('Compare accounts');
            await userEvent.click(compareAccountsBtn);

            expect(mockPush).toHaveBeenCalledWith('/compare-accounts');
        });
    });

    it('renders proper content for fiat accounts', () => {
        render(<CFDPlatformsList />);

        expect(screen.getByText('CFDPlatformsListAccounts')).toBeInTheDocument();
    });

    it('renders proper content for crypto accounts', () => {
        mockUseActiveWalletAccount.mockReturnValueOnce({
            data: {
                //@ts-expect-error we only need partial action types
                currency_config: {
                    is_crypto: true,
                },
            },
        });
        render(<CFDPlatformsList />);

        expect(screen.getByText('CFDPlatformsListEmptyState')).toBeInTheDocument();
    });
});
