import PropTypes from 'prop-types';
import * as React from 'react';
import { Loading } from '@deriv/components';
import {
    getPropertyValue,
    toMoment,
    getDecimalPlaces,
    getCurrencyDisplayCode,
    validNumber,
    useIsMounted,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import DemoMessage from 'Components/demo-message';
import LoadErrorMessage from 'Components/load-error-message';
import SelfExclusionArticleContent from './self-exclusion-article-content.jsx';
import SelfExclusionContext from './self-exclusion-context';
import SelfExclusionModal from './self-exclusion-modal.jsx';
import SelfExclusionWrapper from './self-exclusion-wrapper.jsx';
import SelfExclusionForm from './self-exclusion-form.jsx';

const NO_SPENDING_LIMIT_TURNOVER = 99999999999999;

const SelfExclusion = ({
    currency,
    footer_ref,
    is_app_settings,
    is_cr,
    is_dashboard,
    is_eu,
    is_mf,
    is_mlt,
    is_mx,
    is_switching,
    is_tablet,
    is_uk,
    is_virtual,
    is_wrapper_bypassed,
    logout,
    overlay_ref,
    setIsOverlayShown,
    ws,
}) => {
    const exclusion_fields_settings = Object.freeze({
        max_number: 9999999999999,
        max_open_positions: 999999999,
        six_weeks: 60480, // in minutes
    });

    const exclusion_texts = {
        max_deposit: localize('Max. deposit limit per day'),
        max_turnover: localize('Max. total stake per day'),
        max_losses: localize('Max. total loss per day'),
        max_7day_deposit: localize('Max. deposit limit over 7 days'),
        max_7day_turnover: localize('Max. total stake over 7 days'),
        max_7day_losses: localize('Max. total loss over 7 days'),
        max_30day_deposit: localize('Max. deposit limit over 30 days'),
        max_30day_turnover: localize('Max. total stake over 30 days'),
        max_30day_losses: localize('Max. total loss over 30 days'),
        session_duration_limit: localize('Time limit per session'),
        timeout_until: localize('Time out until'),
        exclude_until: localize('Excluded from Deriv.com until'),
        max_balance: localize('Max. account balance'),
        max_open_bets: localize('Max. open positions'),
    };

    const prev_is_switching = React.useRef(null);
    const exclusion_limits = React.useRef({});
    const exclusion_data = React.useRef({
        max_deposit: '',
        max_turnover: '',
        max_losses: '',
        max_7day_deposit: '',
        max_7day_turnover: '',
        max_7day_losses: '',
        max_30day_deposit: '',
        max_30day_turnover: '',
        max_30day_losses: '',
        session_duration_limit: '',
        timeout_until: '',
        exclude_until: '',
        max_balance: '',
        max_open_bets: '',
    });

    const initial_state = Object.freeze({
        changed_attributes: [],
        error_message: '',
        is_confirm_page: false,
        is_loading: true,
        is_success: false,
        self_exclusions: exclusion_data.current,
        show_article: false,
        show_confirm: false,
        submit_error_message: '',
    });

    const isMounted = useIsMounted();
    const [state, setState] = React.useReducer((prev_state, value) => ({ ...prev_state, ...value }), initial_state);

    React.useEffect(() => {
        if (is_virtual) {
            setState({ is_loading: false });
        } else {
            getLimits();
            getSelfExclusion();
        }

        return () => {
            setState({ changed_attributes: [] });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (prev_is_switching.current !== is_switching) {
            prev_is_switching.current = is_switching;

            resetState();
            getLimits();
            getSelfExclusion();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    React.useEffect(() => {
        if (typeof setIsOverlayShown === 'function') {
            setIsOverlayShown(state.show_article);
        }
    }, [state.show_article, setIsOverlayShown]);

    const resetState = () => setState(initial_state);

    const validateFields = values => {
        const errors = {};

        // Regex
        const max_number = exclusion_fields_settings.max_number;
        const max_open_positions = exclusion_fields_settings.max_open_positions;
        const six_weeks = exclusion_fields_settings.six_weeks; // in minutes

        const more_than_zero_message = localize('Please input number greater than 0');

        const getSmallestMinValue = decimals =>
            decimals === 0
                ? 1
                : `0.${Array(decimals - 1)
                      .fill(0)
                      .join('')}1`;

        const custom_validation = ['max_balance', 'max_open_bets', 'session_duration_limit'];

        const only_currency = [
            'max_deposit',
            'max_7day_deposit',
            'max_30day_deposit',
            'max_turnover',
            'max_losses',
            'max_7day_turnover',
            'max_7day_losses',
            'max_30day_turnover',
            'max_30day_losses',
        ];

        if (values.timeout_until) {
            if (values.timeout_until <= toMoment().unix()) {
                errors.timeout_until = localize('Timeout time must be greater than current time.');
            } else if (values.timeout_until > toMoment().add(6, 'week').unix()) {
                errors.timeout_until = localize('Timeout time cannot be more than 6 weeks.');
            }
        }

        if (values.exclude_until) {
            if (toMoment(values.exclude_until).unix() < toMoment().unix()) {
                errors.exclude_until = localize('Exclude time must be after today.');
            } else if (toMoment(values.exclude_until).unix() < toMoment().add(6, 'month').unix()) {
                errors.exclude_until = localize('Exclude time cannot be less than 6 months.');
            } else if (toMoment(values.exclude_until).unix() > toMoment().add(5, 'year').unix()) {
                errors.exclude_until = localize('Exclude time cannot be for more than five years.');
            }
        }

        only_currency.forEach(item => {
            if (values[item]) {
                const { is_ok, message } = validNumber(values[item], {
                    type: 'float',
                    decimals: getDecimalPlaces(currency),
                    min: is_eu ? getSmallestMinValue(getDecimalPlaces(currency)) : null,
                    max: (is_eu && state.self_exclusions[item]) || max_number,
                });
                if (!is_ok) errors[item] = message;
            }
            if (state.self_exclusions[item] && !values[item] && !is_cr) {
                errors[item] = more_than_zero_message;
            }
        });

        if (values.session_duration_limit) {
            const { is_ok, message } = validNumber(values.session_duration_limit, {
                type: 'integer',
                min: is_eu ? 1 : null,
                max: is_eu ? state.self_exclusions.session_duration_limit : six_weeks,
            });
            if (!is_ok) errors.session_duration_limit = message;
            if (values.session_duration_limit > six_weeks) {
                errors.session_duration_limit = localize(
                    'Enter a value in minutes, up to 60480 minutes (equivalent to 6 weeks).'
                );
            }
        }

        if (values.max_open_bets) {
            const { is_ok, message } = validNumber(values.max_open_bets, {
                type: 'integer',
                min: is_eu ? 1 : null,
                max: (is_eu && exclusion_limits.current.get_limits.open_positions) || max_open_positions,
            });
            if (!is_ok) errors.max_open_bets = message;
        }

        if (values.max_balance) {
            const { is_ok, message } = validNumber(values.max_balance, {
                type: 'float',
                decimals: getDecimalPlaces(currency),
                min: is_eu ? getSmallestMinValue(getDecimalPlaces(currency)) : null,
                max: (is_eu && exclusion_limits.current.get_limits.account_balance) || max_number,
            });
            if (!is_ok) errors.max_balance = message;
        }

        custom_validation.forEach(item => {
            if (state.self_exclusions[item] && !values[item] && !is_cr) {
                errors[item] = more_than_zero_message;
            }
        });
        return errors;
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const need_logout_exclusions = ['exclude_until', 'timeout_until'];
        const string_exclusions = ['exclude_until'];
        const has_need_logout = state.changed_attributes.some(attr => need_logout_exclusions.includes(attr));

        const makeRequest = () =>
            new Promise(resolve => {
                const request = {
                    set_self_exclusion: 1,
                };

                state.changed_attributes.forEach(attr => {
                    request[attr] = string_exclusions.includes(attr) ? values[attr] : +values[attr];
                });

                ws.authorized.setSelfExclusion(request).then(response => resolve(response));
            });

        if (has_need_logout) {
            if (state.show_confirm) {
                const response = await makeRequest();
                if (response.error && isMounted()) {
                    setState({
                        show_confirm: false,
                        submit_error_message: response.error.message,
                    });
                } else {
                    logout();
                }
            } else {
                setState({ show_confirm: true });
            }
        } else {
            const response = await makeRequest();

            if (response.error && isMounted()) {
                setState({ submit_error_message: response.error.message });
            } else {
                setSubmitting(false);

                if (isMounted()) {
                    setState({ show_confirm: false, is_loading: true, is_confirm_page: false });
                }

                getLimits();
                getSelfExclusion();
            }
        }
    };

    const goToConfirm = values => {
        const changed_attributes = Object.keys(values).filter(key => values[key] !== state.self_exclusions[key]);
        setState({ changed_attributes, is_confirm_page: true });
    };

    const backToReview = () => setState({ show_confirm: false });

    const backFromConfirmLimits = () => setState({ is_confirm_page: false, submit_error_message: '' });

    const objectValuesToString = object => {
        Object.keys(object).forEach(item => {
            object[item] = `${object[item]}`;
        });

        return object;
    };

    const toggleArticle = () => setState({ show_article: !state.show_article });

    const populateExclusionResponse = response => {
        if (response.error && isMounted()) {
            setState({
                is_loading: false,
                error_message: getPropertyValue(response, ['error', 'message']),
            });
        } else {
            const response_to_string = objectValuesToString(getPropertyValue(response, ['get_self_exclusion']));

            if (response_to_string.timeout_until) {
                response_to_string.timeout_until = +response_to_string.timeout_until;
            }

            if (isMounted()) {
                const self_exclusion_value = { ...exclusion_data.current, ...response_to_string };
                const max_30day_turnover = Number(self_exclusion_value.max_30day_turnover);
                if (max_30day_turnover === NO_SPENDING_LIMIT_TURNOVER) {
                    self_exclusion_value.max_30day_turnover = '';
                }
                setState({
                    is_loading: false,
                    self_exclusions: self_exclusion_value,
                });
            }
        }
    };

    const getSelfExclusion = () => {
        setState({ is_loading: true });

        ws.authorized.getSelfExclusion({ get_self_exclusion: 1 }).then(self_exclusion_response => {
            populateExclusionResponse(self_exclusion_response);
        });
    };

    const getLimits = () => {
        setState({ is_loading: true });

        ws.authorized.getLimits({ get_limits: 1 }).then(limits => {
            exclusion_limits.current = limits;
        });
    };

    const getMaxLength = field => {
        const decimals_length = getDecimalPlaces(currency);
        const isIntegerField = value => /session_duration_limit|max_open_bets/.test(value);
        const getLength = value =>
            value.toString().length + (isIntegerField(field) || decimals_length === 0 ? 0 : decimals_length + 1); // add 1 to allow typing dot

        if (/max_open_bets/.test(field) && exclusion_limits.current.get_limits?.open_positions && !is_cr)
            return getLength(exclusion_limits.current.get_limits.open_positions);

        if (/max_balance/.test(field) && exclusion_limits.current.get_limits?.account_balance && !is_cr)
            return getLength(exclusion_limits.current.get_limits.account_balance);

        if (!state.self_exclusions[field] || is_cr) {
            if (/max_open_bets/.test(field)) return 9; // TODO: remove when the error is fixed on BE
            return getLength(exclusion_fields_settings.max_number);
        }

        return getLength(state.self_exclusions[field]);
    };

    if (is_virtual) {
        return <DemoMessage has_demo_icon={is_dashboard} has_button={is_dashboard} />;
    }

    if (state.is_loading || is_switching) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    if (state.error_message) {
        return <LoadErrorMessage error_message={state.error_message} />;
    }

    const { six_weeks } = exclusion_fields_settings;
    const currency_display = getCurrencyDisplayCode(currency);
    const session_duration_digits = six_weeks.toString().length;

    const context_value = {
        backFromConfirmLimits,
        backToReview,
        currency,
        currency_display,
        exclusion_fields_settings,
        exclusion_limits,
        exclusion_texts,
        footer_ref,
        getMaxLength,
        goToConfirm,
        handleSubmit,
        is_app_settings,
        is_eu,
        is_mf,
        is_mlt,
        is_mx,
        is_tablet,
        is_uk,
        is_wrapper_bypassed,
        objectValuesToString,
        overlay_ref,
        session_duration_digits,
        state,
        toggleArticle,
        validateFields,
    };

    return (
        <SelfExclusionContext.Provider value={context_value}>
            <SelfExclusionWrapper>
                {/* Only show the modal in non-"<AppSettings>" views, others will 
                    use the overlay provided by <AppSettings> */}
                {!is_app_settings && <SelfExclusionModal />}
                <SelfExclusionForm />
            </SelfExclusionWrapper>
            {overlay_ref && state.show_article && <SelfExclusionArticleContent is_in_overlay />}
        </SelfExclusionContext.Provider>
    );
};

SelfExclusion.propTypes = {
    currency: PropTypes.string.isRequired,
    footer_ref: PropTypes.shape({ current: PropTypes.any }),
    is_app_settings: PropTypes.bool,
    is_cr: PropTypes.bool.isRequired,
    is_eu: PropTypes.bool.isRequired,
    is_mf: PropTypes.bool.isRequired,
    is_mlt: PropTypes.bool.isRequired,
    is_mx: PropTypes.bool.isRequired,
    is_switching: PropTypes.bool.isRequired,
    is_tablet: PropTypes.bool.isRequired,
    is_uk: PropTypes.bool.isRequired,
    is_virtual: PropTypes.bool.isRequired,
    is_wrapper_bypassed: PropTypes.bool,
    logout: PropTypes.func.isRequired,
    overlay_ref: PropTypes.shape({ current: PropTypes.any }),
    setIsOverlayShown: PropTypes.func,
    ws: PropTypes.any,
};

export default SelfExclusion;
