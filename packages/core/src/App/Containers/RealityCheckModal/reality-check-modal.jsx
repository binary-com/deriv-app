import classNames from 'classnames';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Input } from '@deriv/components';
import { routes, validNumber } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import BriefModal from './brief-modal.jsx';
import SummaryModal from './summary-modal.jsx';
// eslint-disable-next-line react/display-name
const IntervalField = React.forwardRef(
    ({ is_summary, values, touched, errors, handleChange, handleBlur, onFocus }, ref) => (
        <div
            className={classNames('reality-check__fieldset', {
                'reality-check__fieldset__summary': is_summary,
            })}
        >
            <Field name='interval'>
                {({ field }) => (
                    <Input
                        {...(ref ? { ref } : {})}
                        {...field}
                        data-lpignore='true'
                        type='text'
                        label={localize('Time interval')}
                        value={values.interval}
                        onChange={handleChange}
                        {...(typeof onFocus === 'function' ? { onFocus } : {})}
                        onBlur={handleBlur}
                        hint={localize('Interval should be between 10-60 minutes')}
                        required
                        error={touched.interval && errors.interval}
                        autoComplete='off'
                        maxLength='2'
                    />
                )}
            </Field>
        </div>
    )
);

const RealityCheckModal = ({
    disableApp,
    enableApp,
    logoutClient,
    is_onscreen_keyboard_active,
    is_visible,
    reality_check_dismissed,
    reality_check_duration,
    server_time,
    setCurrentFocus,
    setRealityCheckDuration,
    setReportsTabIndex,
    setVisibilityRealityCheck,
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

    const validateForm = values => {
        const error = {};

        if (!values.interval) {
            error.interval = localize('This field is required.');
        } else {
            const { is_ok, message } = validNumber(values.interval, { type: 'number', min: 10, max: 60 });
            if (!is_ok) error.interval = message;
        }

        return error;
    };

    const onSubmit = values => {
        setVisibilityRealityCheck(0);
        setRealityCheckDuration(values.interval);
    };

    const handleIntervalInputMobileFocus = ref => {
        setTimeout(() => {
            ref.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    };

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
                reality_check_duration={reality_check_duration}
                server_time={server_time}
                IntervalField={IntervalField}
                is_onscreen_keyboard_active={is_onscreen_keyboard_active}
                setCurrentFocus={setCurrentFocus}
                handleIntervalInputMobileFocus={handleIntervalInputMobileFocus}
            />
        );
    }

    return (
        <BriefModal
            disableApp={disableApp}
            enableApp={enableApp}
            is_visible={is_visible}
            openStatement={openStatement}
            validateForm={validateForm}
            onSubmit={onSubmit}
            logout={logoutClient}
            IntervalField={IntervalField}
            is_onscreen_keyboard_active={is_onscreen_keyboard_active}
            setCurrentFocus={setCurrentFocus}
            handleIntervalInputMobileFocus={handleIntervalInputMobileFocus}
        />
    );
};

RealityCheckModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    history: PropTypes.object,
    logoutClient: PropTypes.func,
    is_onscreen_keyboard_active: PropTypes.bool,
    is_visible: PropTypes.bool,
    reality_check_dismissed: PropTypes.bool,
    reality_check_duration: PropTypes.number,
    setCurrentFocus: PropTypes.func,
    setRealityCheckDuration: PropTypes.func,
    setReportsTabIndex: PropTypes.func,
    setVisibilityRealityCheck: PropTypes.func,
};

export default connect(({ client, common, ui }) => ({
    logoutClient: client.logout,
    is_visible: client.is_reality_check_visible,
    reality_check_dismissed: client.reality_check_dismissed,
    reality_check_duration: client.reality_check_duration,
    setRealityCheckDuration: client.setRealityCheckDuration,
    setVisibilityRealityCheck: client.setVisibilityRealityCheck,
    server_time: common.server_time,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    is_onscreen_keyboard_active: ui.is_onscreen_keyboard_active,
    setCurrentFocus: ui.setCurrentFocus,
    setReportsTabIndex: ui.setReportsTabIndex,
}))(RealityCheckModal);
