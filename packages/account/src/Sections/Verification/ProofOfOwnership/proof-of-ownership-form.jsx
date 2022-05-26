import classNames from 'classnames';
import React from 'react';
import { Button, FormSubmitErrorMessage } from '@deriv/components';
import { Formik } from 'formik';
import { localize } from '@deriv/translations';
import FormFooter from '../../../Components/form-footer';
import FormBody from '../../../Components/form-body';
import FormSubHeader from '../../../Components/form-sub-header';
import FormBodySection from '../../../Components/form-body-section';
import { isMobile } from '@deriv/shared';
import Card from './Card.jsx';

const getScrollOffset = (itemsCount = 0) => {
    if (isMobile()) return '200px';
    if (itemsCount <= 2) return '0px';
    return '80px';
};
const validateFields = values => {
    const errors = {};
    errors.data = [];
    values.data.map((item, index) => {
        if (item?.file?.type && !/image\/(jpe?g|pdf|png)$/.test(item?.file?.type)) {
            errors.data[index] = {};
            errors.data[index].file = localize(
                "That file format isn't supported. Please upload .pdf, .png, .jpg, or .jpeg files only."
            );
        }
        if (item?.file?.size / 1024 > 8000) {
            errors.data[index] = {};
            errors.data[index].file = localize(
                'That file is too big (only up to 8MB allowed). Please upload another file.'
            );
        }
    });

    return errors;
};
const ProofOfOwnershipForm = ({ cards, handleSubmit }) => {
    const initValues = {};
    initValues.data = cards.map(item => {
        return { id: item.id, file: null };
    });
    return (
        <Formik initialValues={initValues} validate={validateFields}>
            {({
                values,
                errors,
                // isValid,
                // touched,
                handleChange,
                handleBlur,
                // isSubmitting,
                setFieldValue,
                // submitForm,
            }) => (
                <form className='proof-of-ownership' onSubmit={handleSubmit}>
                    <FormBody scroll_offset={getScrollOffset(cards.length)}>
                        <FormSubHeader title={localize('Please upload the following document(s).')} />
                        <FormBodySection>
                            <fieldset>
                                {cards.map((card, index) => {
                                    return (
                                        <div className='proof-of-ownership__form-content' key={card.id}>
                                            <div className='proof-of-ownership__progress'>
                                                <div className='proof-of-ownership__progress-number'>{index + 1}</div>
                                                {index !== cards.length - 1 && (
                                                    <div className='proof-of-ownership__progress-bar' />
                                                )}
                                            </div>
                                            <Card
                                                error={errors?.data?.[index]}
                                                index={index}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                values={values}
                                                card={card}
                                                setFieldValue={setFieldValue}
                                            />
                                        </div>
                                    );
                                })}
                            </fieldset>
                        </FormBodySection>
                    </FormBody>
                    <FormFooter>
                        {status?.msg && <FormSubmitErrorMessage message={status?.msg} />}
                        <Button
                            type='submit'
                            className={classNames('account-form__footer-btn')}
                            is_disabled={(() => {
                                const emptyFiles = values.data.some(item => !item?.file);
                                return emptyFiles || errors?.data?.length > 0;
                            })()}
                            data-testid={'next-button'}
                            has_effect
                            // is_loading={is_btn_loading}
                            // is_submit_success={is_submit_success}
                            text={localize('Next')}
                            large
                            primary
                            form={'first-step'}
                        />
                    </FormFooter>
                </form>
            )}
        </Formik>
    );
};

export default ProofOfOwnershipForm;
