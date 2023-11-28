import React from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { Input, Text } from '@deriv/components';
import { hasInvalidCharacters } from '@deriv/shared';
import { IDENTIFIER_TYPES } from '../../Constants/poo-identifier';
import { isSpecialPaymentMethod } from '../../Helpers/utils';
import FileUploader from './file-uploader';
import { TPaymentMethod, TPaymentMethodInfo, TProofOfOwnershipData, TProofOfOwnershipFormValue } from '../../Types';
import ExampleLink from './example-link';

type TExpandedCardProps = {
    card_details: TPaymentMethodInfo;
};

/**
 *
 * @param card_details Details of payment method
 * @param index Index of payment method
 * @returns React Component
 */
const ExpandedCard = ({ card_details }: TExpandedCardProps) => {
    const { values, setFieldValue, errors } = useFormikContext<Partial<TProofOfOwnershipFormValue>>();

    const payment_method = card_details.payment_method.toLowerCase() as TPaymentMethod;

    const handleBlur = (payment_method_identifier: string, identifier_type: string, index: number) => {
        handleIdentifierChange(formatIdentifier(payment_method_identifier, identifier_type), index);
    };
    const handleIdentifierChange = (payment_method_identifier: string, index = 0) => {
        const selected_payment_method = values?.[payment_method];
        if (!selected_payment_method) {
            return;
        }

        selected_payment_method[index] = {
            ...selected_payment_method[index],
            payment_method_identifier,
            identifier_type: card_details?.identifier_type,
        };
        setFieldValue(payment_method, [...selected_payment_method]);
    };

    const formatIdentifier = (payment_method_identifier: string, identifier_type: string) => {
        let formatted_id = payment_method_identifier?.replace(/\s/g, '') || '';
        if (identifier_type === IDENTIFIER_TYPES.CARD_NUMBER) {
            if (formatted_id.length !== 16 || (formatted_id.length === 16 && hasInvalidCharacters(formatted_id))) {
                return formatted_id;
            }
            formatted_id = `${formatted_id.substring(0, 6)}XXXXXX${formatted_id.substring(12)}`;
        } else if ([IDENTIFIER_TYPES.EMAIL_ADDRESS, IDENTIFIER_TYPES.USER_ID].some(s => s === identifier_type)) {
            return formatted_id;
        }
        return formatted_id.replace(/(\w{4})/g, '$1 ').trim();
    };

    return (
        <div>
            {card_details?.instructions?.map(instruction => (
                <Text
                    className='proof-of-ownership__card-open-desc'
                    as='p'
                    color='general'
                    size='xs'
                    key={typeof instruction !== 'string' ? instruction.key : instruction}
                >
                    {instruction} {card_details?.identifier_type === IDENTIFIER_TYPES.CARD_NUMBER && <ExampleLink />}
                </Text>
            ))}
            <fieldset>
                {card_details?.items &&
                    card_details?.items.map((item, index) => {
                        const controls_to_show = [...Array(item?.documents_required).keys()];
                        return (
                            <div
                                className='proof-of-ownership__card-open-inputs'
                                key={`${item.payment_method}-${item.id}`}
                            >
                                {card_details?.input_label && isSpecialPaymentMethod(card_details?.icon) && (
                                    <div className='proof-of-ownership__card-open-inputs-field'>
                                        <Input
                                            label={card_details?.input_label}
                                            data-lpignore='true'
                                            className={classNames('proof-of-ownership__card-open-inputs-cardnumber', {
                                                'proof-of-ownership-valid-identifier':
                                                    values?.[payment_method]?.[index]?.payment_method_identifier &&
                                                    !errors?.[payment_method]?.[index]?.payment_method_identifier,
                                            })}
                                            type='text'
                                            onChange={e => {
                                                handleIdentifierChange(e.target.value, index);
                                            }}
                                            value={values?.[payment_method]?.[index]?.payment_method_identifier}
                                            onBlur={e => {
                                                handleBlur(e.target.value.trim(), card_details?.identifier_type, index);
                                            }}
                                            data-testid='dt_payment_method_identifier'
                                            error={errors?.[payment_method]?.[index]?.payment_method_identifier}
                                        />
                                    </div>
                                )}
                                {controls_to_show.map(i => (
                                    <React.Fragment key={`${item?.id}-${i}`}>
                                        {card_details?.input_label && !isSpecialPaymentMethod(card_details?.icon) && (
                                            <div className='proof-of-ownership__card-open-inputs-field'>
                                                <Input
                                                    label={card_details?.input_label}
                                                    data-lpignore='true'
                                                    className={classNames(
                                                        'proof-of-ownership__card-open-inputs-cardnumber',
                                                        {
                                                            'proof-of-ownership-valid-identifier':
                                                                values?.[payment_method]?.[index]
                                                                    ?.payment_method_identifier &&
                                                                !errors?.[payment_method]?.[index]
                                                                    ?.payment_method_identifier,
                                                        }
                                                    )}
                                                    type='text'
                                                    onChange={e => {
                                                        handleIdentifierChange(e.target.value.trim(), index);
                                                    }}
                                                    value={
                                                        values?.[payment_method]?.[index]?.payment_method_identifier ??
                                                        ''
                                                    }
                                                    onBlur={e => {
                                                        handleBlur(
                                                            e.target.value.trim(),
                                                            card_details?.identifier_type,
                                                            index
                                                        );
                                                    }}
                                                    data-testid='dt_payment_method_identifier'
                                                    error={
                                                        errors?.[payment_method]?.[index]?.payment_method_identifier ??
                                                        ''
                                                    }
                                                />
                                            </div>
                                        )}
                                        <div
                                            className={classNames('proof-of-ownership__card-open-inputs-upload', {
                                                expand: !card_details?.input_label,
                                                organise: card_details?.input_label !== null,
                                            })}
                                        >
                                            <FileUploader
                                                class_name='proof-of-ownership__card-open-inputs-photo'
                                                sub_index={i}
                                                name={payment_method}
                                                index={index}
                                            />
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        );
                    })}
            </fieldset>
        </div>
    );
};

export default ExpandedCard;
