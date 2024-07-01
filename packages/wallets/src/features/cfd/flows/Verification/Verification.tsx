import React, { FC, useCallback, useMemo } from 'react';
import {
    useDocumentUpload,
    useIdentityDocumentVerificationAdd,
    useMT5AccountsList,
    usePOA,
    usePOI,
    useSettings,
} from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { ModalStepWrapper, WalletButton, WalletButtonGroup } from '../../../../components/Base';
import { FlowProvider, TFlowProviderContext } from '../../../../components/FlowProvider';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { THooks } from '../../../../types';
import { ErrorCode } from '../../../accounts/constants';
import {
    IDVDocumentUpload,
    ManualDocumentUpload,
    PersonalDetails,
    PoaScreen,
    PoiPoaDocsSubmitted,
    PoiUploadError,
    SelfieDocumentUpload,
    useHandleManualDocumentUpload,
} from '../../../accounts/screens';
import { PlatformDetails } from '../../constants';
import { MT5PasswordModal } from '../../modals';
import { Onfido } from '../../screens';

const Loading = () => {
    return (
        <div style={{ height: 400, width: 600 }}>
            <Loader />
        </div>
    );
};

const screens = {
    duplicateUploadErrorScreen: <PoiUploadError errorCode={ErrorCode.DuplicateUpload} />,
    idvScreen: <IDVDocumentUpload />,
    loadingScreen: <Loading />,
    manualScreen: <ManualDocumentUpload />,
    onfidoScreen: <Onfido />,
    personalDetailsScreen: <PersonalDetails />,
    poaScreen: <PoaScreen />,
    poiPoaDocsSubmitted: <PoiPoaDocsSubmitted />,
    selfieScreen: <SelfieDocumentUpload />,
};

type TVerificationProps = {
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
};

type TManualVerificationFooter = {
    context: TFlowProviderContext<typeof screens>;
    isNextDisabled: boolean;
    isNextLoading: boolean;
    nextFlowHandler: () => void;
};

const getManualVerificationFooter = ({
    context,
    isNextDisabled,
    isNextLoading,
    nextFlowHandler,
}: TManualVerificationFooter) => {
    if (!context.formValues.selectedManualDocument) return undefined;

    const onClickBack = () => {
        if (context.currentScreenId === 'selfieScreen' || context.currentScreenId === 'duplicateUploadErrorScreen') {
            context.switchScreen('manualScreen');
        } else context.setFormValues('selectedManualDocument', '');
    };

    // eslint-disable-next-line react/display-name
    return () => (
        <WalletButtonGroup isFlex>
            <WalletButton onClick={onClickBack} size='lg' variant='outlined'>
                Back
            </WalletButton>
            <WalletButton disabled={isNextDisabled} isLoading={isNextLoading} onClick={nextFlowHandler} size='lg'>
                Next
            </WalletButton>
        </WalletButtonGroup>
    );
};

