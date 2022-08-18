import { Button, Icon, Text } from '@deriv/components';
import classNames from 'classnames';
import * as React from 'react';
import ExpandedCard from './ExpandedCard.jsx';
import PropTypes from 'prop-types';
import paymentMethodConfig from './payment-method-config';

const Card = ({
    card,
    handleChange,
    handleBlur,
    values,
    setFieldValue,
    index,
    error,
    validateField,
    updateErrors,
    is_dark_mode,
}) => {
    const [show_browse_button, setShowBrowseButton] = React.useState([]);
    const card_details = paymentMethodConfig[card.payment_method] ?? paymentMethodConfig.other;
    values.data[index].files_required = card_details.documents_required;
    const updateShowBrowseButton = (sub_index, value) => {
        const show_browse_button_state = [...show_browse_button];
        show_browse_button_state[sub_index] = value;
        setShowBrowseButton(show_browse_button_state);
    };
    const onClickHandler = e => {
        e.preventDefault();
        setIsOpen(!is_open);
    };
    const [is_open, setIsOpen] = React.useState(false);
    const icon = (
        <Icon
            icon={'IcChevronUpBold'}
            size={16}
            className={classNames('proof-of-ownership__card-item-icon', {
                'proof-of-ownership__card-item-icon--invert': !is_open,
            })}
        />
    );

    return (
        <div
            className={classNames('proof-of-ownership__card', { 'proof-of-ownership__card-open': is_open })}
            data-testid={card.id}
            role='card-item'
        >
            <div className='proof-of-ownership__card-item' onClick={onClickHandler}>
                <Icon
                    icon={`${is_dark_mode ? card_details?.icon_dark : card_details?.icon_light}`}
                    className='proof-of-ownership__card-item-logo'
                    width={68}
                    height={58}
                />
                <Text className='proof-of-ownership__card-item-text' as='p' color='general' size='s' weight='bold'>
                    {card?.payment_method || 'Payment method'}
                </Text>
                <Button
                    id='proof-of-ownership'
                    icon={icon}
                    className='proof-of-ownership__card-item-icon'
                    onClick={onClickHandler}
                    transparent
                    data-testid={'proof-of-ownership-button'}
                />
            </div>
            {is_open && (
                <ExpandedCard
                    card_details={card_details}
                    identifier={card.payment_method_identifier}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    setFieldValue={setFieldValue}
                    index={index}
                    error={error}
                    validateField={validateField}
                    updateErrors={updateErrors}
                    show_browse_button={show_browse_button}
                    updateShowBrowseButton={updateShowBrowseButton}
                />
            )}
        </div>
    );
};

Card.propTypes = {
    card: PropTypes.object,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    values: PropTypes.object,
    setFieldValue: PropTypes.func,
    index: PropTypes.number,
    error: PropTypes.object,
    validateField: PropTypes.func,
    updateErrors: PropTypes.func,
    is_dark_mode: PropTypes.bool,
};

export default Card;
