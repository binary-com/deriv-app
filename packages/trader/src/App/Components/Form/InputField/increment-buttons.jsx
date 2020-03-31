import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon } from '@deriv/components';

const IncrementButtons = ({ decrementValue, id, incrementValue, max_is_disabled, min_is_disabled }) => (
    <React.Fragment>
        <Button
            id={`${id}_add`}
            className={'input-wrapper__button input-wrapper__button--increment'}
            is_disabled={max_is_disabled}
            onClick={incrementValue}
            tabIndex='-1'
        >
            <Icon
                icon='IcAdd'
                className={'input-wrapper__icon input-wrapper__icon--plus'}
                color={max_is_disabled ? 'disabled' : undefined}
            />
        </Button>
        <Button
            id={`${id}_sub`}
            className={'input-wrapper__button input-wrapper__button--decrement'}
            is_disabled={min_is_disabled}
            onClick={decrementValue}
            tabIndex='-1'
        >
            <Icon
                icon='IcMinus'
                className={'input-wrapper__icon input-wrapper__icon--minus'}
                color={min_is_disabled ? 'disabled' : undefined}
            />
        </Button>
    </React.Fragment>
);

IncrementButtons.propTypes = {
    decrementValue: PropTypes.func,
    id: PropTypes.string,
    incrementValue: PropTypes.func,
    max_is_disabled: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    min_is_disabled: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

export default IncrementButtons;
