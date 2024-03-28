import React from 'react';
import { Field, Form, Formik, FormikValues } from 'formik';
import { Button, Icon, Input, Modal } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type tPreferredCountriesModal = {
    onApply?: () => void;
};

const PreferredCountriesModal = ({ onApply }: tPreferredCountriesModal) => {
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal
            className='preferred-countries-modal'
            is_open={is_modal_open}
            small
            title={localize('Preferred countries')}
            toggleModal={() => hideModal()}
        >
            <Modal.Body className='preferred-countries-modal__body'>
                <Formik initialValues={{ search: '' }}>
                    {({ submitForm, values: { search } }) => (
                        <Form>
                            <Field name='search'>
                                {({ field }: FormikValues) => (
                                    <Input
                                        {...field}
                                        className='preferred-countries-modal__search-field'
                                        data-lpignore='true'
                                        leading_icon={<Icon icon='IcSearch' />}
                                        name='search'
                                        onFocus={submitForm}
                                        placeholder={localize('Search countries')}
                                        trailing_icon={search ? <Icon color='secondary' icon='IcCloseCircle' /> : null}
                                        type='text'
                                    />
                                )}
                            </Field>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
            <Modal.Footer className='preferred-countries-modal__footer'>
                <Button large onClick={hideModal} secondary>
                    <Localize i18n_default_text='Clear' />
                </Button>
                <Button primary large onClick={onApply}>
                    <Localize i18n_default_text='Apply' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default PreferredCountriesModal;
