import React from 'react';
import clsx from 'clsx';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import { Localize, localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import { Button, Text } from '@deriv/components';
import Uploader from './uploader';
import { setInitialValues, validateFields } from './utils';
import { ROOT_CLASS, SELFIE_DOCUMENT } from '../constants';
import FormBody from '../../../../form-body';
import FormFooter from '../../../../form-footer';

type TSelfieUpload = {
    initial_values?: FormikValues;
    goBack: () => void;
    onConfirm: () => void;
    onFileDrop: () => void;
};

const SelfieUpload = ({ initial_values, goBack, onConfirm, onFileDrop }: TSelfieUpload) => {
    const { isDesktop } = useDevice();
    return (
        <div
            className={clsx(ROOT_CLASS, {
                [`${ROOT_CLASS}--mobile`]: !isDesktop,
            })}
        >
            <Formik
                initialValues={initial_values || setInitialValues([SELFIE_DOCUMENT])}
                validate={values => validateFields(values, undefined, [SELFIE_DOCUMENT])}
                onSubmit={onConfirm}
            >
                {({ values, isValid, isSubmitting, touched }: Partial<FormikProps<FormikValues>>) => {
                    let is_form_touched, is_form_empty;
                    if (touched) {
                        is_form_touched = Object.keys(touched).length > 0;
                    }
                    if (values) {
                        is_form_empty = Object.values(values).some(field => field === null || field === '');
                    }

                    return (
                        <Form className={`${ROOT_CLASS}__form`}>
                            <FormBody className='form-body' scroll_offset={isDesktop ? '8rem' : '18rem'}>
                                <div className={`${ROOT_CLASS}__fields-content`}>
                                    <Text as='h3' size='s' weight='bold' color='prominent'>
                                        <Localize i18n_default_text='Upload your selfie' />
                                    </Text>
                                    <div className={`${ROOT_CLASS}__uploaders-wrap`}>
                                        <Uploader
                                            data={SELFIE_DOCUMENT}
                                            value={values ? values[SELFIE_DOCUMENT.name] : ''}
                                            is_full
                                            onChange={onFileDrop}
                                            has_frame
                                        />
                                    </div>
                                    <div className={`${ROOT_CLASS}__notice`}>
                                        <Text as='p' size='xs' color='general'>
                                            <Localize i18n_default_text='Before uploading, please ensure that you’re facing forward in the selfie, your face is within the frame, and your eyes are clearly visible even if you’re wearing glasses.' />
                                        </Text>
                                    </div>
                                </div>
                            </FormBody>
                            <FormFooter>
                                <div className={`${ROOT_CLASS}__btns`}>
                                    <Button onClick={goBack} secondary large text={localize('Back')} />
                                    <Button
                                        type='submit'
                                        primary
                                        large
                                        is_disabled={!isValid || isSubmitting || (!is_form_touched && is_form_empty)}
                                        text={localize('Confirm and upload')}
                                    />
                                </div>
                            </FormFooter>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default SelfieUpload;
