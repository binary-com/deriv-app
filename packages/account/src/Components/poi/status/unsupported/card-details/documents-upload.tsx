import React from 'react';
import clsx from 'clsx';
import { Formik, Form, FormikValues } from 'formik';
import { Localize, localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import { Button, Icon, Text } from '@deriv/components';
import InputField from './input-field';
import Uploader from './uploader';
import { setInitialValues, validateFields } from './utils';
import { ROOT_CLASS, date_field, getDocumentIndex } from '../constants';
import FormFooter from '../../../../form-footer';
import FormBody from '../../../../form-body';

const icons = [
    {
        icon: 'IcPoiClearPhoto',
        text: localize('A clear colour photo or scanned image'),
    },
    {
        icon: 'IcPoiFileFormat',
        text: localize('JPEG, JPG, PNG, PDF, or GIF'),
    },
    {
        icon: 'IcPoiFileSize',
        text: localize('Less than 8MB'),
    },
    {
        icon: 'IcPoiDocExpiry',
        text: localize('Must be valid for at least 6 months'),
    },
];

type TDocumentsUpload = {
    initial_values?: FormikValues;
    is_from_external?: boolean;
    goToCards: () => void;
    onSubmit: () => void;
    data: ReturnType<typeof getDocumentIndex>[number]['details'];
};

type TIconsItem = {
    data: FormikValues;
};

const IconsItem = ({ data }: TIconsItem) => (
    <div className={`${ROOT_CLASS}__icons-item`}>
        <Icon icon={data.icon} size={24} />
        <Text as='p' size='xxxs' align='center'>
            {data.text}
        </Text>
    </div>
);

const DocumentsUpload = ({ initial_values, is_from_external, data, goToCards, onSubmit }: TDocumentsUpload) => {
    const { isDesktop } = useDevice();
    const { fields, documents_title, documents } = data;
    const is_expiry_date_required = fields.some(field => field.name === date_field.name);

    const fields_title = is_expiry_date_required ? (
        <Localize
            i18n_default_text='First, enter your {{label}} and the expiry date.'
            values={{
                label: fields?.[0].label,
            }}
        />
    ) : (
        <Localize
            i18n_default_text='First, enter your {{label}}.'
            values={{
                label: fields?.[0].label,
            }}
        />
    );

    return (
        <div
            className={clsx(ROOT_CLASS, {
                [`${ROOT_CLASS}--mobile`]: !isDesktop,
            })}
        >
            <Formik
                initialValues={initial_values || setInitialValues([...(fields || []), ...(documents || [])])}
                validate={values => validateFields(values, fields, documents)}
                onSubmit={onSubmit}
            >
                {({ values, isValid, touched }: FormikValues) => {
                    const is_form_touched = Object.keys(touched).length > 0;
                    const is_form_empty = Object.values(values).some(
                        (field, key) => (field === null || field === '') && fields?.[key]?.required
                    );

                    return (
                        <Form className={`${ROOT_CLASS}__form`}>
                            <FormBody className='form-body' scroll_offset={isDesktop ? '80px' : '180px'}>
                                <div className={`${ROOT_CLASS}__fields-content`}>
                                    <Text as='h3' size='s' color='prominent'>
                                        {fields_title}
                                    </Text>
                                    <div className={`${ROOT_CLASS}__fields-wrap`}>
                                        {fields?.map((field: FormikValues) => (
                                            <InputField key={field.name} data={field} />
                                        ))}
                                    </div>
                                    <div className={`${ROOT_CLASS}__divider`} />
                                    <Text as='h3' size='s' color='prominent'>
                                        {documents_title}
                                    </Text>
                                    <div className={`${ROOT_CLASS}__uploaders-wrap`}>
                                        {documents?.map((item: FormikValues) => (
                                            <Uploader
                                                key={item.name}
                                                data={item}
                                                value={values[item.name]}
                                                is_full={documents.length === 1 || is_from_external}
                                            />
                                        ))}
                                    </div>
                                    <div className={`${ROOT_CLASS}__icons`}>
                                        {icons.map(item =>
                                            item.icon === 'IcPoiDocExpiry' && !is_expiry_date_required ? null : (
                                                <IconsItem key={item.icon} data={item} />
                                            )
                                        )}
                                    </div>
                                </div>
                            </FormBody>
                            <FormFooter>
                                <div className={`${ROOT_CLASS}__btns`}>
                                    <Button onClick={goToCards} secondary large text={localize('Back')} />
                                    <Button
                                        type='submit'
                                        primary
                                        large
                                        is_disabled={!isValid || (!is_form_touched && is_form_empty)}
                                        text={localize('Next')}
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

export default DocumentsUpload;
