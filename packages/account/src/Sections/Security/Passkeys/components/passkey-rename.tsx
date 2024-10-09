import { Form, Formik } from 'formik';
import { Localize, useTranslations } from '@deriv-com/translations';
import { DerivLightIcEditPasskeyIcon } from '@deriv/quill-icons';
import { FormInputField } from '../../../../Components/forms/form-fields';
import { TCurrentManagedPasskey } from '../passkeys';
import { getPasskeyRenameValidationSchema } from '../passkeys-configs';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';

type TPasskeyRename = { current_managed_passkey: TCurrentManagedPasskey } & TPasskeysButtonOnClicks;

type TInitialValues = { passkey_name: string };

export const PasskeyRename = ({
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    current_managed_passkey,
}: TPasskeyRename) => {
    const { localize } = useTranslations();

    const form_initial_values: TInitialValues = {
        passkey_name: current_managed_passkey.name,
    };

    const onSubmitValues = (values: TInitialValues) => {
        onPrimaryButtonClick?.(values.passkey_name);
    };

    return (
        <Formik
            initialValues={form_initial_values}
            onSubmit={onSubmitValues}
            validationSchema={getPasskeyRenameValidationSchema()}
            noValidate
        >
            {({ dirty, isValid }) => (
                <div className='passkeys'>
                    <Form>
                        <PasskeysStatusLayout
                            icon={<DerivLightIcEditPasskeyIcon height='96px' width='96px' />}
                            title={<Localize i18n_default_text='Edit passkey' />}
                            onPrimaryButtonClick={onPrimaryButtonClick}
                            onSecondaryButtonClick={onSecondaryButtonClick}
                            primary_button_text={<Localize i18n_default_text='Save changes' />}
                            secondary_button_text={<Localize i18n_default_text='Back' />}
                            primary_button_disabled={!dirty || !isValid}
                            primary_button_type='submit'
                        >
                            <FormInputField label={localize('Passkey name')} name='passkey_name' />
                        </PasskeysStatusLayout>
                    </Form>
                </div>
            )}
        </Formik>
    );
};
