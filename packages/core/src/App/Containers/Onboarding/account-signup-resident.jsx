import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import ResidenceForm from '../SetResidenceModal/set-residence-form.jsx';

const AccountSignupResident = ({
    errors,
    touched,
    setFieldTouched,
    setFieldValue,
    country,
    residence_list,
    values,
    onResidenceSelection,
}) => {
    return (
        <ResidenceForm
            class_prefix='account-signup'
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
            residence_list={residence_list}
            default_value={country}
        >
            <div className='account-signup__residence-selection--footer'>
                <Button
                    className={classNames('account-signup__btn', {
                        'account-signup__btn--disabled': !values.residence || errors.residence,
                    })}
                    type='button'
                    is_disabled={!values.residence || !!errors.residence}
                    onClick={() => {
                        onResidenceSelection(values.residence);
                    }}
                    primary
                    large
                    text={localize('Next')}
                />
            </div>
        </ResidenceForm>
    );
};

AccountSignupResident.propTypes = {
    errors: PropTypes.object,
    touched: PropTypes.object,
    setFieldTouched: PropTypes.func,
    setFieldValue: PropTypes.func,
    country: PropTypes.string,
    residence_list: PropTypes.array,
    values: PropTypes.object,
    onResidenceSelection: PropTypes.func,
};

export default AccountSignupResident;
