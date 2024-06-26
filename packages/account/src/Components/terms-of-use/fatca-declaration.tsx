import React from 'react';
import { FieldInputProps } from 'formik';
import { Text, Dropdown } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { Localize, localize } from '@deriv/translations';
import { getFatcaDeclaration, getAgreementOptions } from '../../Constants/fatca-declaration';
import './terms-of-use.scss';

type TFATCADeclarationProps = {
    field: FieldInputProps<'0' | '1'>;
    is_disabled: boolean;
} & React.ComponentPropsWithoutRef<typeof Dropdown>;

/**
 * Component that displays the FATCA declaration and a dropdown to select yes or no
 * @name FatcaDeclaration
 * @param field - Formik FieldInputProps
 * @returns React Component
 */
const FatcaDeclaration = ({ field: { value, onChange, name }, ...props }: TFATCADeclarationProps) => {
    const { isDesktop } = useDevice();
    return (
        <React.Fragment>
            <Text as='h4' size='xs' weight='bold'>
                <Localize i18n_default_text='FATCA declaration' />
            </Text>
            <div className='fatca-declaration__layout'>
                <ol>
                    {getFatcaDeclaration().map((item, idx) => (
                        <Text
                            as='li'
                            key={`point_${idx}`}
                            size={isDesktop ? 'xs' : 'xxs'}
                            className='fatca-declaration__points'
                        >
                            {idx + 1}. {item}
                        </Text>
                    ))}
                </ol>
                <Text as='p' size={isDesktop ? 'xs' : 'xxs'} className='fatca-declaration__points'>
                    <Localize
                        i18n_default_text='If any of the above applies to you, select <0>Yes.</0> Otherwise, select <0>No.</0>'
                        components={[<strong key={0} />]}
                    />
                </Text>
                <Dropdown
                    {...props}
                    is_align_text_left
                    name={name}
                    placeholder={localize('Please select*')}
                    value={value}
                    list={getAgreementOptions()}
                    className='fatca-declaration__agreement'
                    onChange={onChange}
                    disabled={props.is_disabled}
                />
            </div>
        </React.Fragment>
    );
};

export default FatcaDeclaration;
