import * as React from 'react';
import { useFormikContext, Formik, Field, Form } from 'formik';
import { Button, Input, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import IconClose from 'Assets/icon-close.jsx';
import NicknameFormWrapper from './nickname-form-wrapper.jsx';
import './nickname-form.scss';

const ButtonGroupComponent = observer(() => {
    const { general_store } = useStores();
    const { errors, isSubmitting, values } = useFormikContext();

    return (
        <Button.Group>
            <Button secondary type='button' onClick={general_store.onNicknamePopupClose} large>
                {localize('Cancel')}
            </Button>
            <Button
                type='submit'
                is_disabled={
                    !!general_store.nickname_error || !!errors.nickname || !!isSubmitting || values.nickname === ''
                }
                primary
                large
            >
                {localize('Confirm')}
            </Button>
        </Button.Group>
    );
});

const InputComponent = observer(({ field }) => {
    const { general_store } = useStores();
    const { errors, handleChange } = useFormikContext();

    return (
        <Input
            {...field}
            data-lpignore='true'
            error={general_store.nickname_error || errors.nickname}
            label={localize('Your nickname')}
            className='dp2p-nickname__form-field'
            onChange={e => {
                handleChange(e);
                general_store.setNicknameError(undefined);
            }}
            required
        />
    );
});

const NicknameForm = () => {
    const { general_store } = useStores();

    return (
        <NicknameFormWrapper>
            {!isMobile() && (
                <div className='dp2p-nickname__form-header dp2p-nickname__form-header--no-border'>
                    <div className='dp2p-nickname__form-header_wrapper dp2p-nickname__form-header_right'>
                        <IconClose
                            className='dp2p-nickname__form-close_icon'
                            onClick={general_store.onNicknamePopupClose}
                        />
                    </div>
                </div>
            )}
            <Formik
                validate={general_store.validatePopup}
                initialValues={{ nickname: '' }}
                onSubmit={async values => {
                    await general_store.createAdvertiser(values.nickname);
                }}
            >
                <Form className='dp2p-nickname__form-wrapper' noValidate>
                    <div className='dp2p-nickname__form-content dp2p-nickname__form-content__centre'>
                        <Icon icon='IcCashierP2pUser' width='128' height='128' />
                        <Text
                            as='h5'
                            size='s'
                            weight='bold'
                            line_height='unset'
                            className='dp2p-nickname__form-content--title'
                        >
                            {localize('Choose a nickname')}
                        </Text>
                        <Text as='p' size='xs' line_height='unset' className='dp2p-nickname__form-content--text'>
                            {localize('You will appear to other users as')}
                        </Text>
                        <div className='dp2p-nickname__form-field_wrapper'>
                            <Field name='nickname'>
                                {({ field }) => {
                                    return <InputComponent field={field} />;
                                }}
                            </Field>
                        </div>
                        <div className='dp2p-nickname__form-content--ps'>
                            {localize('Once set, your nickname cannot be changed.')}
                        </div>
                    </div>
                    <div className='dp2p-nickname__form-footer'>
                        <ButtonGroupComponent />
                    </div>
                </Form>
            </Formik>
        </NicknameFormWrapper>
    );
};

export default observer(NicknameForm);
