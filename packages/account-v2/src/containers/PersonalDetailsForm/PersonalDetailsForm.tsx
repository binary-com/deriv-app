import React, { Fragment } from 'react';
import { Form, Formik } from 'formik';
import { Checkbox, Text } from '@deriv-com/ui';
import { FormSubHeader } from '../../components/FormSubHeader';
import { usePersonalDetails } from '../../hooks/usePersonalDetails';
import { AddressFields } from '../../modules/src/AddressFields';
import { getPersonalDetailsValidationSchema } from '../../utils';
import { PersonalDetails } from './PersonalDetails';
import { SupportProfessionalClient } from './SupportProfessionalClient';
import { TaxInformation } from './TaxInformation';

export const PersonalDetailsForm = () => {
    const { data: personalDetails, initialValues } = usePersonalDetails();

    const { isEu, isSupportProfessionalClient, isVirtual } = personalDetails;

    const validationSchema = getPersonalDetailsValidationSchema(isEu);
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            /*eslint-disable @typescript-eslint/no-empty-function */
            //TODO: replace it with empty function first. Will work on the functions later on
            onSubmit={() => {}}
            validationSchema={validationSchema}
        >
            <Form>
                <FormSubHeader>Details</FormSubHeader>
                <PersonalDetails />
                <FormSubHeader>Tax information</FormSubHeader>
                <TaxInformation />
                {!isVirtual && (
                    <Fragment>
                        <FormSubHeader>Address</FormSubHeader>
                        <div className='lg:max-w-[400px]'>
                            <AddressFields />
                        </div>
                    </Fragment>
                )}
                {isSupportProfessionalClient && (
                    <Fragment>
                        <FormSubHeader>Professional Client</FormSubHeader>
                        <SupportProfessionalClient />
                    </Fragment>
                )}
                <FormSubHeader>Email preference</FormSubHeader>
                <Checkbox
                    disabled={!isVirtual}
                    label={
                        <Text as='p' size='sm'>
                            Get updates about Deriv products, services and events.
                        </Text>
                    }
                    name='emailConsent'
                    /*eslint-disable @typescript-eslint/no-empty-function */
                    //TODO: replace it with empty function first. Will work on the functions later on
                    onChange={() => {}}
                />
            </Form>
        </Formik>
    );
};
