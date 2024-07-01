import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { FormikValues, useFormikContext } from 'formik';
import {
    EmploymentStatusField,
    TaxIdentificationNumberField,
    TaxResidenceField,
} from '../../Components/forms/form-fields';
import { isFieldImmutable } from '../../Helpers/utils';
import { Checkbox, useOnClickOutside } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getLegalEntityName } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { useResidenceList } from '@deriv/hooks';
import './employment-tax-details-container.scss';

type TEmploymentTaxDetailsContainerProps = {
    editable_fields: string[];
    parent_ref: React.RefObject<HTMLDivElement>;
    should_display_long_message?: boolean;
    handleChange: (value: string) => void;
};

const EmploymentTaxDetailsContainer = ({
    editable_fields,
    parent_ref,
    should_display_long_message,
    handleChange,
}: TEmploymentTaxDetailsContainerProps) => {
    const { values, setFieldValue, touched, errors, setValues } = useFormikContext<FormikValues>();
    const { isMobile } = useDevice();
    const { data: residence_list } = useResidenceList();

    const [is_tax_residence_popover_open, setIsTaxResidencePopoverOpen] = useState(false);
    const [is_tin_popover_open, setIsTinPopoverOpen] = useState(false);

    const tax_residence_ref = useRef<HTMLDivElement>(null);
    const tin_ref = useRef<HTMLDivElement>(null);

    const validateClickOutside = (event: MouseEvent) => {
        const target = event?.target as HTMLElement;
        if (target.tagName === 'A') {
            event?.stopPropagation();
            return false;
        }
        return !tax_residence_ref.current?.contains(target) && !tin_ref.current?.contains(target);
    };

    const closeToolTips = () => {
        setIsTaxResidencePopoverOpen(false);
        setIsTinPopoverOpen(false);
    };

    useEffect(() => {
        if (values.tax_residence) {
            const tax_residence = residence_list.find(item => item.text === values.tax_residence)?.value;
            if (tax_residence) {
                handleChange(tax_residence);
            }
        }
    }, [handleChange, values.tax_residence, residence_list]);

    useEffect(() => {
        const parent_element = parent_ref?.current;

        if (parent_element) {
            parent_element.addEventListener('scroll', closeToolTips);
        }

        return () => {
            if (parent_element) {
                parent_element.removeEventListener('scroll', closeToolTips);
            }
        };
    }, [parent_ref]);

    const is_tax_details_confirm_disabled = useMemo(
        () =>
            (isFieldImmutable('tax_identification_number', editable_fields) &&
                isFieldImmutable('tax_residence', editable_fields)) ||
            !values.tax_identification_number ||
            !values.tax_residence,
        [editable_fields, values.tax_identification_number, values.tax_residence]
    );

    useOnClickOutside(tax_residence_ref, () => setIsTaxResidencePopoverOpen(false), validateClickOutside);
    useOnClickOutside(tin_ref, () => setIsTinPopoverOpen(false), validateClickOutside);

    return (
        <Fragment>
            <EmploymentStatusField required is_disabled={isFieldImmutable('employment_status', editable_fields)} />

            <Checkbox
                name='confirm_no_tax_details'
                className='employment_tax_detail_field-checkbox'
                data-lpignore
                onChange={() =>
                    setValues(
                        {
                            ...values,
                            confirm_no_tax_details: !values.confirm_no_tax_details,
                            tax_residence: '',
                            tax_identification_number: '',
                            tax_identification_confirm: false,
                        },
                        true
                    )
                }
                value={values.confirm_no_tax_details}
                label={localize('I do not have tax information')}
                withTabIndex={0}
                data-testid='confirm_no_tax_details'
                label_font_size={isMobile ? 'xxs' : 'xs'}
                label_line_height='m'
            />

            <div ref={tax_residence_ref} className='account-form__fieldset'>
                <TaxResidenceField
                    disabled={isFieldImmutable('tax_residence', editable_fields) || values.confirm_no_tax_details}
                    is_tax_residence_popover_open={is_tax_residence_popover_open}
                    setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                    setIsTinPopoverOpen={setIsTinPopoverOpen}
                />
            </div>
            <div ref={tin_ref} className='account-form__fieldset'>
                <TaxIdentificationNumberField
                    disabled={
                        isFieldImmutable('tax_identification_number', editable_fields) || values.confirm_no_tax_details
                    }
                    is_tin_popover_open={is_tin_popover_open}
                    setIsTinPopoverOpen={setIsTinPopoverOpen}
                    setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                />
            </div>
            <Checkbox
                name='tax_identification_confirm'
                className='employment_tax_detail_field-checkbox'
                data-lpignore
                onChange={() => setFieldValue('tax_identification_confirm', !values.tax_identification_confirm, true)}
                value={values.tax_identification_confirm}
                label={
                    should_display_long_message
                        ? localize(
                              'I hereby confirm that the tax information I provided is true and complete. I will also inform {{legal_entity_name}} about any changes to this information.',
                              {
                                  legal_entity_name: getLegalEntityName('maltainvest'),
                              }
                          )
                        : localize('I confirm that my tax information is accurate and complete.')
                }
                withTabIndex={0}
                data-testid='tax_identification_confirm'
                has_error={!!(touched.tax_identification_confirm && errors.tax_identification_confirm)}
                label_font_size={isMobile ? 'xxs' : 'xs'}
                label_line_height='m'
                disabled={values.confirm_no_tax_details || is_tax_details_confirm_disabled}
            />
        </Fragment>
    );
};

export default EmploymentTaxDetailsContainer;
