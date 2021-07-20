import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { Button, Icon, Text } from '@deriv/components';
import InputField from './input-field.jsx';
import Uploader from './uploader.jsx';
import { setInitialValues, validateFields } from './utils';
import { ROOT_CLASS } from '../constants';

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

const IconsItem = ({ data }) => (
    <div className={`${ROOT_CLASS}__icons-item`}>
        <Icon icon={data.icon} size={24} />
        <Text as='p' size='xxxs' align='center'>
            {data.text}
        </Text>
    </div>
);

const DocumentsUpload = ({ initial_values, data, goToCards, onSubmit }) => {
    const { fields, documents_title, documents } = data;

    const fields_title = localize('First, enter your {{label}} and the expiry date.', {
        label: fields[0].label,
    });

    const goBack = () => {
        goToCards();
    };

    return (
        <div
            className={classNames(ROOT_CLASS, {
                [`${ROOT_CLASS}--mobile`]: isMobile(),
            })}
        >
            <Formik
                initialValues={initial_values || setInitialValues([...fields, ...documents])}
                validate={values => validateFields(values, fields, documents)}
                onSubmit={onSubmit}
            >
                {({ values, isValid, touched }) => {
                    const is_form_touched = Object.keys(touched).length > 0;
                    const is_form_empty = Object.values(values).some(field => field === null || field === '');

                    return (
                        <Form className={`${ROOT_CLASS}__form`}>
                            <div className={`${ROOT_CLASS}__fields-content`}>
                                <Text as='h3' size='s' color='prominent'>
                                    {fields_title}
                                </Text>
                                <div className={`${ROOT_CLASS}__fields-wrap`}>
                                    {fields.map(field => (
                                        <InputField key={field.name} data={field} />
                                    ))}
                                </div>
                                <div className={`${ROOT_CLASS}__divider`} />
                                <Text as='h3' size='s' color='prominent'>
                                    {documents_title}
                                </Text>
                                <div className={`${ROOT_CLASS}__uploaders-wrap`}>
                                    {documents.map(item => (
                                        <Uploader
                                            key={item.name}
                                            data={item}
                                            value={values[item.name]}
                                            is_full={documents.length === 1}
                                        />
                                    ))}
                                </div>
                                <div className={`${ROOT_CLASS}__icons`}>
                                    {icons.map(item => (
                                        <IconsItem key={item.icon} data={item} />
                                    ))}
                                </div>
                            </div>
                            <div className={`${ROOT_CLASS}__btns`}>
                                <Button
                                    onClick={goBack}
                                    secondary
                                    large
                                    text={localize('Go back')}
                                    icon={<Icon icon={'IcButtonBack'} size={16} />}
                                />
                                <Button
                                    type='submit'
                                    primary
                                    large
                                    is_disabled={!isValid || (!is_form_touched && is_form_empty)}
                                    text={localize('Next')}
                                />
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

DocumentsUpload.propTypes = {
    initial_values: PropTypes.object,
    data: PropTypes.object,
    goToCards: PropTypes.func,
    onSubmit: PropTypes.func,
};
export default DocumentsUpload;
