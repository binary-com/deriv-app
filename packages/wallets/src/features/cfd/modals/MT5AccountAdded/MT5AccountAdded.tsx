import React, { FC, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useJurisdictionStatus, useMT5AccountsList, usePOA, usePOI } from '@deriv/api-v2';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { companyNamesAndUrls, MarketTypeDetails, PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens/CFDSuccess';

type TProps = {
    account?: THooks.CreateMT5Account;
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
};

const MT5AccountAdded: FC<TProps> = ({ account, marketType, platform }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const history = useHistory();
    const { getVerificationStatus, isSuccess } = useJurisdictionStatus();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { getModalState, hide } = useModal();
    const { data: poiData } = usePOI();
    const { data: poaData } = usePOA();
    const addedAccount = mt5Accounts?.find(acc => acc.login === account?.login);
    const verificationStatus = getVerificationStatus(addedAccount?.landing_company_short, addedAccount?.status);
    const poiService = poiData?.is_pending ? poiData?.previous?.service : poiData?.current?.service;
    const marketTypeTitle =
        marketType === 'all' && Object.keys(PlatformDetails).includes(platform)
            ? PlatformDetails[platform].title
            : MarketTypeDetails[marketType].title;
    const isPOIVerified = poiData?.status === 'verified';
    const isPOAVerified = poaData?.status === 'verified';
    const selectedJurisdiction = getModalState('selectedJurisdiction');
    const landingCompanyName = `(${
        companyNamesAndUrls?.[selectedJurisdiction as keyof typeof companyNamesAndUrls]?.shortcode
    })`;

    const isDemo = activeWallet?.is_virtual;

    const displayBalance = useMemo(() => {
        const account = mt5Accounts?.find(account => account.market_type === marketType);
        return account?.display_balance;
    }, [mt5Accounts, marketType]);

    const renderAccountSuccessButton = useCallback(
        (isTransferAllowed = false) => {
            if (isTransferAllowed) {
                return (
                    <WalletButtonGroup isFlex isFullWidth>
                        <WalletButton onClick={hide} size={isMobile ? 'lg' : 'md'} variant='outlined'>
                            Maybe later
                        </WalletButton>
                        <WalletButton
                            onClick={() => {
                                hide();
                                history.push(`/wallets/cashier/transfer`, { toAccountLoginId: addedAccount?.loginid });
                            }}
                            size={isMobile ? 'lg' : 'md'}
                        >
                            Transfer funds
                        </WalletButton>
                    </WalletButtonGroup>
                );
            }
            return (
                <div className='wallets-success-btn'>
                    <WalletButton isFullWidth onClick={hide} size={isMobile ? 'lg' : 'md'}>
                        OK
                    </WalletButton>
                </div>
            );
        },
        [hide, history, addedAccount?.loginid, isMobile]
    );

    const renderSuccessDescription = useMemo(() => {
        if (isDemo) {
            return `Let's practise trading with ${displayBalance} virtual funds.`;
        }
        return `Transfer funds from your ${activeWallet?.wallet_currency_type} Wallet to your ${marketTypeTitle} ${landingCompanyName} account to start trading.`;
    }, [activeWallet?.wallet_currency_type, displayBalance, isDemo, landingCompanyName, marketTypeTitle]);

    const renderMainContent = useMemo(() => {
        if (!isSuccess) return null;

        if (!verificationStatus.is_not_applicable && !isPOIVerified && !isPOAVerified) {
            if (poiService === 'idv') {
                return (
                    <CFDSuccess
                        description={`We need a few minutes to review your documents before you can start trading with your ${marketTypeTitle} ${
                            isDemo ? ' demo' : landingCompanyName
                        } account. You’ll get an in-app notification as soon as this is done.`}
                        displayBalance={displayBalance}
                        landingCompany={selectedJurisdiction}
                        marketType={marketType}
                        platform={platform}
                        renderButton={renderAccountSuccessButton}
                        title='Almost there'
                    />
                );
            }

            if (poiService === 'onfido') {
                return (
                    <CFDSuccess
                        description={`We need 1-3 days to review your documents before you can start trading with your ${marketTypeTitle} ${
                            isDemo ? ' demo' : landingCompanyName
                        } account. You’ll get an email as soon as this is done.`}
                        displayBalance={displayBalance}
                        landingCompany={selectedJurisdiction}
                        marketType={marketType}
                        platform={platform}
                        renderButton={renderAccountSuccessButton}
                        title='Almost there'
                    />
                );
            }
        }

        return (
            <CFDSuccess
                description={renderSuccessDescription}
                displayBalance={displayBalance}
                landingCompany={selectedJurisdiction}
                marketType={marketType}
                platform={platform}
                renderButton={() => renderAccountSuccessButton(!isDemo)}
                title={`Your ${marketTypeTitle} ${isDemo ? 'demo' : landingCompanyName} account is ready`}
            />
        );
    }, [
        displayBalance,
        isDemo,
        isPOAVerified,
        isPOIVerified,
        isSuccess,
        landingCompanyName,
        marketType,
        marketTypeTitle,
        platform,
        poiService,
        renderAccountSuccessButton,
        renderSuccessDescription,
        selectedJurisdiction,
        verificationStatus.is_not_applicable,
    ]);

    if (isMobile) {
        return <ModalStepWrapper renderFooter={renderAccountSuccessButton}>{renderMainContent}</ModalStepWrapper>;
    }

    return <ModalWrapper hideCloseButton>{renderMainContent}</ModalWrapper>;
};

export default MT5AccountAdded;
