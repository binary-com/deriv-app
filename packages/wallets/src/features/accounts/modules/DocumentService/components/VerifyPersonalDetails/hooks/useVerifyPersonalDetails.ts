import { useState } from 'react';
import { FormikValues } from 'formik';
import { useSettings } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { FormatUtils } from '@deriv-com/utils';
import type { TVerifyPersonalDetailsValues } from '../types';

const useVerifyPersonalDetails = () => {
    const { data: settings, isLoading, updateAsync } = useSettings();
    const [isSubmissionInitiated, setIsSubmissionInitiated] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<TSocketError<'set_settings'>>();

    const formattedDateOfBirth = FormatUtils.getFormattedDateString(new Date((settings.date_of_birth ?? 0) * 1000));

    const initialValues = {
        dateOfBirth: formattedDateOfBirth,
        firstName: settings.first_name,
        lastName: settings.last_name,
    };

    const submit = (values: FormikValues | TVerifyPersonalDetailsValues) => {
        const isDirty =
            formattedDateOfBirth !== values.dateOfBirth ||
            settings.first_name !== values.firstName ||
            settings.last_name !== values.lastName;

        if (isDirty) {
            setIsSubmissionInitiated(true);
            updateAsync({
                date_of_birth: values.dateOfBirth,
                first_name: values.firstName,
                last_name: values.lastName,
            })
                .then(() => {
                    setIsSubmitted(true);
                    setIsSubmissionInitiated(false);
                })
                .catch(err => {
                    setIsSubmissionInitiated(false);
                    setError(err as TSocketError<'set_settings'>);
                });
        } else {
            setIsSubmitted(true);
        }
    };

    return {
        error: error?.error,
        initialValues,
        isLoading,
        isSubmitted,
        isSubmitting: isLoading && isSubmissionInitiated,
        submit,
    };
};

export default useVerifyPersonalDetails;
