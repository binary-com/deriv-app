import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Formik, FormikValues } from 'formik';
import { useOnfido } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { InlineMessage, ModalStepWrapper } from '../../../../../../components';
import { useVerifyPersonalDetails, VerifyPersonalDetails } from '../VerifyPersonalDetails';
import './Onfido.scss';

type TOnfidoProps = {
    onCompletion?: VoidFunction;
};

const Onfido: React.FC<TOnfidoProps> = ({ onCompletion }) => {
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
        <ModalStepWrapper title='Add a real MT5 account'>
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
                            <InlineMessage
                                message='Hit the checkbox above to choose your document.'
                                size='sm'
                                type='information'
                            />
                        </div>
                    ) : (
                        <InlineMessage
                            message='Your personal details have been saved successfully.'
                            size='sm'
                            type='announcement'
                        />
                    )}
                </div>
            </div>
        </ModalStepWrapper>
    );
};

export default Onfido;