const Verification: FC<TVerificationProps> = ({ selectedJurisdiction }) => {
    const { data: mt5AccountsList } = useMT5AccountsList();
    const { data: poiStatus, isSuccess: isSuccessPOIStatus } = usePOI();
    const { data: poaStatus, isSuccess: isSuccessPOAStatus } = usePOA();
    const { isLoading: isUploadLoading, upload } = useDocumentUpload();
    const {
        error: errorManualDocumentUpload,
        isError: isErrorManualDocumentUpload,
        isLoading: isManualUploadLoading,
        uploadDocument,
    } = useHandleManualDocumentUpload();
    const { data: settings, update: updateSettings } = useSettings();
    const { submitIDVDocuments } = useIdentityDocumentVerificationAdd();
    const { getModalState, hide, show } = useModal();
    const { isMobile } = useDevice();

    const selectedMarketType = getModalState('marketType') ?? 'all';
    const platform = getModalState('platform') ?? PlatformDetails.mt5.platform;
    const hasCreatedMT5Accounts = mt5AccountsList?.some(account => account.account_type === 'real');

    const shouldSubmitPOA = useMemo(() => {
        if (poaStatus?.is_pending) return false;
        // @ts-expect-error as the prop verified_jurisdiction is not yet present in GetAccountStatusResponse type
        return selectedJurisdiction ? !poaStatus?.verified_jurisdiction?.[selectedJurisdiction] : false;
    }, [selectedJurisdiction, poaStatus]);

    const shouldFillPersonalDetails = useMemo(
        () => !settings?.has_submitted_personal_details,
        [settings?.has_submitted_personal_details]
    );

    const isLoading = useMemo(() => {
        return !isSuccessPOIStatus || !isSuccessPOAStatus;
    }, [isSuccessPOIStatus, isSuccessPOAStatus]);

    const initialScreenId: keyof typeof screens = useMemo(() => {
        const service = poiStatus?.current?.service as keyof THooks.POI['services'];

        if (isErrorManualDocumentUpload) {
            if (errorManualDocumentUpload?.error.code === ErrorCode.DuplicateUpload) {
                return 'duplicateUploadErrorScreen';
            }
        }
        if (service && poiStatus?.services && isSuccessPOIStatus) {
            const serviceStatus = poiStatus.status;

            if (serviceStatus === 'pending' || serviceStatus === 'verified') {
                if (shouldSubmitPOA) return 'poaScreen';
                if (shouldFillPersonalDetails) return 'personalDetailsScreen';
                show(<MT5PasswordModal marketType={selectedMarketType} platform={platform} />);
            }
            if (service === 'idv') return 'idvScreen';
            if (service === 'onfido') return 'onfidoScreen';
            if (service === 'manual') return 'manualScreen';
        }
        return 'loadingScreen';
    }, [
        poiStatus,
        isSuccessPOIStatus,
        shouldSubmitPOA,
        shouldFillPersonalDetails,
        show,
        selectedMarketType,
        platform,
        isErrorManualDocumentUpload,
        errorManualDocumentUpload,
    ]);

    const isNextDisabled = ({ currentScreenId, errors, formValues }: TFlowProviderContext<typeof screens>) => {
        switch (currentScreenId) {
            case 'idvScreen':
                return (
                    !formValues.documentNumber ||
                    !formValues.firstName ||
                    !formValues.lastName ||
                    !formValues.dateOfBirth ||
                    !formValues.verifiedDocumentDetails ||
                    !!errors.documentNumber ||
                    !!errors.firstName ||
                    !!errors.lastName ||
                    !!errors.dateOfBirth
                );
            case 'manualScreen':
                if (formValues.selectedManualDocument === 'driving-license') {
                    return (
                        !formValues.drivingLicenceNumber ||
                        !formValues.drivingLicenseExpiryDate ||
                        !!errors.drivingLicenseExpiryDate ||
                        !formValues.drivingLicenseCardFront ||
                        !formValues.drivingLicenseCardBack
                    );
                } else if (formValues.selectedManualDocument === 'passport') {
                    return (
                        !formValues.passportNumber ||
                        !formValues.passportExpiryDate ||
                        !!errors.passportExpiryDate ||
                        !formValues.passportCard
                    );
                } else if (formValues.selectedManualDocument === 'identity-card') {
                    return (
                        !formValues.identityCardNumber ||
                        !formValues.identityCardExpiryDate ||
                        !!errors.identityCardExpiryDate ||
                        !formValues.identityCardFront ||
                        !formValues.identityCardBack
                    );
                } else if (formValues.selectedManualDocument === 'nimc-slip') {
                    return !formValues.nimcNumber || !formValues.nimcCardFront || !formValues.nimcCardBack;
                }
                return !formValues.selectedManualDocument;
            case 'selfieScreen':
                return !formValues.selfie || isManualUploadLoading || isUploadLoading;
            case 'onfidoScreen':
                return !formValues.hasSubmittedOnfido;
            case 'personalDetailsScreen':
                return (
                    !formValues.citizenship ||
                    !formValues.placeOfBirth ||
                    !formValues.taxResidence ||
                    !formValues.accountOpeningReason ||
                    !formValues.taxIdentificationNumber ||
                    !!errors.taxIdentificationNumber
                );
            case 'poaScreen':
                return (
                    !formValues.townCityLine ||
                    !formValues.firstLine ||
                    !formValues.poaDocument ||
                    !!errors.townCityLine ||
                    !!errors.firstLine ||
                    !!errors.secondLine ||
                    !!errors.zipCodeLine ||
                    !!errors.poaDocument ||
                    isUploadLoading
                );
            case 'duplicateUploadErrorScreen':
                return true;
            default:
                return false;
        }
    };

    const isNextLoading = useCallback(
        ({ currentScreenId }: TFlowProviderContext<typeof screens>) => {
            if (currentScreenId === 'selfieScreen') return isUploadLoading || isManualUploadLoading || isLoading;
            if (currentScreenId === 'poaScreen') return isUploadLoading || isLoading;
            return isLoading;
        },
        [isLoading, isManualUploadLoading, isUploadLoading]
    );

    const nextFlowHandler = useCallback(
        async ({ currentScreenId, formValues, setFormValues, switchScreen }: TFlowProviderContext<typeof screens>) => {
            if (['idvScreen', 'onfidoScreen', 'selfieScreen'].includes(currentScreenId)) {
                // API calls
                if (currentScreenId === 'idvScreen') {
                    submitIDVDocuments({
                        document_number: formValues.documentNumber,
                        document_type: formValues.documentType,
                        issuing_country: settings?.citizen || formValues?.citizenship,
                    });
                    updateSettings({
                        date_of_birth: formValues.dateOfBirth,
                        first_name: formValues.firstName,
                        last_name: formValues.lastName,
                    });
                } else if (currentScreenId === 'onfidoScreen') {
                    if (shouldSubmitPOA) {
                        switchScreen('poaScreen');
                    }
                } else if (currentScreenId === 'selfieScreen') {
                    await uploadDocument(formValues);
                    await upload({
                        document_issuing_country: settings?.country_code ?? undefined,
                        document_type: 'selfie_with_id',
                        file: formValues.selfie,
                    });
                    setFormValues('selectedManualDocument', '');
                }

                // handle screen switching
                if (shouldSubmitPOA) {
                    switchScreen('poaScreen');
                } else if (shouldFillPersonalDetails) {
                    switchScreen('personalDetailsScreen');
                } else if (hasCreatedMT5Accounts) {
                    switchScreen('poiPoaDocsSubmitted');
                } else {
                    show(<MT5PasswordModal marketType={selectedMarketType} platform={platform} />);
                }
            } else if (currentScreenId === 'manualScreen') {
                switchScreen('selfieScreen');
            } else if (currentScreenId === 'poaScreen') {
                await upload({
                    document_issuing_country: settings?.country_code ?? undefined,
                    document_type: 'proofaddress',
                    file: formValues.poaDocument,
                });
                updateSettings({
                    address_city: formValues.townCityLine,
                    address_line_1: formValues.firstLine,
                    address_line_2: formValues.secondLine,
                    address_postcode: formValues.zipCodeLine,
                    address_state: formValues.stateProvinceDropdownLine,
                });
                if (shouldFillPersonalDetails) {
                    switchScreen('personalDetailsScreen');
                } else {
                    show(<MT5PasswordModal marketType={selectedMarketType} platform={platform} />);
                }
            } else if (currentScreenId === 'personalDetailsScreen') {
                updateSettings({
                    account_opening_reason: formValues.accountOpeningReason,
                    citizen: formValues.citizenship,
                    place_of_birth: formValues.placeOfBirth,
                    tax_identification_number: formValues.taxIdentificationNumber,
                    tax_residence: formValues.taxResidence,
                });
                show(<MT5PasswordModal marketType={selectedMarketType} platform={platform} />);
            } else {
                hide();
            }
        },
        [
            hasCreatedMT5Accounts,
            hide,
            platform,
            selectedMarketType,
            settings?.citizen,
            settings?.country_code,
            shouldFillPersonalDetails,
            shouldSubmitPOA,
            show,
            submitIDVDocuments,
            updateSettings,
            upload,
            uploadDocument,
        ]
    );

    return (
        <FlowProvider
            initialScreenId={initialScreenId}
            initialValues={{
                hasSubmittedOnfido: false,
                selectedJurisdiction,
                service: poiStatus?.current?.service as keyof THooks.POI['services'],
            }}
            screens={screens}
        >
            {context => {
                const footer = ['duplicateUploadErrorScreen', 'manualScreen', 'selfieScreen'].includes(
                    context.currentScreenId
                )
                    ? getManualVerificationFooter({
                          context,
                          isNextDisabled: isNextDisabled(context),
                          isNextLoading: isNextLoading(context),
                          nextFlowHandler: () => nextFlowHandler(context),
                      })
                    : () => (
                          <WalletButton
                              disabled={isNextDisabled(context)}
                              isFullWidth={isMobile}
                              isLoading={isNextLoading(context)}
                              onClick={() => nextFlowHandler(context)}
                              size='lg'
                          >
                              Next
                          </WalletButton>
                      );

                const renderFooter =
                    context.currentScreenId === 'poiPoaDocsSubmitted' || context.currentScreenId === 'onfidoScreen'
                        ? undefined
                        : footer;

                return (
                    <ModalStepWrapper
                        disableScroll={context.currentScreenId === 'personalDetailsScreen'}
                        renderFooter={renderFooter}
                        title={
                            context.currentScreenId === 'duplicateUploadErrorScreen'
                                ? 'Submit your proof of identity'
                                : 'Add a real MT5 account'
                        }
                    >
                        {context.WalletScreen}
                    </ModalStepWrapper>
                );
            }}
        </FlowProvider>
    );
};

export default Verification;
