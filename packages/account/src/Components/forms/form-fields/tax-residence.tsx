/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck [TODO] - Need to fix typescript errors in Autocomplete & SelectNative components

import { ChangeEvent } from 'react';
import { Field, FieldProps } from 'formik';
import { ResidenceList } from '@deriv/api-types';
import { Autocomplete, SelectNative, Popover } from '@deriv/components';
import { useResidenceList } from '@deriv/hooks';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import clsx from 'clsx';

type TTaxResidenceFieldProps = {
    required?: boolean;
    setIsTaxResidencePopoverOpen: (is_open: boolean) => void;
    setIsTinPopoverOpen: (is_open: boolean) => void;
    is_tax_residence_popover_open: boolean;
    disabled: boolean;
    fieldFocused?: boolean;
};

const TaxResidenceField = ({
    required = false,
    setIsTaxResidencePopoverOpen,
    setIsTinPopoverOpen,
    is_tax_residence_popover_open,
    disabled,
    fieldFocused,
}: TTaxResidenceFieldProps) => {
    const { data: residence_list } = useResidenceList();
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    return (
        <Field name='tax_residence'>
            {({ field, form: { setFieldValue }, meta }: FieldProps) => (
                <div className='details-form__tax'>
                    {isDesktop ? (
                        <Autocomplete
                            {...field}
                            data-lpignore='true'
                            autoComplete='off' // prevent chrome autocomplete
                            label={required ? localize('Tax residence*') : localize('Tax residence')}
                            error={meta.touched ? meta.error : undefined}
                            list_items={residence_list}
                            onItemSelection={(item: TItem) => {
                                setFieldValue(
                                    'tax_residence',
                                    (item as ResidenceList[0]).value ? (item as ResidenceList[0]).text : '',
                                    true
                                );
                            }}
                            data-testid='tax_residence'
                            disabled={disabled}
                            required={required}
                            className={clsx({ 'focus-field': fieldFocused })}
                        />
                    ) : (
                        <SelectNative
                            {...field}
                            placeholder={required ? localize('Tax residence*') : localize('Tax residence')}
                            name={field.name}
                            label={required ? localize('Tax residence*') : localize('Tax residence')}
                            list_items={residence_list}
                            value={field.value}
                            use_text
                            error={meta.touched ? meta.error : ''}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                field.onChange(e);
                                setFieldValue('tax_residence', e.target.value, true);
                            }}
                            required={required}
                            data_testid='tax_residence_mobile'
                            disabled={disabled}
                            className={clsx({ 'focus-field': fieldFocused })}
                        />
                    )}
                    <div
                        data-testid='tax_residence_pop_over'
                        onClick={e => {
                            setIsTaxResidencePopoverOpen(true);
                            setIsTinPopoverOpen(false);
                            e.stopPropagation();
                        }}
                    >
                        <Popover
                            alignment={isDesktop ? 'right' : 'left'}
                            icon='info'
                            message={localize(
                                'The country in which you meet the criteria for paying taxes. Usually the country in which you physically reside.'
                            )}
                            zIndex='9998'
                            disable_message_icon
                            is_open={is_tax_residence_popover_open}
                        />
                    </div>
                </div>
            )}
        </Field>
    );
};

export default TaxResidenceField;
