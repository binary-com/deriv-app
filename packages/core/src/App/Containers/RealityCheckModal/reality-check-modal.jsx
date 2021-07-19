import { Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Input } from '@deriv/components';
import { getDecimalPlaces, routes, validNumber } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import BriefModal from './brief-modal.jsx';
import SummaryModal from './summary-modal.jsx';
import SpendingLimitModal from './spending-limit-modal.jsx';

const SpendingLimitIntervalField = ({ currency, disabled, touched, errors, handleChange, handleBlur }) => (
    <div className='reality-check__fieldset reality-check__fieldset--spending-limit'>
        <Field name='max_30day_turnover'>
            {({ field }) => (
                <Input
                    {...field}
                    name='max_30day_turnover'
                    data-lpignore='true'
                    type='text'
                    label={localize('My spending limit ({{currency}})', { currency })}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                    required
                    error={(field.value || touched.max_30day_turnover) && errors.max_30day_turnover}
                    autoComplete='off'
                    maxLength='13'
                />
            )}
        </Field>
    </div>
);

const TradingViewIntervalField = ({ values, touched, errors, handleChange, handleBlur }) => (
    <div className='reality-check__fieldset reality-check__fieldset--interval'>
        <Field name='interval'>
            {({ field }) => (
                <Input
                    {...field}
                    name='interval'
                    data-lpignore='true'
                    type='number'
                    label={localize('After … minutes of trading')} // this is regards the Figma design
                    value={values.interval}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    hint={localize('Min: 10 minutes     Max: 60 minutes')} // this is regards the Figma design
                    required
                    error={touched.interval && errors.interval}
                    autoComplete='off'
                    maxLength='2'
                    max='60'
                    onKeyPress={e => {
                        if (e.target.value?.length >= 2) {
                            e.preventDefault();
                        }
                    }}
                />
            )}
        </Field>
    </div>
);

const RealityCheckModal = ({
    disableApp,
    enableApp,
    currency,
    logoutClient,
    is_visible,
    reality_check_dismissed,
    reality_check_duration,
    server_time,
    setRealityCheckDuration,
    setReportsTabIndex,
    setVisibilityRealityCheck,
    setSpendingLimitTradingStatistics,
    self_exclusion,
}) => {
    const history = useHistory();

    const openPositions = () => {
        // index of open positions in reports' side menu is 0
        setReportsTabIndex(0);
        history.push(routes.positions);
        setVisibilityRealityCheck(0);
    };

    const openStatement = () => {
        // index of statement in reports' side menu is 2
        setReportsTabIndex(2);
        history.push(routes.statement);
        setVisibilityRealityCheck(0);
    };

    const spendingLimitValidateForm = values => {
        const errors = {};
        const min_number = 1;

        if (values.spending_limit === '1' && !values.max_30day_turnover) {
            errors.max_30day_turnover = localize('This field is required.');
        } else if (values.spending_limit === '1') {
            const { is_ok, message } = validNumber(values.max_30day_turnover, {
                type: 'float',
                decimals: getDecimalPlaces(currency),
                min: min_number,
            });
            if (!is_ok) errors.max_30day_turnover = message;
        }

        return errors;
    };
    const validateForm = values => {
        const errors = {};

        if (!values.interval) {
            errors.interval = localize('This field is required.');
        } else if (values.interval) {
            const { is_ok, message } = validNumber(values.interval, { type: 'number', min: 10, max: 60 });
            if (!is_ok) errors.interval = message;
        }

        return errors;
    };

    const onSubmit = (values, form_props) => {
        setVisibilityRealityCheck(0);
        setRealityCheckDuration(values.interval);
        form_props?.setSubmitting(false);
    };

    const is_enable_max30day_turnover = !self_exclusion.max_30day_turnover;

    // if user previously did not set max_30day_turnover,
    // we force him/her here to fill this field
    if (is_enable_max30day_turnover) {
        return (
            <SpendingLimitModal
                disableApp={disableApp}
                enableApp={enableApp}
                is_visible={is_enable_max30day_turnover}
                openStatement={openStatement}
                validateForm={spendingLimitValidateForm}
                onSubmit={setSpendingLimitTradingStatistics}
                InputField={SpendingLimitIntervalField}
                currency={currency}
            />
        );
    }

    // if user has seen the brief once and set
    // the initial reality check interval
    // we can show the summary from now on
    if (!reality_check_dismissed && reality_check_duration) {
        return (
            <SummaryModal
                disableApp={disableApp}
                enableApp={enableApp}
                is_visible={is_visible}
                openPositions={openPositions}
                openStatement={openStatement}
                validateForm={validateForm}
                onSubmit={onSubmit}
                logout={logoutClient}
                reality_check_duration={reality_check_duration || 0}
                server_time={server_time}
                IntervalField={TradingViewIntervalField}
            />
        );
    }

    // we are going to show the BriefModal in a case that user
    // did not fill it previously, but if user filled it previously
    // we just show SummaryModal
    if (!is_enable_max30day_turnover) {
        return (
            <BriefModal
                disableApp={disableApp}
                enableApp={enableApp}
                is_visible={is_visible}
                openStatement={openStatement}
                validateForm={validateForm}
                onSubmit={onSubmit}
                logout={logoutClient}
                IntervalField={TradingViewIntervalField}
            />
        );
    }

    return null;
};

RealityCheckModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    history: PropTypes.object,
    logoutClient: PropTypes.func,
    is_visible: PropTypes.bool,
    reality_check_dismissed: PropTypes.bool,
    reality_check_duration: PropTypes.number,
    setRealityCheckDuration: PropTypes.func,
    setReportsTabIndex: PropTypes.func,
    setVisibilityRealityCheck: PropTypes.func,
};

export default connect(({ client, common, ui }) => ({
    currency: client.currency,
    logoutClient: client.logout,
    is_visible: client.is_reality_check_visible,
    reality_check_dismissed: client.reality_check_dismissed,
    reality_check_duration: client.reality_check_duration,
    setRealityCheckDuration: client.setRealityCheckDuration,
    setVisibilityRealityCheck: client.setVisibilityRealityCheck,
    server_time: common.server_time,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    setReportsTabIndex: ui.setReportsTabIndex,
    setSpendingLimitTradingStatistics: client.setSpendingLimitTradingStatistics,
    self_exclusion: client.self_exclusion,
}))(RealityCheckModal);
