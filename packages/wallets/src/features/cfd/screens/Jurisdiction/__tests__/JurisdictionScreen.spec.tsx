import React, { PropsWithChildren } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { APIProvider, useAvailableMT5Accounts, useMT5AccountsList } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../../../AuthProvider';
import { ModalProvider, useModal } from '../../../../../components/ModalProvider';
import { useDynamicLeverageModalState } from '../../../components/DynamicLeverageContext';
import JurisdictionScreen from '../JurisdictionScreen';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useAvailableMT5Accounts: jest.fn(),
    useMT5AccountsList: jest.fn(),
}));

jest.mock('../../../components/DynamicLeverageContext', () => ({
    useDynamicLeverageModalState: jest.fn(),
}));

jest.mock('../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../components/ModalProvider'),
    useModal: jest.fn(() => ({
        ...jest.requireActual('../../../../../components/ModalProvider').useModal(),
        getModalState: jest.fn(),
    })),
}));

jest.mock('../JurisdictionCard', () => ({
    JurisdictionCard: jest.fn(({ jurisdiction, onSelect }) => (
        <button onClick={() => onSelect(jurisdiction)}>JurisdictionCard: {jurisdiction}</button>
    )),
}));

jest.mock('../JurisdictionTncSection', () => ({
    JurisdictionTncSection: jest.fn(() => <div>JurisdictionTncSection</div>),
}));

jest.mock('usehooks-ts', () => ({
    ...jest.requireActual('usehooks-ts'),
    useDebounceValue: jest.fn(value => [value]),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </WalletsAuthProvider>
    </APIProvider>
);

describe('JurisdictionScreen', () => {
    const setIsCheckBoxChecked = jest.fn();
    const setSelectedJurisdiction = jest.fn();

    it('renders the loader when data is being fetched', () => {
        (useMT5AccountsList as jest.Mock).mockReturnValue({ data: null });
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({ data: null, isLoading: true });
        (useDynamicLeverageModalState as jest.Mock).mockReturnValue({
            isDynamicLeverageVisible: false,
        });
        render(
            <JurisdictionScreen
                isCheckBoxChecked={false}
                selectedJurisdiction=''
                setIsCheckBoxChecked={setIsCheckBoxChecked}
                setSelectedJurisdiction={setSelectedJurisdiction}
            />,
            { wrapper }
        );
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('renders JurisdictionCard components correctly', () => {
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: [{ market_type: 'forex', product: 'standard', shortcode: 'bvi' }],
            isLoading: false,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [{ landing_company_short: 'bvi', market_type: 'forex' }],
        });
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn().mockReturnValue('forex'),
        });
        (useDynamicLeverageModalState as jest.Mock).mockReturnValue({
            isDynamicLeverageVisible: false,
        });

        render(
            <JurisdictionScreen
                isCheckBoxChecked={false}
                selectedJurisdiction='bvi'
                setIsCheckBoxChecked={setIsCheckBoxChecked}
                setSelectedJurisdiction={setSelectedJurisdiction}
            />
        );

        expect(screen.getByText('JurisdictionCard: bvi')).toBeInTheDocument();
        expect(screen.getByText('JurisdictionTncSection')).toBeInTheDocument();
    });

    it('handles jurisdiction selection when the clicked item is not the same as the selectedJurisdiction', async () => {
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: [{ market_type: 'forex', product: 'standard', shortcode: 'bvi' }],
            isLoading: false,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [{ landing_company_short: 'bvi', market_type: 'forex' }],
        });
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn().mockReturnValue('forex'),
        });
        (useDynamicLeverageModalState as jest.Mock).mockReturnValue({
            isDynamicLeverageVisible: false,
        });

        render(
            <JurisdictionScreen
                isCheckBoxChecked={false}
                selectedJurisdiction=''
                setIsCheckBoxChecked={setIsCheckBoxChecked}
                setSelectedJurisdiction={setSelectedJurisdiction}
            />
        );

        await userEvent.click(screen.getByText('JurisdictionCard: bvi'));

        expect(setSelectedJurisdiction).toHaveBeenCalledWith('bvi');
    });

    it('handles jurisdiction selection when the clicked item is the same as the selectedJurisdiction', async () => {
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: [{ market_type: 'forex', product: 'standard', shortcode: 'bvi' }],
            isLoading: false,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [{ landing_company_short: 'bvi', market_type: 'forex' }],
        });
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn().mockReturnValue('forex'),
        });
        (useDynamicLeverageModalState as jest.Mock).mockReturnValue({
            isDynamicLeverageVisible: false,
        });

        render(
            <JurisdictionScreen
                isCheckBoxChecked={false}
                selectedJurisdiction='bvi'
                setIsCheckBoxChecked={setIsCheckBoxChecked}
                setSelectedJurisdiction={setSelectedJurisdiction}
            />
        );

        await userEvent.click(screen.getByText('JurisdictionCard: bvi'));

        expect(setSelectedJurisdiction).toHaveBeenCalledWith('');
    });

    it('applies correct CSS classes based on dynamic states', () => {
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: [{ market_type: 'forex', product: 'standard', shortcode: 'bvi' }],
            isLoading: false,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [{ landing_company_short: 'bvi', market_type: 'forex' }],
        });
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn().mockReturnValue('forex'),
        });
        (useDynamicLeverageModalState as jest.Mock).mockReturnValue({
            isDynamicLeverageVisible: true,
        });
        (useDebounceValue as jest.Mock).mockReturnValue([false]);
        const { rerender } = render(
            <JurisdictionScreen
                isCheckBoxChecked={false}
                selectedJurisdiction=''
                setIsCheckBoxChecked={setIsCheckBoxChecked}
                setSelectedJurisdiction={setSelectedJurisdiction}
            />
        );
        expect(screen.getByTestId('dt_wallets_jurisdiction_screen')).toHaveClass('wallets-jurisdiction-screen--flip');
        expect(screen.getByTestId('dt_wallets_jurisdiction_screen')).not.toHaveClass(
            'wallets-jurisdiction-screen--hidden'
        );
        (useDebounceValue as jest.Mock).mockReturnValue([true]);
        rerender(
            <JurisdictionScreen
                isCheckBoxChecked={false}
                selectedJurisdiction=''
                setIsCheckBoxChecked={setIsCheckBoxChecked}
                setSelectedJurisdiction={setSelectedJurisdiction}
            />
        );
        expect(screen.getByTestId('dt_wallets_jurisdiction_screen')).toHaveClass('wallets-jurisdiction-screen--hidden');
    });
});
