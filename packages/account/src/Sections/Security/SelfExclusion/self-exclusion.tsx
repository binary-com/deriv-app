import React from 'react';
import { Loading } from '@deriv/components';
import {
    getBrandWebsiteName,
    getPropertyValue,
    toMoment,
    getDecimalPlaces,
    getCurrencyDisplayCode,
    validNumber,
    useIsMounted,
    WS,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import DemoMessage from 'Components/demo-message';
import 'Components/self-exclusion/self-exclusion.scss';
import LoadErrorMessage from 'Components/load-error-message';
import SelfExclusionArticleContent from 'Components/self-exclusion/self-exclusion-article-content';
import SelfExclusionContext from 'Components/self-exclusion/self-exclusion-context';
import SelfExclusionModal from 'Components/self-exclusion/self-exclusion-modal';
import SelfExclusionWrapper from 'Components/self-exclusion/self-exclusion-wrapper';
import SelfExclusionForm from 'Components/self-exclusion/self-exclusion-form';
import { FormikHelpers, FormikValues } from 'formik';
import { observer, useStore } from '@deriv/stores';

type TSelfExclusion = {
    is_app_settings?: boolean;
    overlay_ref: HTMLDivElement;
    setIsOverlayShown?: React.Dispatch<React.SetStateAction<boolean>>;
};
type TExclusionData = {
    max_deposit: string;
    max_turnover: string;
    max_losses: string;
    max_7day_deposit: string;
    max_7day_turnover: string;
    max_7day_losses: string;
    max_30day_deposit: string;
    max_30day_turnover: string;
    max_30day_losses: string;
    session_duration_limit: string;
    timeout_until: string;
    exclude_until: string;
    max_balance: string;
    max_open_bets: string;
};

type TExclusionLimits = Partial<{
    get_limits: {
        open_positions: number;
        account_balance: number;
    };
}>;

type TCustomState = Partial<{
    changed_attributes: string[];
    error_message: string;
    is_confirm_page: boolean;
    is_loading: boolean;
    is_success: boolean;
    self_exclusions: Record<string, string>;
    show_article: boolean;
    show_confirm: boolean;
    submit_error_message: string;
}>;

type TResponse = {
    error?: {
        message: string;
    };
};

const SelfExclusion = observer(({ is_app_settings, overlay_ref, setIsOverlayShown }: TSelfExclusion) => {
    const { client, ui } = useStore();
    const { currency, is_virtual, is_switching, standpoint, is_eu, logout, landing_company_shortcode } = client;
    const { is_tablet } = ui;
    const is_wrapper_bypassed = false;
    const is_mf = landing_company_shortcode === 'maltainvest';
    const is_cr = standpoint.svg;
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
        exclude_until: localize('Excluded from {{brand_website_name}} until', {
            brand_website_name: getBrandWebsiteName(),
        }),
        max_balance: localize('Max. account balance'),
        max_open_bets: localize('Max. open positions'),
    };

    const prev_is_switching = React.useRef<boolean | null>(null);
    const exclusion_limits = React.useRef<TExclusionLimits>({});
    const exclusion_data = React.useRef<TExclusionData>({
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

    const initial_state: TCustomState = Object.freeze({
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
    const [state, setState] = React.useReducer<(prev_state: TCustomState, value: TCustomState) => TCustomState>(
        (prev_state, value) => {
            return { ...prev_state, ...value };
        },
        initial_state
    );

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
        setIsOverlayShown?.(!!state?.show_article);
    }, [state.show_article, setIsOverlayShown]);

    const resetState = () => setState(initial_state);
    const validateFields = (values: FormikValues) => {
        const errors: Record<string, string | null | undefined> = {};

        // Regex
        const max_number = exclusion_fields_settings.max_number;
        const max_open_positions = exclusion_fields_settings.max_open_positions;
        const six_weeks = exclusion_fields_settings.six_weeks; // in minutes

        const more_than_zero_message = localize('Please input number greater than 0');

        const getSmallestMinValue = (decimals: number) =>
            decimals === 0
                ? 1
                : `0.${Array(decimals - 1)
                      .fill(0)
                      .join('')}1`;

        const custom_validation: Array<keyof TExclusionData> = [
            'max_balance',
            'max_open_bets',
            'session_duration_limit',
        ];

        const only_currency: Array<keyof TExclusionData> = [
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
                const result = validNumber(values[item], {
                    type: 'float',
                    decimals: getDecimalPlaces(currency),
                    min: is_eu ? Number(getSmallestMinValue(getDecimalPlaces(currency))) : 0,
                    max: Number(is_eu && state.self_exclusions?.[item]) || max_number,
                });
                const { is_ok, message } = typeof result === 'object' ? result : { is_ok: result, message: null };
                if (!is_ok) errors[item] = message;
            }
            if (state.self_exclusions?.[item] && !values[item] && !is_cr) {
                errors[item] = more_than_zero_message;
            }
        });

        if (values.session_duration_limit) {
            const result = validNumber(values.session_duration_limit, {
                type: 'integer',
                min: Number(is_eu),
                max: is_eu ? state.self_exclusions?.session_duration_limit : six_weeks,
            });
            const { is_ok, message } = typeof result === 'object' ? result : { is_ok: result, message: null };
            if (!is_ok) errors.session_duration_limit = message;
            if (values.session_duration_limit > six_weeks) {
                errors.session_duration_limit = localize(
                    'Enter a value in minutes, up to 60480 minutes (equivalent to 6 weeks).'
                );
            }
        }

        if (values.max_open_bets) {
            const result = validNumber(values.max_open_bets, {
                type: 'integer',
                min: Number(is_eu),
                max: (is_eu && exclusion_limits.current.get_limits?.open_positions) || max_open_positions,
            });
            const { is_ok, message } = typeof result === 'object' ? result : { is_ok: result, message: null };
            if (!is_ok) errors.max_open_bets = message;
        }

        if (values.max_balance) {
            const result = validNumber(values.max_balance, {
                type: 'float',
                decimals: getDecimalPlaces(currency),
                min: is_eu ? Number(getSmallestMinValue(getDecimalPlaces(currency))) : 0,
                max: (is_eu && exclusion_limits.current.get_limits?.account_balance) || max_number,
            });
            const { is_ok, message } = typeof result === 'object' ? result : { is_ok: result, message: null };
            if (!is_ok) errors.max_balance = message;
        }

        custom_validation.forEach(item => {
            if (state.self_exclusions?.[item] && !values[item] && !is_cr) {
                errors[item] = more_than_zero_message;
            }
        });
        return errors;
    };
    const handleSubmit = async (values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
        const need_logout_exclusions = ['exclude_until', 'timeout_until'];
        const string_exclusions = ['exclude_until'];
        const has_need_logout = state.changed_attributes?.some(attr => need_logout_exclusions.includes(attr));

        const makeRequest = (): Promise<TResponse> =>
            new Promise(resolve => {
                const request: { [key: string]: number } = {
                    set_self_exclusion: 1,
                };

                state.changed_attributes?.forEach(attr => {
                    request[attr] = string_exclusions.includes(attr) ? values[attr] : +values[attr];
                });

                WS.authorized.setSelfExclusion(request).then((response: TResponse) => resolve(response));
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

    const goToConfirm = (values: FormikValues) => {
        const changed_attributes = Object.keys(values).filter(key => values[key] !== state.self_exclusions?.[key]);
        setState({ changed_attributes, is_confirm_page: true });
    };

    const backToReview = () => setState({ show_confirm: false });

    const backFromConfirmLimits = () => setState({ is_confirm_page: false, submit_error_message: '' });

    const objectValuesToString = (object: FormikValues) => {
        Object.keys(object || {}).forEach(item => {
            object[item] = `${object[item]}`;
        });

        return object;
    };

    const toggleArticle = () => setState({ show_article: !state.show_article });

    const populateExclusionResponse = (response: FormikValues) => {
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
                setState({
                    is_loading: false,
                    self_exclusions: { ...exclusion_data.current, ...response_to_string },
                });
            }
        }
    };

    const getSelfExclusion = () => {
        setState({ is_loading: true });

        WS.authorized.getSelfExclusion({ get_self_exclusion: 1 }).then((self_exclusion_response: FormikValues) => {
            populateExclusionResponse(self_exclusion_response);
        });
    };

    const getLimits = () => {
        setState({ is_loading: true });

        WS.authorized.getLimits({ get_limits: 1 }).then((limits: FormikValues) => {
            exclusion_limits.current = limits;
        });
    };

    const getMaxLength = (field: string) => {
        const decimals_length = getDecimalPlaces(currency);
        const isIntegerField = (value: string) => /session_duration_limit|max_open_bets/.test(value);
        const getLength = (value: string) =>
            value.toString().length + (isIntegerField(field) || decimals_length === 0 ? 0 : decimals_length + 1); // add 1 to allow typing dot

        if (/max_open_bets/.test(field) && exclusion_limits.current.get_limits?.open_positions && !is_cr)
            return getLength(String(exclusion_limits.current.get_limits.open_positions));

        if (/max_balance/.test(field) && exclusion_limits.current.get_limits?.account_balance && !is_cr)
            return getLength(String(exclusion_limits.current.get_limits.account_balance));

        if (!state.self_exclusions?.[field] || is_cr) {
            if (/max_open_bets/.test(field)) return 9; // TODO: remove when the error is fixed on BE
            return getLength(String(exclusion_fields_settings.max_number));
        }

        return getLength(state.self_exclusions?.[field]);
    };

    if (is_virtual) {
        return <DemoMessage />;
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
        is_app_settings,
        backFromConfirmLimits,
        backToReview,
        currency,
        currency_display,
        exclusion_fields_settings,
        exclusion_limits,
        exclusion_texts,
        getMaxLength,
        goToConfirm,
        handleSubmit,
        is_eu,
        is_mf,
        is_tablet,
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
                {!is_app_settings && <SelfExclusionModal />}
                <SelfExclusionForm />
            </SelfExclusionWrapper>
            {overlay_ref && state.show_article && <SelfExclusionArticleContent is_in_overlay />}
        </SelfExclusionContext.Provider>
    );
});

export default SelfExclusion;
