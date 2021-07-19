import PropTypes from 'prop-types';
import React from 'react';
import { Formik, Form } from 'formik';
import {
    Modal,
    DesktopWrapper,
    MobileWrapper,
    Div100vhContainer,
    Loading,
    ThemedScrollbars,
    Money,
    Button,
    FormSubmitButton,
    Text,
} from '@deriv/components';
import { isDesktop, isEmptyObject, getDiffDuration, toGMTFormat, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { WS } from 'Services';

const Row = ({ label, value }) => (
    <div className='reality-check__row'>
        <span>{label}</span>
        <strong>{value}</strong>
    </div>
);

const RowInfo = ({ label, value }) => (
    <Text as='p' size='xs' className='reality-check__text'>
        <span>{label}</span>
        <strong>{value}</strong>
    </Text>
);

const SummaryModal = ({
    disableApp,
    enableApp,
    IntervalField,
    is_visible,
    logout,
    onSubmit,
    openPositions,
    openStatement,
    reality_check_duration,
    server_time,
    validateForm,
}) => {
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

    return (
        <Modal
            className='reality-check reality-check__summary'
            enableApp={enableApp}
            is_open={is_visible}
            disableApp={disableApp}
            portalId='modal_root_absolute'
            has_close_icon={false}
            title={
                <React.Fragment>
                    <DesktopWrapper>
                        {!reality_check_duration ? (
                            <Localize i18n_default_text='Your trading statistics' />
                        ) : (
                            <Localize
                                i18n_default_text='Your trading statistics since: {{date_time}}'
                                values={{ date_time: computed_values.start_date_time_gmt }}
                            />
                        )}
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Localize i18n_default_text='Your trading statistics since:' />
                        <br />
                        {computed_values.start_date_time_gmt}
                    </MobileWrapper>
                </React.Fragment>
            }
            width={isMobile() ? '304px' : '792px'}
        >
            <Formik
                initialValues={{
                    interval: reality_check_duration || '',
                }}
                validate={validateForm}
                onSubmit={onSubmit}
            >
                {({ errors, isSubmitting, isValid, values, touched, handleChange, handleBlur }) => (
                    <Form noValidate>
                        <Modal.Body>
                            <ThemedScrollbars height='75vh' autoHide={false} is_bypassed={isMobile()}>
                                <Div100vhContainer
                                    className='reality-check__column-wrapper'
                                    is_disabled={isDesktop()}
                                    max_autoheight_offset='204px'
                                >
                                    <div className='reality-check__column'>
                                        <div className='reality-check__column-content'>
                                            <Row label={localize('Login ID')} value={computed_values.loginid} />
                                            <Row label={localize('Currency')} value={computed_values.currency} />
                                            <Row
                                                label={localize('Turnover')}
                                                value={
                                                    <Money
                                                        amount={computed_values.turnover}
                                                        currency={computed_values.currency}
                                                    />
                                                }
                                            />
                                            <Row
                                                label={localize('Profit / Loss')}
                                                value={
                                                    <React.Fragment>
                                                        {!!computed_values.profit &&
                                                            (computed_values.profit < 0 ? '-' : '+')}
                                                        <Money
                                                            amount={computed_values.profit}
                                                            currency={computed_values.currency}
                                                        />
                                                    </React.Fragment>
                                                }
                                            />
                                            <Row
                                                label={localize('Contract bought')}
                                                value={computed_values.buy_count}
                                            />
                                            <Row label={localize('Contract sold')} value={computed_values.sell_count} />
                                            <Row
                                                label={localize('Potential profit')}
                                                value={
                                                    <Money
                                                        amount={computed_values.potential_profit}
                                                        currency={computed_values.currency}
                                                    />
                                                }
                                            />
                                        </div>
                                        <Button
                                            type='button'
                                            secondary
                                            large
                                            onClick={
                                                computed_values.open_contract_count ? openPositions : openStatement
                                            }
                                            className='reality-check__button reality-check__button--full-width'
                                        >
                                            {localize('Go to Reports')}
                                        </Button>
                                    </div>

                                    <MobileWrapper>
                                        <div className='reality-check__separator' />
                                    </MobileWrapper>

                                    <div className='reality-check__column'>
                                        {!!reality_check_duration && (
                                            <RowInfo
                                                label={localize('Session duration:')}
                                                value={computed_values.duration_string}
                                            />
                                        )}
                                        <RowInfo
                                            label={localize('Login time:')}
                                            value={computed_values.start_date_time_gmt}
                                        />
                                        <RowInfo
                                            label={localize('Current time:')}
                                            value={computed_values.current_date_time_gmt}
                                        />

                                        <DesktopWrapper>
                                            <div className='reality-check__separator' />
                                        </DesktopWrapper>

                                        <Text
                                            as='p'
                                            size='xs'
                                            line_height='m'
                                            align='left'
                                            className='reality-check__text'
                                        >
                                            <Localize i18n_default_text='Your preferred time interval between each report:' />
                                        </Text>

                                        <IntervalField
                                            values={values}
                                            touched={touched}
                                            errors={errors}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                        />
                                    </div>
                                </Div100vhContainer>
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
    );
};

SummaryModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    IntervalField: PropTypes.func,
    is_visible: PropTypes.bool,
    logout: PropTypes.func,
    onSubmit: PropTypes.func,
    openPositions: PropTypes.func,
    openStatement: PropTypes.func,
    reality_check_duration: PropTypes.number,
    server_time: PropTypes.object,
    validateForm: PropTypes.func,
};

export default SummaryModal;
