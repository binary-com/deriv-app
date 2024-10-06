import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Link } from 'react-router-dom';
import { getInitialLanguage } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import { FadedAnimatedList, WalletAlertMessage } from '../../../../../../components';
import useTransferMessages from '../../hooks/useTransferMessages';
import { useTransfer } from '../../provider';
import { TInitialTransferFormValues } from '../../types';
import './TransferMessages.scss';

const TransferMessages: React.FC = () => {
    const { setFieldValue, values } = useFormikContext<TInitialTransferFormValues>();

    const { USDExchangeRates, accountLimits, activeWalletExchangeRates } = useTransfer();
    const language = getInitialLanguage();

    const messages = useTransferMessages({
        accountLimits,
        activeWalletExchangeRates,
        formData: values,
        fromAccount: values.fromAccount,
        toAccount: values.toAccount,
        USDExchangeRates,
    });

    useEffect(() => {
        const hasErrorMessage = messages.some(message => message.type === 'error');
        setFieldValue('isError', hasErrorMessage);
    }, [messages, setFieldValue]);

    return (
        <FadedAnimatedList className='wallets-transfer-messages'>
            {messages.map(({ action, message, type }, idx) => {
                return (
                    <WalletAlertMessage key={`${idx}-${type}`} message={message} type={type}>
                        {action?.buttonLabel && action?.navigateTo && (
                            <div className='wallets-transfer-messages__action-button'>
                                <Button borderWidth='sm' size='sm' type='button' variant='contained'>
                                    <Link
                                        className='wallets-transfer-messages__link'
                                        to={
                                            language === 'EN'
                                                ? action.navigateTo
                                                : `${action.navigateTo}?lang=${language}`
                                        }
                                        {...(action?.shouldOpenInNewTab && {
                                            rel: 'noopener noreferrer',
                                            target: '_blank',
                                        })}
                                    >
                                        {action.buttonLabel}
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </WalletAlertMessage>
                );
            })}
        </FadedAnimatedList>
    );
};

export default TransferMessages;
