import classNames from 'classnames';
import React from 'react';
import { Button, Div100vhContainer, Icon, Text } from '@deriv/components';
import { getCurrencyDisplayCode, isDesktop, isMobile, routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const SuccessMessage = ({ prev, current }) =>
    prev ? (
        <Localize
            i18n_default_text={
                '<0>You have successfully changed your currency to {{currency}}.</0><0>Make a deposit now to start trading.</0>'
            }
            values={{
                currency: getCurrencyDisplayCode(current),
            }}
            components={[
                <Text
                    as='p'
                    align='center'
                    className='status-dialog__message-text'
                    color='general'
                    size='xs'
                    key={current}
                />,
            ]}
        />
    ) : (
        <Localize
            i18n_default_text={
                '<0>You have added a {{currency}} account.</0><0> Make a deposit now to start trading.</0>'
            }
            values={{
                currency: getCurrencyDisplayCode(current),
            }}
            components={[
                <Text
                    as='p'
                    align='center'
                    className='status-dialog__message-text'
                    color='general'
                    size='xs'
                    key={current}
                />,
            ]}
        />
    );

const FinishedSetCurrency = ({
    current,
    closeRealAccountSignup,
    continueRoute,
    deposit_target,
    deposit_real_account_signup_target,
    history,
    onCancel,
    onSubmit,
    prev,
    setIsDeposit,
}) => {
    const IconPrevCurrency = () =>
        prev ? <Icon icon={`IcCurrency-${prev.toLowerCase()}`} height={120} width={90} /> : null;
    const IconNextCurrency = () => <Icon icon={`IcCurrency-${current.toLowerCase()}`} height={120} width={90} />;
    const IconArrow = () => (prev ? <Icon icon='IcArrowPointerRight' color='red' width={50} height={20} /> : null);

    const IconWon = ({ className }) => <Icon className={className} icon='IcCheckmarkCircle' color='green' />;

    const closeModalThenOpenCashier = () => {
        closeRealAccountSignup();
        continueRoute();
        history.push(deposit_target);
        if (deposit_target === routes.cashier_deposit) {
            setIsDeposit(true);
        }
    };

    return (
        <Div100vhContainer className='status-dialog' is_disabled={isDesktop()} height_offset='40px'>
            <div
                className={classNames('status-dialog__header', {
                    'status-dialog__header--center': isMobile(),
                    'status-dialog__header--set-currency': prev,
                })}
            >
                <IconPrevCurrency />
                <IconArrow />
                <IconNextCurrency />
                <IconWon className='bottom-right-overlay' />
            </div>
            <div className={classNames('status-dialog__body', { 'status-dialog__body--no-grow': isMobile() })}>
                <Text as='h2' align='center' className='status-dialog__message-header' weight='bold'>
                    <Localize i18n_default_text='Success!' />
                </Text>
                <SuccessMessage prev={prev} current={current} />
            </div>
            <div className='status-dialog__footer'>
                <Button
                    onClick={deposit_real_account_signup_target === 'add_crypto' ? closeModalThenOpenCashier : onSubmit}
                    text={localize('Deposit now')}
                    primary
                />
                <Button onClick={onCancel} text={localize('Maybe later')} secondary />
            </div>
        </Div100vhContainer>
    );
};

export default React.memo(FinishedSetCurrency);
