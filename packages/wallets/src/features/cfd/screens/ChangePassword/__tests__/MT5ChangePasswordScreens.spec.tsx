import React, { PropsWithChildren } from 'react';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from '../../../../../components/Base';
import MT5ChangePasswordScreens from '../MT5ChangePasswordScreens';

jest.mock('@deriv-com/translations', () => ({
    localize: jest.fn(),
    useTranslations: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('../../../../../components', () => ({
    SentEmailContent: () => <div>Sent Email Content</div>,
}));

jest.mock('../../../../../components/Base', () => ({
    ...jest.requireActual('../../../../../components/Base'),
    Tab: jest.fn(({ children, title }: PropsWithChildren<{ title: string }>) => (
        <>
            <span>{title}</span>
            <div>{children}</div>
        </>
    )),
    Tabs: jest.fn(({ children }: PropsWithChildren) => <div>{children}</div>),
}));

jest.mock('../InvestorPassword/MT5ChangeInvestorPasswordScreens', () =>
    jest.fn(({ setShowEmailSentScreen }) => (
        <div>
            MT5 Change Investor Password
            <button onClick={setShowEmailSentScreen}>Create or reset investor password</button>
        </div>
    ))
);

jest.mock('../TradingPlatformChangePasswordScreens', () =>
    jest.fn(({ platform }) => <div>Trading Platform Change Password: {platform}</div>)
);

jest.mock('../../../constants', () => ({
    ...jest.requireActual('../../../constants'),
    PlatformDetails: {
        ctrader: {
            platform: 'ctrader',
            title: 'Deriv cTrader',
        },
        dxtrade: {
            platform: 'dxtrade',
            title: 'Deriv X',
        },
        mt5: {
            platform: 'mt5',
            title: 'Deriv MT5',
        },
        mt5Investor: {
            platform: 'mt5',
            title: 'Deriv MT5 investor',
        },
    },
}));

describe('MT5ChangePasswordScreens', () => {
    const mockLocalize = jest.fn((text, params) => {
        const { title = '' } = params || {};
        return text.replace('{{title}}', title);
    });

    beforeAll(() => {
        (useTranslations as jest.Mock).mockReturnValue({ localize: mockLocalize });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    it('renders Tabs by default', () => {
        render(<MT5ChangePasswordScreens />);

        expect(screen.getByText('Deriv MT5 Password')).toBeInTheDocument();
        expect(screen.getByText('Investor Password')).toBeInTheDocument();
    });

    it('renders SentEmailContent when create or reset investor password button is clicked', async () => {
        render(<MT5ChangePasswordScreens />);

        await userEvent.click(screen.getByText('Investor Password'));

        const createOrResetInvestorPasswordButton = screen.getByRole('button', {
            name: 'Create or reset investor password',
        });

        expect(createOrResetInvestorPasswordButton).toBeInTheDocument();

        await userEvent.click(createOrResetInvestorPasswordButton);

        expect(screen.getByText('Sent Email Content')).toBeInTheDocument();
        expect(screen.getByTestId('dt_change_password_sent_email_content_wrapper')).toBeInTheDocument();
    });

    it('calls localize when rendering tab titles', () => {
        render(<MT5ChangePasswordScreens />);

        expect(mockLocalize).toHaveBeenCalledWith('{{title}} Password', { title: 'Deriv MT5' });
        expect(mockLocalize).toHaveBeenCalledWith('Investor Password');
        expect(screen.getByText('Deriv MT5 Password')).toBeInTheDocument();
        expect(screen.getByText('Investor Password')).toBeInTheDocument();
    });

    it('renders tabs with fontSize of sm for non-mobile', () => {
        render(<MT5ChangePasswordScreens />);

        expect(Tabs).toHaveBeenCalledWith(expect.objectContaining({ fontSize: 'sm' }), {});
        expect(screen.getByText('MT5 Change Investor Password')).toBeInTheDocument();
    });
});
