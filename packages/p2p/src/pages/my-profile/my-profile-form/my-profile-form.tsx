import React from 'react';
import classNames from 'classnames';
import { Field, Form, Formik } from 'formik';
import { Observer } from 'mobx-react-lite';
import {
    Button,
    DesktopWrapper,
    Input,
    Loading,
    MobileFullPageModal,
    MobileOrTabletWrapper,
    Text,
} from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import SectionError from 'Components/section-error';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';

const MyProfileForm = () => {
    const { general_store, my_profile_store } = useStores();

    const content = (
        <Formik
            enableReinitialize
            initialValues={{
                contact_info: general_store.contact_info,
                default_advert_description: general_store.default_advert_description,
            }}
            onSubmit={my_profile_store.handleSubmit}
            validate={my_profile_store.validateForm}
        >
            {({ dirty, errors, isSubmitting, isValid }) => {
                return (
                    <Form className='my-profile-form__form'>
                        <Field name='contact_info'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    className='my-profile-form__textarea'
                                    error={errors.contact_info}
                                    has_character_counter
                                    initial_character_count={general_store.contact_info.length}
                                    label={
                                        <Text color='less-prominent' size='xs'>
                                            <Localize i18n_default_text='Contact details' />
                                        </Text>
                                    }
                                    max_characters={300}
                                    type='textarea'
                                />
                            )}
                        </Field>
                        <Field name='default_advert_description'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    className='my-profile-form__textarea'
                                    error={errors.default_advert_description}
                                    has_character_counter
                                    hint={localize('This information will be visible to everyone.')}
                                    initial_character_count={general_store?.default_advert_description?.length}
                                    is_relative_hint
                                    max_characters={300}
                                    label={
                                        <Text color='less-prominent' size='xs'>
                                            <Localize i18n_default_text='Instructions' />
                                        </Text>
                                    }
                                    type='textarea'
                                />
                            )}
                        </Field>
                        <div className='my-profile-form__footer'>
                            <Observer>
                                {() => (
                                    <React.Fragment>
                                        <SectionError message={my_profile_store.form_error} />
                                        <Button
                                            className={classNames('my-profile-form__footer-button', {
                                                'dc-btn--green': my_profile_store.is_submit_success,
                                            })}
                                            has_effect
                                            is_disabled={!dirty || isSubmitting || !isValid}
                                            is_submit_success={my_profile_store.is_submit_success}
                                            large
                                            primary
                                        >
                                            <Localize i18n_default_text='Save' />
                                        </Button>
                                    </React.Fragment>
                                )}
                            </Observer>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <>
            <DesktopWrapper>
                <div className='my-profile-form'>{content}</div>
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <MobileFullPageModal
                    className='my-profile-form'
                    is_modal_open={my_profile_store.active_tab === my_profile_tabs.AD_TEMPLATE}
                    onClickClose={() => {
                        // do nothing
                    }}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                    page_header_text={localize('Ad details')}
                >
                    {content}
                </MobileFullPageModal>
            </MobileOrTabletWrapper>
        </>
    );
};

export default observer(MyProfileForm);
