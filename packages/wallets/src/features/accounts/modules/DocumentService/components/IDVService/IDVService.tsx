import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { TSocketError } from '@deriv/api-v2/types';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { FormDropdown, FormField, ModalStepWrapper, WalletText } from '../../../../../../components';
import { Footer } from '../../../components';
import {
    TVerifyPersonalDetailsValues,
    useVerifyPersonalDetails,
    VerifyPersonalDetails,
} from '../VerifyPersonalDetails';
import { IDVServiceErrorMessage } from './components';
import { useIDVService } from './hooks';
import { TIDVServiceValues } from './types';
import { getDocumentNumberValidator, getDocumentTypeValidator } from './utils';
import './IDVService.scss';

type TIDVServiceProps = {
    onCompletion?: VoidFunction;
    onDocumentNotAvailable?: VoidFunction;
};

const IDVService: React.FC<React.PropsWithChildren<TIDVServiceProps>> = ({ onCompletion, onDocumentNotAvailable }) => {
    const { localize } = useTranslations();
    const {
        availableDocumentOptions,
        displayedDocumentsList,
        documentExamples,
        error: errorIDVDetails,
        initialValues: initialIDVValues,
        isLoading: isIDVDataLoading,
        isSubmitted: isIDVSubmitted,
        isSubmitting: isIDVSubmitting,
        previousSubmissionErrorStatus,
        submit: submitIDVDetails,
    } = useIDVService();
    const {
        initialValues: initialPersonalDetailsValues,
        isLoading: isPersonalDetailsDataLoading,
        isSubmitted: isPersonalDetailsSubmitted,
        isSubmitting: isPersonalDetailsSubmitting,
        submit: submitPersonalDetails,
    } = useVerifyPersonalDetails();
    const [clientHasDocuments, setClientHasDocuments] = useState<boolean>(true);
    const [errorVerifyPersonalDetails, setErrorVerifyPersonalDetails] =
        useState<TSocketError<'set_settings'>['error']>();

    const isDataLoading = isIDVDataLoading || isPersonalDetailsDataLoading;
    const isSubmitting = isIDVSubmitting && isPersonalDetailsSubmitting;
    const isSubmitted = isIDVSubmitted && isPersonalDetailsSubmitted;

    const errorMessage = previousSubmissionErrorStatus ?? errorIDVDetails;

    const submit = async (values: TIDVServiceValues & TVerifyPersonalDetailsValues) => {
        if (clientHasDocuments) {
            try {
                await submitPersonalDetails(values);
                submitIDVDetails(values);
            } catch (err) {
                setErrorVerifyPersonalDetails((err as TSocketError<'set_settings'>).error);
            }
        } else if (onDocumentNotAvailable) {
            return onDocumentNotAvailable();
        }
    };

    useEffect(() => {
        //  If IDV submission is successful, invoke external callback onCompletion()
        if (isSubmitted && onCompletion) {
            onCompletion();
        }
    }, [isSubmitted, onCompletion]);

    if (isDataLoading || (!errorMessage && isSubmitting)) return <Loader />;

    return (
        <Formik initialValues={{ ...initialIDVValues, ...initialPersonalDetailsValues }} onSubmit={submit}>
            {({ handleSubmit, isValid, values }) => {
                const document = availableDocumentOptions[values.documentType];

                const example =
                    values.documentType && documentExamples ? documentExamples[values.documentType] : undefined;
                const documentNumberExample = example?.exampleFormat;
                const additionalDocumentNumberExample = example?.additionalDocumentExampleFormat;

                const disableSubmission = (!isValid && clientHasDocuments) || isSubmitting || !values.documentType;

                const handleSelectDocument = (selectedItem: string) => {
                    setClientHasDocuments(selectedItem !== 'none');
                };

                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer disableNext={disableSubmission} onClickNext={handleSubmit} />}
                        title={localize('Add a real MT5 account')}
                    >
                        <div className='wallets-idv-service'>
                            <div className='wallets-idv-service__body'>
                                {!!errorIDVDetails && <IDVServiceErrorMessage error={errorIDVDetails} />}
                                <div className='wallets-idv-service__title'>
                                    <WalletText weight='bold'>
                                        <Localize i18n_default_text='Identity verification' />
                                    </WalletText>
                                </div>
                                <FormDropdown
                                    isFullWidth
                                    label={localize('Choose the document type')}
                                    list={displayedDocumentsList}
                                    listHeight='lg'
                                    name='documentType'
                                    onSelect={handleSelectDocument}
                                    validationSchema={getDocumentTypeValidator(localize)}
                                    variant='comboBox'
                                />
                                {clientHasDocuments && (
                                    <>
                                        <FormField
                                            disabled={!values.documentType}
                                            label={localize('Enter your document number')}
                                            message={
                                                documentNumberExample
                                                    ? localize('Example: {{example}}', {
                                                          example: documentNumberExample,
                                                      })
                                                    : ''
                                            }
                                            name='documentNumber'
                                            showMessage={!!values.documentType}
                                            validationSchema={
                                                clientHasDocuments && document && documentNumberExample
                                                    ? getDocumentNumberValidator(
                                                          document,
                                                          documentNumberExample,
                                                          localize
                                                      )
                                                    : undefined
                                            }
                                        />
                                        {document?.additional && (
                                            <FormField
                                                disabled={!values.documentType}
                                                label={localize('Enter your {{additionalDoumentName}} number', {
                                                    additionalDoumentName: document.additional?.value ?? '',
                                                })}
                                                message={
                                                    additionalDocumentNumberExample
                                                        ? localize('Example: {{example}}', {
                                                              example: additionalDocumentNumberExample,
                                                          })
                                                        : ''
                                                }
                                                name='additionalDocumentNumber'
                                                showMessage={!!values.documentType}
                                                validationSchema={
                                                    clientHasDocuments &&
                                                    document.additional &&
                                                    additionalDocumentNumberExample
                                                        ? getDocumentNumberValidator(
                                                              document.additional,
                                                              additionalDocumentNumberExample,
                                                              localize
                                                          )
                                                        : undefined
                                                }
                                            />
                                        )}
                                        <div className='wallets-idv-service__title'>
                                            <WalletText weight='bold'>
                                                <Localize i18n_default_text='Details' />
                                            </WalletText>
                                        </div>
                                    </>
                                )}
                            </div>
                            {clientHasDocuments && <VerifyPersonalDetails error={errorVerifyPersonalDetails} />}
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default IDVService;
