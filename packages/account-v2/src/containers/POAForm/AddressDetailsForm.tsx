import React, { Fragment } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useHistory } from 'react-router-dom';
import { useDocumentUpload, useInvalidateQuery, useSettings } from '@deriv/api-v2';
import { DerivLightIcPoaLockIcon, StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Button, InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { IconWithMessage } from '../../components/IconWithMessage';
import { ACCOUNT_V2_DEFAULT_ROUTE } from '../../constants/routes';
import { AddressFields } from '../../modules/src/AddressFields';
import { DocumentSubmission } from './DocumentSubmission';

type TAddressDetails = {
    addressCity: string;
    addressLine1: string;
    addressLine2: string;
    addressPostcode: string;
    addressState: string;
    document?: File;
};

type TAddressDetailsForm = {
    resubmitting?: boolean;
};

export const AddressDetailsForm = ({ resubmitting }: TAddressDetailsForm) => {
    const {
        data: settings,
        error: fetchError,
        mutation: { error: settingsUpdateError, isLoading: isSettingsUpdating, mutateAsync: updateSettings },
    } = useSettings();
    const { error: documentUploadError, isLoading: isDocumentUploading, upload } = useDocumentUpload();
    const invalidate = useInvalidateQuery();
    const { isMobile } = useDevice();
    const history = useHistory();

    const handleFormSubmit = async (values: TAddressDetails, { setStatus }: FormikHelpers<TAddressDetails>) => {
        try {
            await updateSettings({
                payload: {
                    address_city: values.addressCity,
                    address_line_1: values.addressLine1,
                    address_line_2: values.addressLine2,
                    address_postcode: values.addressPostcode,
                    address_state: values.addressState,
                },
            });
            // upload file
            await upload({
                document_issuing_country: settings?.country_code ?? undefined,
                document_type: 'proofaddress',
                file: values.document,
            });
            invalidate('get_account_status');
        } catch (error) {
            if (error instanceof Error) {
                setStatus({ message: error.message });
            }
        }
    };

    const {
        address_city: addressCity,
        address_line_1: addressLine1,
        address_line_2: addressLine2,
        address_postcode: addressPostcode,
        address_state: addressState,
    } = settings;

    const initialValues: TAddressDetails = {
        addressCity: addressCity ?? '',
        addressLine1: addressLine1 ?? '',
        addressLine2: addressLine2 ?? '',
        addressPostcode: addressPostcode ?? '',
        addressState: addressState ?? '',
    };

    if (fetchError) {
        return <IconWithMessage icon={<DerivLightIcPoaLockIcon width={128} />} title={fetchError.error.message} />;
    }

    const updateError = settingsUpdateError?.error.message ?? documentUploadError?.error.message;

    const resubmitMessage =
        'We were unable to verify your address with the details you provided. Please check and resubmit or choose a different document type.';

    return (
        <Fragment>
            {isMobile && (
                <div className='grid grid-cols-[auto_25px] items-center pb-6 mb-10 border-solid border-b-1 border-solid-grey-2'>
                    <Text align='center' size='lg' weight='bold'>
                        Proof of address
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
                {({ dirty, isSubmitting, isValid, status }) => (
                    <Form>
                        <div className='flex flex-col w-full min-h-screen space-y-16 lg:w-auto'>
                            {(updateError || status || resubmitting) && (
                                <InlineMessage type='filled' variant='error'>
                                    {updateError ?? status?.message ?? resubmitMessage}
                                </InlineMessage>
                            )}
                            <div className='m-0 space-y-12 overflow-y-auto'>
                                <div className='flex h-24 gap-8 self-stretch lg:self-auto justify-center items-center lg:gap-[11px]'>
                                    <Text weight='bold'>Address</Text>
                                    <div className='w-full h-1 flex-[1_1_0] bg-solid-grey-2 lg:flex-shrink-0' />
                                </div>
                                <InlineMessage type='filled' variant='warning'>
                                    <Text size='sm'>
                                        For faster verification, input the same address here as in your proof of address
                                        document (see section below)
                                    </Text>
                                </InlineMessage>
                                <AddressFields />
                                <DocumentSubmission />
                            </div>
                            <div className='sticky bottom-0 flex justify-end flex-shrink-0 w-full px-24 py-16 border-solid bg-solid-slate-0 border-t-1 border-solid-grey-2'>
                                <Button
                                    disabled={isSubmitting || !isValid || !dirty}
                                    isFullWidth={isMobile}
                                    isLoading={isSettingsUpdating || isDocumentUploading}
                                    size='lg'
                                    type='submit'
                                >
                                    Save and Submit
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Fragment>
    );
};
