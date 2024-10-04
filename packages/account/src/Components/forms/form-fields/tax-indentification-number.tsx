import { Localize, useTranslations } from '@deriv-com/translations';
import FormInputField from './form-input-field';
import { Popover } from '@deriv/components';
import { OECD_TIN_FORMAT_URL } from '../../../Constants/external-urls';
import { useDevice } from '@deriv-com/ui';
import clsx from 'clsx';

type TTaxIdentificationNumberFieldProps = {
    required?: boolean;
    disabled: boolean;
    is_tin_popover_open: boolean;
    setIsTinPopoverOpen: (is_open: boolean) => void;
    setIsTaxResidencePopoverOpen: (is_open: boolean) => void;
    fieldFocused?: boolean;
};

const TaxIdentificationNumberField = ({
    required = false,
    is_tin_popover_open,
    setIsTinPopoverOpen,
    setIsTaxResidencePopoverOpen,
    disabled,
    fieldFocused,
}: TTaxIdentificationNumberFieldProps) => {
    const { localize } = useTranslations();

    const { isDesktop } = useDevice();

    return (
        <div className='details-form__tax'>
            <FormInputField
                name='tax_identification_number'
                label={required ? localize('Tax identification number*') : localize('Tax identification number')}
                placeholder={localize('Tax identification number')}
                data-testid='tax_identification_number'
                disabled={disabled}
                required={required}
                className={clsx({ 'focus-field': fieldFocused })}
            />
            <div
                data-testid='tax_identification_number_pop_over'
                onClick={e => {
                    setIsTaxResidencePopoverOpen(false);
                    setIsTinPopoverOpen(true);
                    if ((e.target as HTMLElement).tagName !== 'A') e.stopPropagation();
                }}
            >
                <Popover
                    alignment={isDesktop ? 'right' : 'left'}
                    icon='info'
                    is_open={is_tin_popover_open}
                    message={
                        <Localize
                            i18n_default_text={
                                "Don't know your tax identification number? Click <0>here</0> to learn more."
                            }
                            components={[
                                <a
                                    key={0}
                                    className='link link--red'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href={OECD_TIN_FORMAT_URL}
                                />,
                            ]}
                        />
                    }
                    zIndex='9998'
                    disable_message_icon
                />
            </div>
        </div>
    );
};

export default TaxIdentificationNumberField;
