import React from 'react';
import { useFormikContext } from 'formik';

type TScrollToFieldWithError = {
    fields_to_scroll_top?: string[];
    fields_to_scroll_end?: string[];
    should_recollect_inputs_names?: boolean;
};

const ScrollToFieldWithError = ({
    fields_to_scroll_top,
    fields_to_scroll_end,
    should_recollect_inputs_names = false,
}: TScrollToFieldWithError) => {
    const [all_page_inputs_names, setAllPageInputsNames] = React.useState<string[]>([]);
    const formik = useFormikContext();
    const is_submitting = formik.isSubmitting;
    const scrollToElement = (element_name: string, block: ScrollLogicalPosition = 'center') => {
        if (!element_name) return;
        const el = document.querySelector(`[name="${element_name}"]`) as HTMLInputElement;
        (el?.parentElement ?? el)?.scrollIntoView({ behavior: 'smooth', block });
        if (el?.type !== 'radio') el?.focus();
    };

    React.useEffect(() => {
        const inputs = [...document.querySelectorAll('input, select')] as HTMLInputElement[];
        setAllPageInputsNames(inputs.map(input => input.name));
    }, [should_recollect_inputs_names]);
    React.useEffect(() => {
        let current_error_field_name = '';

        for (let i = 0; i <= all_page_inputs_names.length; i++) {
            if (Object.hasOwn(formik.errors, all_page_inputs_names[i])) {
                current_error_field_name = all_page_inputs_names[i];
                break;
            }
        }

        if (fields_to_scroll_top?.includes(current_error_field_name)) {
            scrollToElement(current_error_field_name, 'start');
        } else if (fields_to_scroll_end?.includes(current_error_field_name)) {
            scrollToElement(current_error_field_name, 'end');
        } else {
            scrollToElement(current_error_field_name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_submitting]);

    return null;
};

export default ScrollToFieldWithError;
