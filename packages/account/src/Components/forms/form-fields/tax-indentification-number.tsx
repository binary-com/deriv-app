import { Localize, localize } from '@deriv/translations';
import FormInputField from './form-input-field';
import { Popover } from '@deriv/components';
import { isDesktop } from '@deriv/shared';

type TTaxIdentificationNumberFieldProps = {
    required?: boolean;
    disabled: boolean;
    is_tin_popover_open: boolean;
    setIsTinPopoverOpen: (is_open: boolean) => void;
    setIsTaxResidencePopoverOpen: (is_open: boolean) => void;
};

const TaxIdentificationNumberField = ({
    required = false,
    is_tin_popover_open,
    setIsTinPopoverOpen,
    setIsTaxResidencePopoverOpen,
    disabled,
}: TTaxIdentificationNumberFieldProps) => (
    <div className='details-form__tax'>
        <FormInputField
            name='tax_identification_number'
            label={required ? localize('Tax Identification Number*') : localize('Tax Identification Number')}
            placeholder={localize('Tax Identification Number')}
            data-testid='tax_identification_number'
            disabled={disabled}
            required={required}
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
                alignment={isDesktop() ? 'right' : 'left'}
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
                                href='https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/'
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

export default TaxIdentificationNumberField;
