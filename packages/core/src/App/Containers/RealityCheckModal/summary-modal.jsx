import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Formik, Form } from 'formik';
import {
    Modal,
    DesktopWrapper,
    MobileWrapper,
    Loading,
    ThemedScrollbars,
    Money,
    Button,
    FormSubmitButton,
    FadeWrapper,
    PageOverlay,
} from '@deriv/components';
import { isDesktop, isEmptyObject, getDiffDuration, toGMTFormat } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { WS } from 'Services';

const Row = ({ label, value }) => (
    <div className='reality-check__row'>
        <span>{label}</span>
        <strong>{value}</strong>
    </div>
);

const RowInfo = ({ label, value }) => (
    <p className='reality-check__text'>
        <span>{label}</span>
        <br />
        <strong>{value}</strong>
    </p>
);

const SummaryModal = ({
    disableApp,
    enableApp,
    handleIntervalInputMobileFocus,
    IntervalField,
    is_onscreen_keyboard_active,
    is_visible,
    logout,
    onSubmit,
    openPositions,
    openStatement,
    reality_check_duration,
    server_time,
    setCurrentFocus,
    validateForm,
}) => {
    const interval_input_ref = React.useRef();

    const [computed_values, setComputedValues] = React.useState({});

    React.useEffect(() => {
        const before_req = performance.now();

        WS.realityCheck().then(response => {
            const reality_check = response.reality_check;
            if (!reality_check) return;

            const after_req = performance.now();
            const time_taken = after_req - before_req;
            const current_time = server_time.add(time_taken, 'milliseconds');

            setComputedValues({
                current_date_time_gmt: toGMTFormat(current_time),
                duration_string: getSessionDuration(reality_check.start_time, current_time.unix()),
                profit: reality_check.sell_amount - reality_check.buy_amount,
                start_date_time_gmt: toGMTFormat(+reality_check.start_time * 1000),
                turnover: reality_check.sell_amount + reality_check.buy_amount,
                ...reality_check,
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getSessionDuration = (start_time, current_time) => {
        const session_duration = getDiffDuration(start_time, current_time);

        return localize('{{num_day}} days {{num_hour}} hours {{num_minute}} minutes', {
            num_day: session_duration.get('days'),
            num_hour: session_duration.get('hours'),
            num_minute: session_duration.get('minutes'),
        });
    };

    if (isEmptyObject(computed_values)) {
        return <Loading />;
    }

    const title = isDesktop() ? (
        <Localize
            i18n_default_text='Your trading statistics since: {{date_time}}'
            values={{ date_time: computed_values.start_date_time_gmt }}
        />
    ) : (
        <React.Fragment>
            <Localize i18n_default_text='Your trading statistics since:' />
            <br />
            {computed_values.start_date_time_gmt}
        </React.Fragment>
    );

    const TradeSummary = () => (
        <div className='reality-check__column'>
            <div className='reality-check__column-content'>
                <Row label={localize('Login ID')} value={computed_values.loginid} />
                <Row label={localize('Currency')} value={computed_values.currency} />
                <Row
                    label={localize('Turnover')}
                    value={<Money amount={computed_values.turnover} currency={computed_values.currency} />}
                />
                <Row
                    label={localize('Profit/loss')}
                    value={
                        <React.Fragment>
                            {!!computed_values.profit && (computed_values.profit < 0 ? '-' : '+')}
                            <Money amount={computed_values.profit} currency={computed_values.currency} />
                        </React.Fragment>
                    }
                />
                <Row label={localize('Contract bought')} value={computed_values.buy_count} />
                <Row label={localize('Contract sold')} value={computed_values.sell_count} />
                <Row
                    label={localize('Potential profit')}
                    value={<Money amount={computed_values.potential_profit} currency={computed_values.currency} />}
                />
            </div>
            <Button
                type='button'
                secondary
                large
                onClick={computed_values.open_contract_count ? openPositions : openStatement}
                className='reality-check__button reality-check__button--full-width'
            >
                {localize('Go to Reports')}
            </Button>
        </div>
    );

    const SessionSummary = () => (
        <React.Fragment>
            <RowInfo label={localize('Session duration:')} value={computed_values.duration_string} />
            <RowInfo label={localize('Login time:')} value={computed_values.start_date_time_gmt} />
            <RowInfo label={localize('Current time:')} value={computed_values.current_date_time_gmt} />
            {isDesktop() && <div className='reality-check__separator' />}
            <p
                className={classNames('reality-check__text', 'reality-check__text--center', {
                    'reality-check__text__summary': !isDesktop(),
                })}
            >
                <Localize i18n_default_text='Your preferred time interval between each report:' />
            </p>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='reality-check'
                    enableApp={enableApp}
                    is_open={is_visible}
                    disableApp={disableApp}
                    portalId='modal_root_absolute'
                    has_close_icon={false}
                    title={title}
                    width={'720px'}
                >
                    <Formik
                        initialValues={{
                            interval: reality_check_duration,
                        }}
                        validate={validateForm}
                        onSubmit={onSubmit}
                    >
                        {({ errors, isSubmitting, isValid, values, touched, handleChange, handleBlur }) => (
                            <Form noValidate>
                                <Modal.Body>
                                    <ThemedScrollbars height='75vh' autoHide={false}>
                                        <div className='reality-check__column-wrapper'>
                                            <TradeSummary />
                                            <div className='reality-check__column'>
                                                <SessionSummary />
                                                <IntervalField
                                                    values={values}
                                                    touched={touched}
                                                    errors={errors}
                                                    handleChange={handleChange}
                                                    handleBlur={handleBlur}
                                                />
                                            </div>
                                        </div>
                                    </ThemedScrollbars>
                                </Modal.Body>
                                <Modal.Footer has_separator>
                                    <FormSubmitButton
                                        className='reality-check__submit'
                                        has_cancel
                                        cancel_label={localize('Log out')}
                                        is_disabled={!values.interval || !isValid || isSubmitting}
                                        label={localize('Continue trading')}
                                        onCancel={logout}
                                    />
                                </Modal.Footer>
                            </Form>
                        )}
                    </Formik>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <FadeWrapper is_visible={is_visible} className='reality-check' keyname='reality-check'>
                    <ThemedScrollbars>
                        <div
                            className={classNames('reality-check__wrapper', 'reality-check__summary', {
                                'reality-check__summary--with-mobile-keyboard': is_onscreen_keyboard_active,
                            })}
                        >
                            <PageOverlay header={title} is_open={is_visible}>
                                <Formik
                                    initialValues={{
                                        interval: reality_check_duration,
                                    }}
                                    validate={validateForm}
                                    onSubmit={onSubmit}
                                >
                                    {({ errors, isSubmitting, isValid, values, touched, handleChange, handleBlur }) => (
                                        <Form
                                            className={classNames('reality-check__summary__form', {
                                                'reality-check__summary__form--with-mobile-keyboard': is_onscreen_keyboard_active,
                                            })}
                                            noValidate
                                        >
                                            <div className='reality-check__column-wrapper'>
                                                <TradeSummary />
                                                <div className='reality-check__separator' />
                                                <div className='reality-check__column reality-check__column--settings'>
                                                    <SessionSummary />
                                                    <IntervalField
                                                        ref={interval_input_ref}
                                                        is_summary={true}
                                                        values={values}
                                                        touched={touched}
                                                        errors={errors}
                                                        handleChange={handleChange}
                                                        handleBlur={e => {
                                                            setCurrentFocus(null);
                                                            handleBlur(e);
                                                        }}
                                                        onFocus={e => {
                                                            setCurrentFocus(e.target.name);
                                                            handleIntervalInputMobileFocus(interval_input_ref.current);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <hr
                                                className={classNames('reality-check__summary__form-separator', {
                                                    'reality-check__summary__form-separator--with-mobile-keyboard': is_onscreen_keyboard_active,
                                                })}
                                            />
                                            <FormSubmitButton
                                                className={classNames('reality-check__summary__submit', {
                                                    'reality-check__summary__submit--with-mobile-keyboard': is_onscreen_keyboard_active,
                                                })}
                                                has_cancel
                                                cancel_label={localize('Log out')}
                                                is_disabled={!values.interval || !isValid || isSubmitting}
                                                label={localize('Continue trading')}
                                                onCancel={logout}
                                            />
                                        </Form>
                                    )}
                                </Formik>
                            </PageOverlay>
                        </div>
                    </ThemedScrollbars>
                </FadeWrapper>
            </MobileWrapper>
        </React.Fragment>
    );
};

SummaryModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    handleIntervalInputMobileFocus: PropTypes.func,
    IntervalField: PropTypes.object,
    is_onscreen_keyboard_active: PropTypes.bool,
    is_visible: PropTypes.bool,
    logout: PropTypes.func,
    onSubmit: PropTypes.func,
    openPositions: PropTypes.func,
    openStatement: PropTypes.func,
    reality_check_duration: PropTypes.number,
    server_time: PropTypes.object,
    setCurrentFocus: PropTypes.func,
    validateForm: PropTypes.func,
};

export default SummaryModal;
