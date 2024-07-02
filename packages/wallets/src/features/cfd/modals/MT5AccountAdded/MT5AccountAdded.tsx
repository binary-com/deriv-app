import React, { FC, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useJurisdictionStatus, useMT5AccountsList, usePOA, usePOI } from '@deriv/api-v2';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS, companyNamesAndUrls, MARKET_TYPE, MarketTypeDetails, PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens/CFDSuccess';

type TProps = {
    account?: THooks.CreateMT5Account;
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
};

const MT5AccountAdded: FC<TProps> = ({ account, marketType, platform }) => {
    const { data: activeWallet, isLoading: isActiveWalletAccountLoading } = useActiveWalletAccount();
    const { data: mt5Accounts, isLoading: isMT5AccountsListLoading } = useMT5AccountsList();
    const { data: poiData, isLoading: isPOILoading } = usePOI();
    const { data: poaData, isLoading: isPOALoading } = usePOA();
    const { getVerificationStatus, isSuccess } = useJurisdictionStatus();

    const history = useHistory();
    const { isMobile } = useDevice();
    const { getModalState, hide } = useModal();

    const addedAccount = mt5Accounts?.find(acc => acc.login === account?.login);

    const isLoading =
        isActiveWalletAccountLoading ||
        isMT5AccountsListLoading ||
        isPOILoading ||
        !poiData ||
        isPOALoading ||
        !poaData ||
        !addedAccount;

    const marketTypeTitle =
        marketType === MARKET_TYPE.ALL && platform in PlatformDetails && platform !== CFD_PLATFORMS.MT5
            ? PlatformDetails[platform].title
            : MarketTypeDetails[marketType].title;
    const selectedJurisdiction = getModalState('selectedJurisdiction');
    const landingCompanyName = `(${
        companyNamesAndUrls?.[selectedJurisdiction as keyof typeof companyNamesAndUrls]?.shortcode
    })`;

    const isDemo = activeWallet?.is_virtual;

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
                                history.push('/wallet/account-transfer', { toAccountLoginId: addedAccount?.loginid });
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
            return `Let's practise trading with ${addedAccount?.display_balance} virtual funds.`;
        }
        return `Transfer funds from your ${activeWallet?.wallet_currency_type} Wallet to your ${marketTypeTitle} account to start trading.`;
    }, [activeWallet?.wallet_currency_type, addedAccount?.display_balance, isDemo, marketTypeTitle]);

    const renderMainContent = useMemo(() => {
        if (!isSuccess || isLoading) return null;

        const verificationStatus = getVerificationStatus(addedAccount.landing_company_short, addedAccount.status);
        const poiService = poiData.is_pending ? poiData.previous?.service : poiData.current?.service;
        const isPOIVerified = poiData.status === 'verified';
        const isPOAVerified = poaData.status === 'verified';

        if (!verificationStatus.is_not_applicable && !isPOIVerified && !isPOAVerified) {
            if (poiService === 'idv') {
                return (
                    <CFDSuccess
                        description={`We need a few minutes to review your documents before you can start trading with your ${marketTypeTitle} ${
                            isDemo ? ' demo' : landingCompanyName
                        } account. You’ll get an in-app notification as soon as this is done.`}
                        displayBalance={addedAccount?.display_balance}
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
                        displayBalance={addedAccount?.display_balance}
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
                displayBalance={addedAccount?.display_balance}
                marketType={marketType}
                platform={platform}
                renderButton={() => renderAccountSuccessButton(!isDemo)}
                title={`Your ${marketTypeTitle} ${isDemo ? 'demo' : ''} account is ready`}
            />
        );
    }, [
        addedAccount?.display_balance,
        addedAccount?.landing_company_short,
        addedAccount?.status,
        getVerificationStatus,
        isDemo,
        isLoading,
        isSuccess,
        landingCompanyName,
        marketType,
        marketTypeTitle,
        platform,
        poaData?.status,
        poiData,
        renderAccountSuccessButton,
        renderSuccessDescription,
    ]);

    if (isLoading) return null;

    if (isMobile) {
        return <ModalStepWrapper renderFooter={renderAccountSuccessButton}>{renderMainContent}</ModalStepWrapper>;
    }

    return <ModalWrapper hideCloseButton>{renderMainContent}</ModalWrapper>;
};

export default MT5AccountAdded;
