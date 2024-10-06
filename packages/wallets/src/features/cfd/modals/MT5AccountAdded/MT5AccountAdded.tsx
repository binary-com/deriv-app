import React, { FC, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useJurisdictionStatus, useMT5AccountsList, usePOA, usePOI } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButtonGroup } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import {
    CFD_PLATFORMS,
    companyNamesAndUrls,
    getMarketTypeDetails,
    MARKET_TYPE,
    PlatformDetails,
} from '../../constants';
import { CFDSuccess } from '../../screens/CFDSuccess';

type TProps = {
    account?: THooks.CreateMT5Account;
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
};

const MT5AccountAdded: FC<TProps> = ({ account, marketType, platform, product }) => {
    const { data: activeWallet, isLoading: isActiveWalletAccountLoading } = useActiveWalletAccount();
    const { data: mt5Accounts, isLoading: isMT5AccountsListLoading } = useMT5AccountsList();
    const { data: poiData, isLoading: isPOILoading } = usePOI();
    const { data: poaData, isLoading: isPOALoading } = usePOA();
    const { getVerificationStatus, isSuccess } = useJurisdictionStatus();

    const history = useHistory();
    const { isDesktop } = useDevice();
    const { getModalState, hide } = useModal();
    const { localize } = useTranslations();

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
            : getMarketTypeDetails(localize, product)[marketType].title;
    const selectedJurisdiction = getModalState('selectedJurisdiction');
    const landingCompanyName = `(${
        companyNamesAndUrls?.[selectedJurisdiction as keyof typeof companyNamesAndUrls]?.shortcode
    })`;

    const isDemo = activeWallet?.is_virtual;
    const buttonSize = isDesktop ? 'md' : 'lg';

    const renderAccountSuccessButton = useCallback(
        (isTransferAllowed = false) => {
            if (isTransferAllowed) {
                return (
                    <div className='wallets-mt5-password-modal__footer'>
                        <WalletButtonGroup isFlex isFullWidth>
                            <Button
                                borderWidth='sm'
                                color='black'
                                onClick={hide}
                                size={buttonSize}
                                textSize='sm'
                                variant='outlined'
                            >
                                <Localize i18n_default_text='Maybe later' />
                            </Button>
                            <Button
                                onClick={() => {
                                    hide();
                                    history.push('/wallet/account-transfer', {
                                        toAccountLoginId: addedAccount?.loginid,
                                    });
                                }}
                                size={buttonSize}
                                textSize='sm'
                            >
                                <Localize i18n_default_text='Transfer funds' />
                            </Button>
                        </WalletButtonGroup>
                    </div>
                );
            }
            return (
                <div className='wallets-success-btn'>
                    <Button isFullWidth onClick={hide} size={buttonSize} textSize='sm'>
                        <Localize i18n_default_text='OK' />
                    </Button>
                </div>
            );
        },
        [hide, isDesktop, history, addedAccount?.loginid]
    );

    const renderSuccessDescription = useMemo(() => {
        if (isDemo) {
            return localize("Let's practise trading with {{accountBalance}} virtual funds.", {
                accountBalance: addedAccount?.display_balance,
            });
        }
        return localize(
            'Transfer funds from your {{walletCurrencyType}} Wallet to your {{marketTypeTitle}} {{landingCompanyName}} account to start trading.',
            { landingCompanyName, marketTypeTitle, walletCurrencyType: activeWallet?.wallet_currency_type }
        );
    }, [
        activeWallet?.wallet_currency_type,
        addedAccount?.display_balance,
        isDemo,
        marketTypeTitle,
        landingCompanyName,
        localize,
    ]);

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
                        actionButtons={renderAccountSuccessButton()}
                        description={localize(
                            "We need a few minutes to review your documents before you can start trading with your {{marketTypeTitle}} {{demoTitle}} account. You'll get an in-app notification as soon as this is done.",
                            {
                                demoTitle: isDemo ? localize('demo') : landingCompanyName,
                                marketTypeTitle,
                            }
                        )}
                        displayBalance={addedAccount?.display_balance}
                        landingCompanyName={landingCompanyName}
                        marketType={marketType}
                        platform={platform}
                        product={product}
                        title={localize('Almost there')}
                    />
                );
            }

            if (poiService === 'onfido') {
                return (
                    <CFDSuccess
                        actionButtons={renderAccountSuccessButton()}
                        description={localize(
                            "We need 1-3 days to review your documents before you can start trading with your {{marketTypeTitle}} {{demoTitle}} account. You'll get an email as soon as this is done.",
                            {
                                demoTitle: isDemo ? localize('demo') : landingCompanyName,
                                marketTypeTitle,
                            }
                        )}
                        displayBalance={addedAccount?.display_balance}
                        landingCompanyName={landingCompanyName}
                        marketType={marketType}
                        platform={platform}
                        product={product}
                        title={localize('Almost there')}
                    />
                );
            }
        }

        return (
            <CFDSuccess
                actionButtons={renderAccountSuccessButton(!isDemo)}
                description={renderSuccessDescription}
                displayBalance={addedAccount?.display_balance}
                landingCompanyName={landingCompanyName}
                marketType={marketType}
                platform={platform}
                product={product}
                title={
                    <Localize
                        i18n_default_text='Your {{marketTypeTitle}} {{demoTitle}} account is ready'
                        values={{
                            demoTitle: isDemo ? localize('demo') : landingCompanyName,
                            marketTypeTitle,
                        }}
                    />
                }
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
        localize,
        marketType,
        marketTypeTitle,
        platform,
        poaData?.status,
        poiData,
        renderAccountSuccessButton,
        renderSuccessDescription,
        product,
    ]);

    if (isLoading) return null;

    if (isDesktop) {
        return (
            <ModalWrapper hideCloseButton>
                <div className='wallets-mt5-password-modal wallets-mt5-password-modal__body'>{renderMainContent}</div>
            </ModalWrapper>
        );
    }

    return (
        <ModalStepWrapper renderFooter={renderAccountSuccessButton}>
            <div className='wallets-mt5-password-modal wallets-mt5-password-modal__body'>{renderMainContent}</div>
        </ModalStepWrapper>
    );
};

export default MT5AccountAdded;
