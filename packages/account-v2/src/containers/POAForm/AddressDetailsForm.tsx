import React, { Fragment } from 'react';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { useDocumentUpload, useSettings } from '@deriv/api';
import { useBreakpoint } from '@deriv/quill-design';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { InlineMessage } from '../../components/base/InlineMessage';
import { AddressFields } from '../../modules/AddressFields';
import DocumentSubmission from './DocumentSubmission';
import { POAError } from './Status';

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
    const { data: settings, error: fetchError, mutation, update: updateSettings } = useSettings();
    const { error: documentUploadError, isLoading: isDocumentUploading, upload } = useDocumentUpload();
    const { isMobile } = useBreakpoint();
    const history = useHistory();

    const { error: settingsUpdateError, isLoading: isSettingsUpdating } = mutation;

    const handleFormSubmit = async (values: TAddressDetails) => {
        updateSettings({
            address_city: values.addressCity,
            address_line_1: values.addressLine1,
            address_line_2: values.addressLine2,
            address_postcode: values.addressPostcode,
            address_state: values.addressState,
        });

        // upload file
        return upload({
            document_issuing_country: settings?.country_code ?? undefined,
            document_type: 'proofaddress',
            file: values.document,
        });
    };

    const { address_city, address_line_1, address_line_2, address_postcode, address_state } = settings;

    const initialValues: TAddressDetails = {
        addressCity: address_city ?? '',
        addressLine1: address_line_1 ?? '',
        addressLine2: address_line_2 ?? '',
        addressPostcode: address_postcode ?? '',
        addressState: address_state ?? '',
    };

    if (fetchError) {
        return <POAError error_message={fetchError.error.message} />;
    }

    const formSubmitError = settingsUpdateError?.error.message || documentUploadError?.error.message;

    return (
        <Fragment>
            {isMobile && (
                <div className='grid grid-cols-[auto_25px] items-center pb-300 mb-500 border-solid border-b-75 border-solid-grey-2'>
                    <Text align='center' size='lg' weight='bold'>
                        Proof of address
                    </Text>
                    <StandaloneXmarkBoldIcon
                        iconSize='md'
                        onClick={() => {
                            history.push('/account-v2/');
                        }}
                    />
                </div>
            )}
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleFormSubmit} validateOnMount>
                {({ isSubmitting, isValid }) => (
                    <Form>
                        <div className='flex flex-col w-full min-h-screen sm:w-auto space-y-800'>
                            {(formSubmitError || resubmitting) && (
                                <InlineMessage size='md' type='error' variant='contained'>
                                    {formSubmitError ||
                                        `We were unable to verify your address with the details you provided. Please check
                                    and resubmit or choose a different document type.`}
                                </InlineMessage>
                            )}
                            <div className='overflow-y-auto m-50 space-y-600'>
                                <div className='flex h-1200 gap-400 self-stretch sm:self-auto justify-center items-center sm:gap-[11px]'>
                                    <Text weight='bold'>Address</Text>
                                    <div className='w-full h-75 flex-[1_1_0] bg-solid-grey-2 sm:flex-shrink-0' />
                                </div>
                                <InlineMessage size='md' type='warning' variant='contained'>
                                    <Text size='sm'>
                                        For faster verification, input the same address here as in your proof of address
                                        document (see section below)
                                    </Text>
                                </InlineMessage>
                                <AddressFields />
                                <DocumentSubmission />
                            </div>
                            <div className='sticky flex justify-end flex-shrink-0 w-full border-solid bottom-50 py-800 px-1200 bg-solid-white border-t-75 border-solid-grey-2'>
                                <Button
                                    className='bg-solid-red-10'
                                    disabled={isSubmitting || !isValid}
                                    isFullWidth={isMobile}
                                    //submitSuccess
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
