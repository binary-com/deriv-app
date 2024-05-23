import React from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';
import { CryptoDepositErrorCodes } from '../../../../constants/errorCodes';
import './DepositErrorScreen.scss';

type TProps = {
    error: TSocketError<'cashier'>['error'];
};

type TErrorContent = {
    buttonText?: string;
    message?: string;
    onClick?: () => void;
    showIcon?: boolean;
    title?: string;
};

type TErrorCodeHandlers = Record<string, TErrorContent>;

const DepositErrorScreen: React.FC<TProps> = ({ error }) => {
    const { data } = useActiveWalletAccount();
    const currency = data?.currency;

    const defaultContent: TErrorContent = {
        buttonText: 'Try again',
        message: error.message,
        onClick: () => window.location.reload(),
        showIcon: true,
        title: undefined,
    };

    const depositErrorCodeHandlers: TErrorCodeHandlers = {
        [CryptoDepositErrorCodes.CryptoConnectionError]: {
            ...defaultContent,
            buttonText: undefined,
            title: 'Maintenance in progess',
        },
        [CryptoDepositErrorCodes.SuspendedCurrency]: {
            ...defaultContent,
            buttonText: undefined,
            message: `Due to system maintenance, deposits with your ${currency} Wallet are unavailable at the moment. Please try again later.`,
            showIcon: false,
            title: `${currency} Wallet deposits are temporarily unavailable`,
        },
        [CryptoDepositErrorCodes.SuspendedDeposit]: {
            ...defaultContent,
            buttonText: undefined,
            message: `Due to system maintenance, deposits with your ${currency} Wallet are unavailable at the moment. Please try again later.`,
            showIcon: false,
            title: `${currency} Wallet deposits are temporarily unavailable`,
        },
    };

    const content = depositErrorCodeHandlers[error.code] || defaultContent;

    return (
        <div
            className={classNames('wallets-deposit-error-screen', {
                'wallets-deposit-error-screen__no-icon': !content.showIcon,
            })}
        >
            <WalletsErrorScreen {...content} />
        </div>
    );
};

export default DepositErrorScreen;
