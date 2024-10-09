import React, { useEffect } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { WalletPasswordFieldLazy } from '../../../../components/Base';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { validPassword } from '../../../../utils/password-validation';
import { CFD_PLATFORMS, getMarketTypeDetails, JURISDICTION, PlatformDetails } from '../../constants';
import { TModifiedMT5Accounts } from '../../types';
import { MT5LicenceMessage, MT5PasswordModalTnc } from '../components';
import './EnterPassword.scss';

// Note: this component requires a proper refactor to remove props for keys available under the `account` prop
type TProps = {
    account?: TModifiedMT5Accounts;
    isForgotPasswordLoading?: boolean;
    isLoading?: boolean;
    isTncChecked?: boolean;
    isVirtual?: boolean;
    marketType: TMarketTypes.CreateOtherCFDAccount;
    modalTitle?: string;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    onTncChange?: () => void;
    password: string;
    passwordError?: boolean;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
    setPassword: (value: string) => void;
};

const EnterPassword: React.FC<TProps> = ({
    account,
    isForgotPasswordLoading,
    isLoading,
    isTncChecked = true,
    isVirtual,
    marketType,
    modalTitle,
    onPasswordChange,
    onPrimaryClick,
    onSecondaryClick,
    onTncChange,
    password,
    passwordError,
    platform,
    product,
    setPassword,
}) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const { data } = useActiveWalletAccount();

    const accountType = data?.is_virtual ? localize('Demo') : localize('Real');
    const title = PlatformDetails[platform].title;
    const marketTypeTitle =
        platform === PlatformDetails.dxtrade.platform
            ? accountType
            : getMarketTypeDetails(localize, product)[marketType].title;
    const passwordErrorHints = localize(
        'Hint: You may have entered your Deriv password, which is different from your {{title}} password.',
        { title }
    );

    useEffect(() => {
        if (passwordError) {
            setPassword('');
        }
    }, [passwordError, setPassword]);

    return (
        <div className='wallets-enter-password'>
            {isDesktop && (
                <Text align='start' lineHeight='xl' weight='bold'>
                    {modalTitle}
                </Text>
            )}
            <div className='wallets-enter-password__content'>
                <Text align='start' size={isDesktop ? 'sm' : 'md'}>
                    <Localize
                        i18n_default_text='Enter your {{title}} password to add a {{accountTitle}} {{marketTypeTitle}} account'
                        values={{
                            accountTitle:
                                platform === CFD_PLATFORMS.MT5 && accountType === 'Demo'
                                    ? `${accountType.toLocaleLowerCase()} ${CFD_PLATFORMS.MT5.toLocaleUpperCase()}`
                                    : title,
                            marketTypeTitle,
                            title,
                        }}
                    />
                </Text>
                <WalletPasswordFieldLazy
                    label={localize('{{title}} password', { title })}
                    onChange={onPasswordChange}
                    password={password}
                    passwordError={passwordError}
                    shouldDisablePasswordMeter
                />
                {passwordError && (
                    <Text align='start' size={isDesktop ? 'sm' : 'md'}>
                        {passwordErrorHints}
                    </Text>
                )}
                {account && !isVirtual && <MT5LicenceMessage account={account} />}
                {account && account.shortcode !== JURISDICTION.SVG && platform === CFD_PLATFORMS.MT5 && !isVirtual && (
                    <MT5PasswordModalTnc checked={isTncChecked} onChange={() => onTncChange?.()} />
                )}
            </div>
            {isDesktop && (
                <div className='wallets-enter-password__buttons'>
                    <Button
                        color='black'
                        isLoading={isForgotPasswordLoading}
                        onClick={onSecondaryClick}
                        size='lg'
                        textSize='sm'
                        variant='outlined'
                    >
                        <Localize i18n_default_text='Forgot password?' />
                    </Button>
                    <Button
                        disabled={isLoading || !validPassword(password) || !isTncChecked}
                        isLoading={isLoading}
                        onClick={onPrimaryClick}
                        size='lg'
                        textSize='sm'
                    >
                        <Localize i18n_default_text='Add account' />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EnterPassword;
