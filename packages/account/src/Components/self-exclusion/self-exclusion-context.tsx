import React from 'react';
import { FormikHelpers, FormikValues } from 'formik';

export type TSelfExclusionContext = {
    backFromConfirmLimits?: () => void;
    currency: string;
    currency_display?: string;
    exclusion_texts?: Record<string, string>;
    footer_ref?: React.RefObject<HTMLElement>;
    getMaxLength?: (value: string) => void;
    goToConfirm?: (value: FormikValues) => void;
    handleSubmit: (values: FormikValues, setSubmitting: FormikHelpers<FormikValues>) => void;
    is_app_settings?: boolean;
    is_eu?: boolean;
    is_mf?: boolean;
    is_tablet?: boolean;
    is_wrapper_bypassed?: boolean;
    overlay_ref: HTMLDivElement;
    session_duration_digits?: number | boolean;
    state?: FormikValues;
    toggleArticle?: () => void;
    validateFields?: (values: FormikValues) => Record<string, string | null | undefined>;
};

const SelfExclusionContext = React.createContext<TSelfExclusionContext>({
    overlay_ref: document.createElement('div'),
    currency: '',
    handleSubmit: () => null,
});

export default SelfExclusionContext;
