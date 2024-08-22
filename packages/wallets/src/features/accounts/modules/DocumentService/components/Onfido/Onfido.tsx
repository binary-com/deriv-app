import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Formik, FormikValues } from 'formik';
import { useOnfido } from '@deriv/api-v2';
import { LegacyAnnouncementIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { InlineMessage, Loader, Text } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../../../components';
import { useVerifyPersonalDetails, VerifyPersonalDetails } from '../VerifyPersonalDetails';
import './Onfido.scss';

type TOnfidoProps = {
    onCompletion?: VoidFunction;
};

const Onfido: React.FC<TOnfidoProps> = ({ onCompletion }) => {
    const { localize } = useTranslations();
    const { data: onfidoData, isLoading: isOnfidoLoading } = useOnfido();
    const { hasSubmitted: isOnfidoSubmissionSuccessful, onfidoContainerId } = onfidoData;
    const {
        error: errorPersonalDetails,
        initialValues: initialPersonalDetailsValues,
        isLoading: isPersonalDetailsDataLoading,
        isSubmitted: isPersonalDetailsSubmitted,
        submit: submitPersonalDetails,
    } = useVerifyPersonalDetails();

    const isLoading = isPersonalDetailsDataLoading || isOnfidoLoading;

    useEffect(() => {
        if (isOnfidoSubmissionSuccessful && isPersonalDetailsSubmitted && onCompletion) {
            onCompletion();
        }
    }, [isOnfidoSubmissionSuccessful, isPersonalDetailsSubmitted, onCompletion]);

    const onSubmit = (values: FormikValues) => {
        submitPersonalDetails(values);
    };

    if (isLoading) return <Loader />;

    return (
        <ModalStepWrapper title={localize('Add a real MT5 account')}>
            <div className='wallets-onfido'>
                {!isPersonalDetailsSubmitted && (
                    <Formik initialValues={initialPersonalDetailsValues} onSubmit={onSubmit}>
                        {({ handleSubmit }) => {
                            return <VerifyPersonalDetails error={errorPersonalDetails} onVerification={handleSubmit} />;
                        }}
                    </Formik>
                )}
                <div
                    className={classNames('wallets-onfido__wrapper', {
                        'wallets-onfido__wrapper--animate': isPersonalDetailsSubmitted,
                    })}
                >
                    <div className='wallets-onfido__wrapper-onfido-container' id={onfidoContainerId} />
                    {!isPersonalDetailsSubmitted ? (
                        <div className='wallets-onfido__wrapper-overlay'>
                            <InlineMessage variant='info'>
                                <Text size='2xs'>
                                    <Localize i18n_default_text='Hit the checkbox above to choose your document.' />
                                </Text>
                            </InlineMessage>
                        </div>
                    ) : (
                        <div className='wallets-onfido__wrapper-overlay'>
                            <InlineMessage
                                className='wallets-onfido__wrapper-banner'
                                icon={<LegacyAnnouncementIcon iconSize='xs' />}
                            >
                                <Text size='2xs'>
                                    <Localize i18n_default_text='Your personal details have been saved successfully.' />
                                </Text>
                            </InlineMessage>
                        </div>
                    )}
                </div>
            </div>
        </ModalStepWrapper>
    );
};

export default Onfido;
