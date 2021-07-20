import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';
import Text from '../text';

const FormSubmitButton = ({
    cancel_label,
    className,
    has_cancel,
    form_error,
    cancel_icon,
    is_center,
    is_disabled,
    is_absolute,
    is_loading,
    label,
    onCancel,
    ...props
}) => {
    return (
        <div
            className={classNames('dc-form-submit-button', className, {
                'dc-form-submit-button--absolute': is_absolute,
                'dc-form-submit-button--center': !!is_center,
                'dc-form-submit-button--relative': !is_absolute,
            })}
        >
            {!!form_error && (
                <Text
                    as='p'
                    size='xs'
                    styles={{ color: 'var(--brand-red-coral)' }}
                    className='dc-form-submit-button--error'
                >
                    {form_error}
                </Text>
            )}
            {has_cancel && (
                <Button
                    has_effect
                    onClick={onCancel}
                    text={cancel_label}
                    type='button'
                    secondary
                    large
                    icon={cancel_icon}
                />
            )}
            <Button
                has_effect
                is_disabled={is_disabled}
                type='submit'
                text={label}
                is_loading={is_loading}
                large
                primary
                {...props}
            />
        </div>
    );
};

FormSubmitButton.defaultProps = {
    className: undefined,
    has_cancel: false,
    form_error: '',
    is_disabled: false,
    is_center: false,
    is_absolute: false,
};

FormSubmitButton.propTypes = {
    className: PropTypes.string,
    has_cancel: PropTypes.bool,
    is_absolute: PropTypes.bool,
    is_center: PropTypes.bool,
    is_disabled: PropTypes.bool,
    label: PropTypes.string,
};

export default FormSubmitButton;
