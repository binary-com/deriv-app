import classNames from 'classnames';
import React from 'react';
import { Button, Div100vhContainer, Icon, Text } from '@deriv/components';
import { isDesktop, isMobileOrTablet, routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const FinishedAddCurrency = ({
    current,
    closeRealAccountSignup,
    deposit_target,
    redirectToLegacyPlatform,
    deposit_real_account_signup_target,
    history,
    onSubmit,
    setIsDeposit,
}) => {
    const IconNextCurrency = () => <Icon icon={`IcCurrency-${current.toLowerCase()}`} height={120} width={90} />;
    const IconWon = ({ className }) => <Icon className={className} icon='IcCheckmarkCircle' color='green' />;

    const closeModalThenOpenCashier = () => {
        closeRealAccountSignup();
        history.push(deposit_target);
        if (deposit_target === routes.cashier_deposit) {
            setIsDeposit(true);
        }
        redirectToLegacyPlatform();
    };

    const onCancel = () => {
        closeRealAccountSignup();
        setIsDeposit(false);
        redirectToLegacyPlatform();
    };

    return (
        <React.Fragment>
            {isDesktop() && (
                <div onClick={onCancel} className='finished-add-currency__close'>
                    <Icon icon='IcCross' />
                </div>
            )}
            <Div100vhContainer className='finished-add-currency__dialog' is_disabled={isDesktop()} height_offset='40px'>
                <div
                    className={classNames('status-dialog__header', {
                        'status-dialog__header--center': isMobileOrTablet(),
                    })}
                >
                    <IconNextCurrency />
                    <IconWon className='bottom-right-overlay' />
                </div>
                <div
                    className={classNames('status-dialog__body', {
                        'status-dialog__body--no-grow': isMobileOrTablet(),
                    })}
                >
                    <Text as='h2' align='center' className='status-dialog__message-header' weight='bold'>
                        <Localize i18n_default_text='Your account is ready' />
                    </Text>
                    <Text as='p' align='center'>
                        <Localize i18n_default_text='Fund your account to start trading.' />
                    </Text>
                </div>
                <div className='finished-add-currency__footer'>
                    <Button onClick={onCancel} text={localize('Maybe later')} secondary />
                    <Button
                        onClick={
                            ['add_crypto', 'add_fiat', 'add_currency'].includes(deposit_real_account_signup_target)
                                ? closeModalThenOpenCashier
                                : onSubmit
                        }
                        text={localize('Deposit now')}
                        primary
                    />
                </div>
            </Div100vhContainer>
        </React.Fragment>
    );
};

export default React.memo(FinishedAddCurrency);
