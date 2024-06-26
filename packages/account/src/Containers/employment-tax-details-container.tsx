import { Fragment, useEffect, useRef, useState } from 'react';
import { FormikValues, useFormikContext } from 'formik';
import {
    EmploymentStatusField,
    TaxIdentificationNumberField,
    TaxResidenceField,
} from '../Components/forms/form-fields';
import { isFieldImmutable } from '../Helpers/utils';
import { Checkbox, useOnClickOutside } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getLegalEntityName } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

type TEmploymentTaxDetailsContainerProps = {
    editable_fields: string[];
    parent_ref: React.RefObject<HTMLDivElement>;
    should_display_long_message?: boolean;
};

const EmploymentTaxDetailsContainer = observer(
    ({ editable_fields, parent_ref, should_display_long_message }: TEmploymentTaxDetailsContainerProps) => {
        const { values, setFieldValue, touched, errors } = useFormikContext<FormikValues>();

        const {
            ui: { is_mobile },
        } = useStore();

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

        useOnClickOutside(tax_residence_ref, () => setIsTaxResidencePopoverOpen(false), validateClickOutside);
        useOnClickOutside(tin_ref, () => setIsTinPopoverOpen(false), validateClickOutside);

        return (
            <Fragment>
                <EmploymentStatusField required is_disabled={isFieldImmutable('employment_status', editable_fields)} />
                <div ref={tax_residence_ref} className='account-form__fieldset'>
                    <TaxResidenceField
                        disabled={isFieldImmutable('tax_residence', editable_fields)}
                        is_tax_residence_popover_open={is_tax_residence_popover_open}
                        setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                        setIsTinPopoverOpen={setIsTinPopoverOpen}
                    />
                </div>
                <div ref={tin_ref} className='account-form__fieldset'>
                    <TaxIdentificationNumberField
                        disabled={isFieldImmutable('tax_identification_number', editable_fields)}
                        is_tin_popover_open={is_tin_popover_open}
                        setIsTinPopoverOpen={setIsTinPopoverOpen}
                        setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                    />
                </div>
                <Checkbox
                    name='tax_identification_confirm'
                    className='details-form__tin-confirm'
                    data-lpignore
                    onChange={() =>
                        setFieldValue('tax_identification_confirm', !values.tax_identification_confirm, true)
                    }
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
                    label_font_size={is_mobile ? 'xxs' : 'xs'}
                    label_line_height='m'
                />
            </Fragment>
        );
    }
);

export default EmploymentTaxDetailsContainer;
