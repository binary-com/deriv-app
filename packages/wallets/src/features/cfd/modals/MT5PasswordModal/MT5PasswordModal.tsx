import React, { useState } from 'react';
import {
    useActiveWalletAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useTradingPlatformPasswordChange,
} from '@deriv/api';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { TMarketTypes, TPlatforms } from '../../../../types';
import useDevice from '../../../../hooks/useDevice';
import { MarketTypeToTitleMapper, PlatformToTitleMapper } from '../../constants';
import { CreatePassword, EnterPassword, Success } from '../../screens';

type TProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
};

const MT5PasswordModal: React.FC<TProps> = ({ marketType, platform }) => {
    const [password, setPassword] = useState('');
    const { isSuccess, mutate } = useCreateMT5Account();
    const { mutate: tradingPasswordChange } = useTradingPlatformPasswordChange();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const { data: settings } = useSettings();
    const { hide } = useModal();
    const { isMobile } = useDevice();

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeWallet?.is_virtual;
    const marketTypeTitle =
        marketType === 'all' && Object.keys(PlatformToTitleMapper).includes(platform)
            ? PlatformToTitleMapper[platform]
            : MarketTypeToTitleMapper[marketType];

    const onSubmit = async () => {
        const accountType = marketType === 'synthetic' ? 'gaming' : marketType;

        // in order to create account, we need to set a password through trading_platform_password_change endpoint first
        // then only mt5_create_account can be called, otherwise it will response an error for password required
        if (!mt5Accounts?.length) {
            await tradingPasswordChange({
                new_password: password,
                platform: 'mt5',
            });
        }

        mutate({
            payload: {
                account_type: activeWallet?.is_virtual ? 'demo' : accountType,
                address: settings?.address_line_1 || '',
                city: settings?.address_city || '',
                company: 'svg',
                country: settings?.country_code || '',
                email: settings?.email || '',
                leverage: availableMT5Accounts?.find(acc => acc.market_type === marketType)?.leverage || 500,
                mainPassword: password,
                ...(marketType === 'financial' && { mt5_account_type: 'financial' }),
                ...(marketType === 'all' && { sub_account_category: 'swap_free' }),
                name: settings?.first_name || '',
                phone: settings?.phone || '',
                state: settings?.address_state || '',
                zipCode: settings?.address_postcode || '',
            },
        });
    };

    const renderTitle = () => {
        if (!isSuccess && hasMT5Account) return `Enter your ${PlatformToTitleMapper.mt5} password`;
        return '';
    };

    const renderFooter = () => {
        if (isSuccess) return <WalletButton isFullWidth onClick={hide} size='lg' text='Continue' />;
        if (hasMT5Account)
            return (
                <WalletButtonGroup>
                    <WalletButton isFullWidth size='lg' text='Forgot password?' variant='outlined' />
                    <WalletButton disabled={!password} isFullWidth onClick={onSubmit} size='lg' text='Add account' />
                </WalletButtonGroup>
            );
        return (
            <WalletButton
                disabled={!password}
                isFullWidth
                onClick={onSubmit}
                size='lg'
                text='Create Deriv MT5 Password'
            />
        );
    };

    if (isMobile) {
        return (
            <ModalStepWrapper renderFooter={renderFooter} title={renderTitle()}>
                {isSuccess && (
                    <Success
                        description={`You can now start practicing trading with your ${marketTypeTitle} ${
                            isDemo ? ' demo' : 'real'
                        } account.`}
                        displayBalance={
                            mt5Accounts?.find(account => account.market_type === marketType)?.display_balance || ''
                        }
                        marketType={marketType}
                        platform={platform}
                        renderButton={() => <WalletButton isFullWidth onClick={hide} size='lg' text='Continue' />}
                        title={`Your ${marketTypeTitle} ${isDemo ? ' demo' : 'real'} account is ready`}
                    />
                )}
                {!isSuccess &&
                    (hasMT5Account ? (
                        <EnterPassword
                            marketType={marketType}
                            onPasswordChange={e => setPassword(e.target.value)}
                            onPrimaryClick={onSubmit}
                            password={password}
                            platform='mt5'
                        />
                    ) : (
                        <CreatePassword
                            icon={<MT5PasswordIcon />}
                            onPasswordChange={e => setPassword(e.target.value)}
                            onPrimaryClick={onSubmit}
                            password={password}
                            platform='mt5'
                        />
                    ))}
            </ModalStepWrapper>
        );
    }

    return (
        <ModalWrapper hideCloseButton={isSuccess}>
            {isSuccess && (
                <Success
                    description={`You can now start practicing trading with your ${marketTypeTitle} ${
                        isDemo ? ' demo' : 'real'
                    } account.`}
                    displayBalance={
                        mt5Accounts?.find(account => account.market_type === marketType)?.display_balance || ''
                    }
                    marketType={marketType}
                    platform={platform}
                    renderButton={() => <WalletButton isFullWidth onClick={hide} size='lg' text='Continue' />}
                    title={`Your ${marketTypeTitle} ${isDemo ? ' demo' : 'real'} account is ready`}
                />
            )}
            {!isSuccess &&
                (hasMT5Account ? (
                    <EnterPassword
                        marketType={marketType}
                        onPasswordChange={e => setPassword(e.target.value)}
                        onPrimaryClick={onSubmit}
                        password={password}
                        platform='mt5'
                    />
                ) : (
                    <CreatePassword
                        icon={<MT5PasswordIcon />}
                        onPasswordChange={e => setPassword(e.target.value)}
                        onPrimaryClick={onSubmit}
                        password={password}
                        platform='mt5'
                    />
                ))}
        </ModalWrapper>
    );
};

export default MT5PasswordModal;
