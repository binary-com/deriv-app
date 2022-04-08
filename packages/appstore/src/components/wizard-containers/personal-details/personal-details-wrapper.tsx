import React from 'react';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import { FormikValues } from 'formik';
import { personalDetailsConfig, PersonalDetails } from '@deriv/account';

const PersonalDetailsWrapper = ({ onSubmit }: any) => {
    const { client } = useStores();
    const [is_submit_disabled, setIsSubmitDisabled] = React.useState(false);
    const formik_ref = React.useRef<FormikValues>(null);

    React.useEffect(() => {
        if (!is_submit_disabled) {
            onSubmit(formik_ref.current?.values);
        }
    }, [is_submit_disabled]);

    const { account_settings, upgrade_info, residence_list, landing_company_shortcode } = client;

    const real_account_signup_target = landing_company_shortcode;

    const personal_details_config = personalDetailsConfig(
        {
            upgrade_info,
            real_account_signup_target,
            residence_list,
            account_settings,
        },
        PersonalDetails
    );

    const Body = personal_details_config.body;

    return (
        <Body
            value={personal_details_config.form_value}
            onSubmitEnabledChange={setIsSubmitDisabled}
            selected_step_ref={formik_ref}
            {...personal_details_config.props}
        />
    );
};

export default observer(PersonalDetailsWrapper);
