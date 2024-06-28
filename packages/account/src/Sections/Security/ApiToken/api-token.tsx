import React from 'react';
import clsx from 'clsx';
import { Formik, Form, Field, FormikErrors, FieldProps, FormikHelpers } from 'formik';
import { ApiToken as TApitoken, APITokenResponse as TAPITokenResponse } from '@deriv/api-types';
import { Timeline, Input, Button, ThemedScrollbars, Loading } from '@deriv/components';
import { getPropertyValue, WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { TToken } from '../../../Types';
import { ApiTokenContext, ApiTokenArticle, ApiTokenCard, ApiTokenTable } from '../../../Components/api-token';
import InlineNoteWithIcon from '../../../Components/inline-note-with-icon';
import LoadErrorMessage from '../../../Components/load-error-message';
import { API_TOKEN_CARD_DETAILS, TOKEN_LIMITS, TOKEN_NAME_REGEX } from '../../../Constants/api-token-card-details';
import './api-token.scss';

type AptTokenState = {
    api_tokens: NonNullable<TToken[]>;
    is_loading: boolean;
    is_success: boolean;
    error_message: string;
    show_delete: boolean;
    is_delete_loading: boolean;
    is_delete_success: boolean;
};

type TApiTokenForm = {
    token_name: string;
    read: boolean;
    trade: boolean;
    payments: boolean;
    trading_information: boolean;
    admin: boolean;
};

const ApiToken = observer(() => {
    const { client, ui } = useStore();
    const { is_switching } = client;
    const { is_desktop, is_mobile } = ui;
    const prev_is_switching = React.useRef(is_switching);

    const [state, setState] = React.useReducer(
        (prev_state: Partial<AptTokenState>, value: Partial<AptTokenState>) => ({
            ...prev_state,
            ...value,
        }),
        {
            api_tokens: [],
            is_loading: true,
            is_success: false,
            error_message: '',
            show_delete: false,
            is_delete_loading: false,
            is_delete_success: false,
        }
    );

    const handle_submit_timeout_ref = React.useRef<NodeJS.Timeout | undefined>();
    const delete_token_timeout_ref = React.useRef<NodeJS.Timeout | undefined>();

    React.useEffect(() => {
        getApiTokens();

        return () => {
            clearTimeout(handle_submit_timeout_ref.current);
            clearTimeout(delete_token_timeout_ref.current);
        };
    }, []);

    React.useEffect(() => {
        if (prev_is_switching.current !== is_switching) {
            prev_is_switching.current = is_switching;
            getApiTokens();
        }
    }, [is_switching]);

    const initial_form: TApiTokenForm = {
        token_name: '',
        read: false,
        trade: false,
        payments: false,
        trading_information: false,
        admin: false,
    };

    const validateFields = (values: TApiTokenForm) => {
        const errors: FormikErrors<TApiTokenForm> = {};
        const token_name = values?.token_name?.trim();

        if (!token_name) {
            errors.token_name = localize('Please enter a token name.');
        } else if (!TOKEN_NAME_REGEX.test(token_name)) {
            errors.token_name = localize('Only letters, numbers, and underscores are allowed.');
        } else if (token_name.length < TOKEN_LIMITS.MIN) {
            errors.token_name = localize(
                'Length of token name must be between {{MIN_TOKEN}} and {{MAX_TOKEN}} characters.',
                {
                    MIN_TOKEN: TOKEN_LIMITS.MIN,
                    MAX_TOKEN: TOKEN_LIMITS.MAX,
                }
            );
        } else if (token_name.length > TOKEN_LIMITS.MAX) {
            errors.token_name = localize('Maximum {{MAX_TOKEN}} characters.', { MAX_TOKEN: TOKEN_LIMITS.MAX });
        }

        return errors;
    };

    const selectedTokenScope = (values: TApiTokenForm) =>
        Object.keys(values).filter(
            item => item !== 'token_name' && Boolean(values[item as keyof TApiTokenForm])
        ) as NonNullable<NonNullable<TApitoken['tokens']>[0]['scopes']>;

    const handleSubmit = async (
        values: TApiTokenForm,
        { setSubmitting, setFieldError, resetForm }: FormikHelpers<TApiTokenForm>
    ) => {
        const token_response = await WS.apiToken({
            api_token: 1,
            new_token: values.token_name,
            new_token_scopes: selectedTokenScope(values),
        });
        if (token_response.error) {
            setFieldError('token_name', token_response.error.message);
        } else {
            setState({
                is_success: true,
                api_tokens: getPropertyValue(token_response, ['api_token', 'tokens']),
            });
            handle_submit_timeout_ref.current = setTimeout(() => {
                setState({ is_success: false });
            }, 500);
        }
        resetForm();
        setSubmitting(false);
    };

    const populateTokenResponse = (response: TAPITokenResponse) => {
        if (response.error) {
            setState({
                is_loading: false,
                error_message: getPropertyValue(response, ['error', 'message']),
            });
        } else {
            setState({
                is_loading: false,
                api_tokens: getPropertyValue(response, ['api_token', 'tokens']),
            });
        }
    };

    const getApiTokens = async () => {
        setState({ is_loading: true });
        const token_response = await WS.authorized.apiToken({ api_token: 1 });
        populateTokenResponse(token_response);
    };

    const deleteToken = async (token: string) => {
        setState({ is_delete_loading: true });

        const token_response = await WS.authorized.apiToken({ api_token: 1, delete_token: token });

        populateTokenResponse(token_response);

        setState({ is_delete_loading: false, is_delete_success: true });

        delete_token_timeout_ref.current = setTimeout(() => {
            setState({ is_delete_success: false });
        }, 500);
    };

    const { api_tokens, is_loading, is_success, error_message } = state;

    if (is_loading || is_switching) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    if (error_message) {
        return <LoadErrorMessage error_message={error_message} />;
    }

    if (typeof api_tokens === 'undefined') {
        return null;
    }
    const context_value = {
        api_tokens,
        deleteToken,
    };

    return (
        <ApiTokenContext.Provider value={context_value}>
            <section className='da-api-token'>
                <div className='da-api-token__wrapper'>
                    <ThemedScrollbars className='da-api-token__scrollbars' is_bypassed={is_mobile}>
                        {is_mobile && <ApiTokenArticle />}
                        <Formik initialValues={initial_form} onSubmit={handleSubmit} validate={validateFields}>
                            {({
                                values,
                                errors,
                                isValid,
                                dirty,
                                touched,
                                handleChange,
                                handleBlur,
                                isSubmitting,
                                setFieldTouched,
                            }) => (
                                <Form noValidate>
                                    <Timeline className='da-api-token__timeline' line_height='xxxl'>
                                        <Timeline.Item
                                            item_title={
                                                <Localize i18n_default_text='Select scopes based on the access you need.' />
                                            }
                                        >
                                            <div className='da-api-token__checkbox-wrapper'>
                                                {API_TOKEN_CARD_DETAILS.map(card => (
                                                    <ApiTokenCard
                                                        key={card.name}
                                                        name={card.name}
                                                        display_name={card.display_name}
                                                        description={card.description}
                                                    >
                                                        {card.name === 'admin' && (
                                                            <InlineNoteWithIcon
                                                                icon='IcAlertWarning'
                                                                message={
                                                                    <Localize i18n_default_text='To avoid loss of funds, do not share tokens with the Admin scope with unauthorised parties.' />
                                                                }
                                                                title={<Localize i18n_default_text='Note:' />}
                                                            />
                                                        )}
                                                    </ApiTokenCard>
                                                ))}
                                            </div>
                                        </Timeline.Item>
                                        <Timeline.Item
                                            item_title={
                                                <Localize i18n_default_text="Name your token and click on 'Create' to generate your token." />
                                            }
                                        >
                                            <div className='da-api-token__input-group'>
                                                <Field name='token_name'>
                                                    {({ field }: FieldProps<string | boolean>) => (
                                                        <Input
                                                            {...field}
                                                            data-lpignore='true'
                                                            type='text'
                                                            className='da-api-token__input dc-input__input-group'
                                                            label={localize('Token name')}
                                                            value={values.token_name}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                setFieldTouched('token_name', true);
                                                                handleChange(e);
                                                            }}
                                                            onBlur={handleBlur}
                                                            hint={
                                                                <Localize i18n_default_text='Length of token name must be between 2 and 32 characters.' />
                                                            }
                                                            required
                                                            error={
                                                                touched.token_name && errors.token_name
                                                                    ? errors.token_name
                                                                    : undefined
                                                            }
                                                        />
                                                    )}
                                                </Field>
                                                <Button
                                                    className={clsx('dc-btn__button-group', 'da-api-token__button', {
                                                        'da-api-token__button--success': is_success,
                                                    })}
                                                    type='submit'
                                                    is_disabled={
                                                        !dirty ||
                                                        isSubmitting ||
                                                        !isValid ||
                                                        !selectedTokenScope(values).length
                                                    }
                                                    has_effect
                                                    is_loading={isSubmitting}
                                                    is_submit_success={is_success}
                                                    primary
                                                    large
                                                >
                                                    <Localize i18n_default_text='Create' />
                                                </Button>
                                            </div>
                                        </Timeline.Item>
                                        <Timeline.Item
                                            item_title={
                                                <Localize i18n_default_text='Copy and paste the token into the app.' />
                                            }
                                        >
                                            <ApiTokenTable />
                                        </Timeline.Item>
                                    </Timeline>
                                </Form>
                            )}
                        </Formik>
                    </ThemedScrollbars>
                    {is_desktop && <ApiTokenArticle />}
                </div>
            </section>
        </ApiTokenContext.Provider>
    );
});

export default ApiToken;
