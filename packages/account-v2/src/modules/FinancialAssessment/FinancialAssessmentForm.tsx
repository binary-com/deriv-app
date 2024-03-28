import React, { Fragment, useState } from 'react';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { ACCOUNT_MODAL_REF } from 'src/constants';
import { shouldHideOccupation } from 'src/utils/financialAssessmentUtils';
import { useAccountStatus, useActiveTradingAccount, useFinancialAssessment, useIsEuRegion } from '@deriv/api-v2';
import { DerivLightIcPoaLockIcon, StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { ActionScreen, Button, InlineMessage, Loader, Modal, Text, useDevice } from '@deriv-com/ui';
import IcSuccess from '../../assets/status-message/ic-success.svg';
import { DemoMessage } from '../../components/DemoMessage';
import { ACCOUNT_V2_DEFAULT_ROUTE, ACCOUNT_V2_ROUTES, DERIV_GO_URL, P2P_URL } from '../../constants/routes';
import { FinancialAssessmentConfirmModal } from '../../containers/FinancialAssessmentConfirmModal';
import { isNavigationFromDerivGO, isNavigationFromP2P } from '../../utils/platform';
import { FinancialAssessmentFields } from '../FinancialAssessmentFields';
import { TradingExperienceFields } from '../TradingExperienceFields';

export const FinancialAssessmentForm = () => {
    const { data: activeAccount } = useActiveTradingAccount();
    const { data: accountStatus } = useAccountStatus();
    const { isEUCountry } = useIsEuRegion();
    const { isMobile } = useDevice();
    const history = useHistory();

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    Modal.setAppElement(ACCOUNT_MODAL_REF);

    const redirect = isNavigationFromDerivGO() || isNavigationFromP2P();
    const redirectPlatformName = isNavigationFromDerivGO() ? 'Deriv GO' : 'Deriv P2P';
    const redirectUrl = isNavigationFromDerivGO() ? DERIV_GO_URL : P2P_URL;

    const {
        is_authenticated: isAuthenticated,
        is_financial_information_not_complete: isFinancialInformationNotComplete,
        is_trading_experience_not_complete: isTradingExperienceNotComplete,
    } = accountStatus || {};
    const hasTradingExperience = isEUCountry || isTradingExperienceNotComplete;

    const {
        data: financialAssessment,
        error: fetchError,
        isLoading: isFinancialAssessmentLoading,
        mutation: {
            error: financialAssessmentUpdateError,
            isLoading: isFinancialAssessmentUpdating,
            isSuccess: isFinancialAssessmentUpdateSuccess,
        },
        update: updateFinancialAssessment,
    } = useFinancialAssessment();

    const {
        account_turnover: accountTurnover,
        binary_options_trading_experience: binaryOptionsTradingExperience,
        binary_options_trading_frequency: binaryOptionsTradingFrequency,
        cfd_trading_experience: cfdTradingExperience,
        cfd_trading_frequency: cfdTradingFrequency,
        education_level: educationLevel,
        employment_industry: employmentIndustry,
        employment_status: employmentStatus,
        estimated_worth: estimatedWorth,
        forex_trading_experience: forexTradingExperience,
        forex_trading_frequency: forexTradingFrequency,
        income_source: incomeSource,
        net_income: netIncome,
        occupation,
        other_instruments_trading_experience: otherInstrumentsTradingExperience,
        other_instruments_trading_frequency: otherInstrumentsTradingFrequency,
        source_of_wealth: sourceOfWealth,
    } = financialAssessment;

    const initialValues = {
        accountTurnover,
        educationLevel,
        employmentIndustry,
        employmentStatus,
        estimatedWorth,
        incomeSource,
        netIncome,
        occupation,
        sourceOfWealth,
        ...(hasTradingExperience && {
            binaryOptionsTradingExperience,
            binaryOptionsTradingFrequency,
            cfdTradingExperience,
            cfdTradingFrequency,
            forexTradingExperience,
            forexTradingFrequency,
            otherInstrumentsTradingExperience,
            otherInstrumentsTradingFrequency,
        }),
    };

    type TFinancialAssessmentFormValues = typeof initialValues;

    const onSubmit = (handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void) => () => {
        if (hasTradingExperience && isTradingExperienceNotComplete) {
            setIsConfirmModalOpen(true);
        } else {
            handleSubmit();
        }
    };

    const handleFormSubmit = async (values: TFinancialAssessmentFormValues) => {
        updateFinancialAssessment({
            account_turnover: values.accountTurnover,
            education_level: values.educationLevel,
            employment_industry: values.employmentIndustry,
            employment_status: values.employmentStatus,
            estimated_worth: values.estimatedWorth,
            income_source: values.incomeSource,
            net_income: values.netIncome,
            source_of_wealth: values.sourceOfWealth,
            ...(shouldHideOccupation(values.employmentStatus) ? {} : { occupation: values.occupation }),
            ...(hasTradingExperience && {
                binary_options_trading_experience: values.binaryOptionsTradingExperience,
                binary_options_trading_frequency: values.binaryOptionsTradingFrequency,
                cfd_trading_experience: values.cfdTradingExperience,
                cfd_trading_frequency: values.cfdTradingFrequency,
                forex_trading_experience: values.forexTradingExperience,
                forex_trading_frequency: values.forexTradingFrequency,
                other_instruments_trading_experience: values.otherInstrumentsTradingExperience,
                other_instruments_trading_frequency: values.otherInstrumentsTradingFrequency,
            }),
        });
    };

    const onSuccessActionButton = () => {
        history.push(redirect ? redirectUrl : ACCOUNT_V2_ROUTES.ProofOfAddress);
        if (redirect) {
            window.sessionStorage.removeItem('config.platform');
        }
    };

    if (activeAccount?.is_virtual) return <DemoMessage />;

    if (isFinancialAssessmentLoading) return <Loader />;

    if (fetchError)
        return <ActionScreen icon={<DerivLightIcPoaLockIcon width={128} />} title={fetchError.error.message} />;

    if (isMobile && !isAuthenticated && !isEUCountry && isFinancialAssessmentUpdateSuccess)
        return (
            <ActionScreen
                actionButtons={
                    <Button onClick={onSuccessActionButton}>
                        {redirect ? `Back to ${redirectPlatformName}` : 'Continue'}
                    </Button>
                }
                description={redirect ? '' : 'Let’s continue with providing proofs of address and identity.'}
                icon={<IcSuccess width={96} />}
                title='Financial assessment submitted successfully'
            />
        );

    return (
        <Fragment>
            {isMobile && (
                <div className='grid grid-cols-[auto_25px] items-center pb-6 mb-10 border-solid border-b-1 border-solid-grey-2'>
                    <Text align='center' size='lg' weight='bold'>
                        Financial Assessment
                    </Text>
                    <StandaloneXmarkBoldIcon
                        iconSize='md'
                        onClick={() => {
                            history.push(ACCOUNT_V2_DEFAULT_ROUTE);
                        }}
                    />
                </div>
            )}
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleFormSubmit}>
                {({ dirty, handleSubmit, isSubmitting, isValid }) => (
                    <Form>
                        {isEUCountry && isFinancialInformationNotComplete && !isFinancialAssessmentUpdateSuccess && (
                            <InlineMessage type='filled' variant='warning'>
                                {isMobile
                                    ? 'To enable withdrawals, please complete your financial assessment.'
                                    : 'You can only make deposits at the moment. To enable withdrawals, please complete your financial assessment.'}
                            </InlineMessage>
                        )}
                        <div className='flex flex-col w-full min-h-screen space-y-16 lg:w-auto'>
                            <div className='m-0 overflow-y-auto'>
                                <div className='flex mb-12 h-24 gap-8 self-stretch lg:self-auto justify-center items-center lg:gap-[11px]'>
                                    <Text weight='bold'>Financial information</Text>
                                    <Text size='xs'>(All fields are required)</Text>
                                    <div className='w-full h-1 flex-[1_1_0] bg-solid-grey-2 lg:flex-shrink-0' />
                                </div>
                                <FinancialAssessmentFields />
                                {hasTradingExperience && (
                                    <>
                                        <div className='flex mb-12 h-24 gap-8 self-stretch lg:self-auto justify-center items-center lg:gap-[11px]'>
                                            <Text weight='bold'>Trading experience</Text>
                                            <Text size='xs'>(All fields are required)</Text>
                                            <div className='w-full h-1 flex-[1_1_0] bg-solid-grey-2 lg:flex-shrink-0' />
                                        </div>
                                        <TradingExperienceFields />
                                    </>
                                )}
                            </div>
                            <div className='sticky bottom-0 flex justify-end flex-shrink-0 w-full px-24 py-16 border-solid bg-solid-slate-0 border-t-1 border-solid-grey-2'>
                                {financialAssessmentUpdateError && (
                                    <InlineMessage type='filled' variant='error'>
                                        {financialAssessmentUpdateError.error.message}
                                    </InlineMessage>
                                )}
                                {isMobile && !isEUCountry && (
                                    <Text align='center' size='xs'>
                                        All fields are required
                                    </Text>
                                )}
                                <Button
                                    disabled={isSubmitting || !isValid || !dirty}
                                    isFullWidth={isMobile}
                                    isLoading={isFinancialAssessmentUpdating}
                                    onClick={onSubmit(handleSubmit)}
                                    size='lg'
                                    type='button'
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                        <FinancialAssessmentConfirmModal
                            handleCancel={() => setIsConfirmModalOpen(false)}
                            handleSubmit={handleSubmit}
                            isModalOpen={isConfirmModalOpen}
                        />
                    </Form>
                )}
            </Formik>
        </Fragment>
    );
};
