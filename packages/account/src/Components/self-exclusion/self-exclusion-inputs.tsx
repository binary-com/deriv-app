import React from 'react';
import classNames from 'classnames';
import { Button, DatePicker, Input, Text } from '@deriv/components';
import { epochToMoment, toMoment, isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import {
    Field,
    FormikComputedProps,
    FormikErrors,
    FormikHandlers,
    FormikHelpers,
    FormikState,
    FormikValues,
    useFormikContext,
} from 'formik';
import SelfExclusionContext from './self-exclusion-context';
import SelfExclusionFooter from './self-exclusion-footer';

type TSectionTitle = {
    title: React.ReactElement;
    has_border_line?: boolean;
};

type TFormikContext = {
    errors: FormikErrors<FormikValues>;
    handleBlur: FormikHandlers['handleBlur'];
    handleChange: FormikHandlers['handleChange'];
    setFieldValue?: FormikHelpers<FormikValues>['setFieldValue'];
    dirty: FormikComputedProps<FormikValues>['dirty'];
    isSubmitting: FormikState<FormikValues>['isSubmitting'];
    isValid: FormikComputedProps<FormikValues>['isValid'];
    values: FormikValues;
};

const SectionTitle = ({ title, has_border_line }: TSectionTitle) => {
    return (
        <Text
            as='h2'
            weight='bold'
            size={isMobile() ? 'xxs' : 'xs'}
            className={classNames('da-self-exclusion__header', {
                'da-self-exclusion__header-border': has_border_line,
            })}
        >
            {title}
        </Text>
    );
};

const StakeLossAndLimitsInputs = () => {
    const { currency_display, getMaxLength } = React.useContext(SelfExclusionContext);
    const { errors, handleBlur, handleChange, values }: TFormikContext = useFormikContext<TFormikContext>();
    return (
        <React.Fragment>
            <SectionTitle title={<Localize i18n_default_text='Your stake and loss limits' />} />
            <div className='da-self-exclusion__item-wrapper'>
                <div className='da-self-exclusion__item'>
                    <h3 className='da-self-exclusion__item-title'>
                        <Localize i18n_default_text='24 hours' />
                    </h3>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. total stake' />
                    </Text>
                    <Field name='max_turnover' data-testid='dt_max_turnover'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_turnover ?? ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength?.('max_turnover')}
                                required
                                error={errors.max_turnover}
                            />
                        )}
                    </Field>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. total loss' />
                    </Text>
                    <Field name='max_losses'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_losses}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength?.('max_losses')}
                                required
                                error={errors.max_losses}
                            />
                        )}
                    </Field>
                </div>
                <div className='da-self-exclusion__item'>
                    <h3 className='da-self-exclusion__item-title'>
                        <Localize i18n_default_text='7 days' />
                    </h3>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. total stake' />
                    </Text>
                    <Field name='max_7day_turnover'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_7day_turnover}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength?.('max_7day_turnover')}
                                required
                                error={errors.max_7day_turnover}
                            />
                        )}
                    </Field>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. total loss' />
                    </Text>
                    <Field name='max_7day_losses'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_7day_losses}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength?.('max_7day_losses')}
                                required
                                error={errors.max_7day_losses}
                            />
                        )}
                    </Field>
                </div>
                <div className='da-self-exclusion__item'>
                    <h3 className='da-self-exclusion__item-title'>
                        <Localize i18n_default_text='30 days' />
                    </h3>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. total stake' />
                    </Text>
                    <Field name='max_30day_turnover'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                // value={values.max_30day_turnover}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength?.('max_30day_turnover')}
                                required
                                error={errors.max_30day_turnover}
                            />
                        )}
                    </Field>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. total loss' />
                    </Text>
                    <Field name='max_30day_losses'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_30day_losses}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength?.('max_30day_losses')}
                                required
                                error={errors.max_30day_losses}
                            />
                        )}
                    </Field>
                </div>
            </div>
        </React.Fragment>
    );
};

const SessionAndLoginLimitsInputs = () => {
    const { is_tablet, session_duration_digits } = React.useContext(SelfExclusionContext);
    const { errors, handleBlur, handleChange, setFieldValue, values }: TFormikContext =
        useFormikContext<TFormikContext>();

    return (
        <React.Fragment>
            <SectionTitle title={<Localize i18n_default_text='Your session and login limits' />} />
            <div className='da-self-exclusion__item-wrapper'>
                <div className='da-self-exclusion__item'>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='You will be automatically logged out from each session after this time limit.' />
                    </Text>
                    <Field name='session_duration_limit'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={localize('Minutes')}
                                value={values.session_duration_limit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={session_duration_digits}
                                required
                                error={errors.session_duration_limit}
                            />
                        )}
                    </Field>
                </div>
                <div className='da-self-exclusion__item'>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='You will not be able to log in to your account until this date (up to 6 weeks from today).' />
                    </Text>
                    <Field name='timeout_until'>
                        {({ field }: FormikValues) => (
                            <DatePicker
                                min_date={toMoment().add(1, 'days').format('YYYY-MM-DD')}
                                max_date={toMoment().add(6, 'weeks').format('YYYY-MM-DD')}
                                {...field}
                                className='da-self-exclusion__input'
                                label={localize('Date')}
                                value={values.timeout_until && epochToMoment(values.timeout_until)}
                                onChange={({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                    setFieldValue(
                                        'timeout_until',
                                        target?.value ? toMoment(target.value).unix() : '',
                                        true
                                    )
                                }
                                required
                                readOnly
                                error={errors.timeout_until}
                            />
                        )}
                    </Field>
                </div>
                <div className='da-self-exclusion__item'>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Your account will be excluded from the website until this date (at least 6 months, up to 5 years).' />
                    </Text>
                    <Field name='exclude_until'>
                        {({ field }: FormikValues) => (
                            <DatePicker
                                min_date={toMoment().add(6, 'months').add(1, 'days').format('YYYY-MM-DD')}
                                max_date={toMoment().add(5, 'years').format('YYYY-MM-DD')}
                                {...field}
                                alignment={is_tablet ? 'bottom' : 'left'}
                                className='da-self-exclusion__input'
                                label={localize('Date')}
                                value={values.exclude_until}
                                onChange={({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                    setFieldValue(
                                        'exclude_until',
                                        target?.value ? toMoment(target.value).format('YYYY-MM-DD') : '',
                                        true
                                    )
                                }
                                required
                                autoComplete='off'
                                readOnly
                                error={errors.exclude_until}
                            />
                        )}
                    </Field>
                </div>
            </div>
        </React.Fragment>
    );
};

const MaximumAccountBalanceAndOpenPositionsInputs = () => {
    const { currency_display, getMaxLength } = React.useContext(SelfExclusionContext);
    const { errors, handleBlur, handleChange, values }: TFormikContext = useFormikContext<TFormikContext>();

    return (
        <React.Fragment>
            <SectionTitle title={<Localize i18n_default_text='Your maximum account balance and open positions' />} />
            <div className='da-self-exclusion__item-wrapper'>
                <div className='da-self-exclusion__item'>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Once your account balance reaches this amount, you will not be able to deposit funds into your account.' />
                    </Text>
                    <Field name='max_balance'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_balance}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength?.('max_balance')}
                                required
                                error={errors.max_balance}
                            />
                        )}
                    </Field>
                </div>
                <div className='da-self-exclusion__item'>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Maximum open positions' />
                    </Text>
                    <Field name='max_open_bets'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={localize('No. of open position(s)')}
                                value={values.max_open_bets}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength?.('max_open_bets')}
                                required
                                error={errors.max_open_bets}
                            />
                        )}
                    </Field>
                </div>
            </div>
        </React.Fragment>
    );
};

const MaximumDepositLimitInputs = () => {
    const { currency, is_mf, getMaxLength } = React.useContext(SelfExclusionContext);
    const { errors, handleBlur, handleChange, values }: TFormikContext = useFormikContext<TFormikContext>();

    if (!is_mf) {
        return null;
    }

    return (
        <React.Fragment>
            <SectionTitle title={<Localize i18n_default_text='Your maximum deposit limit' />} />
            <div className='da-self-exclusion__item-wrapper'>
                <div className='da-self-exclusion__item'>
                    <h3 className='da-self-exclusion__item-title'>
                        <Localize i18n_default_text='24 hours' />
                    </h3>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. deposit limit' />
                    </Text>
                    <Field name='max_deposit'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency}
                                value={values.max_deposit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength?.('max_deposit')}
                                required
                                error={errors.max_deposit}
                            />
                        )}
                    </Field>
                </div>
                <div className='da-self-exclusion__item'>
                    <h3 className='da-self-exclusion__item-title'>
                        <Localize i18n_default_text='7 days' />
                    </h3>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. deposit limit' />
                    </Text>
                    <Field name='max_7day_deposit'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency}
                                value={values.max_7day_deposit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength?.('max_7day_deposit')}
                                required
                                error={errors.max_7day_deposit}
                            />
                        )}
                    </Field>
                </div>
                <div className='da-self-exclusion__item'>
                    <h3 className='da-self-exclusion__item-title'>
                        <Localize i18n_default_text='30 days' />
                    </h3>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. deposit limit' />
                    </Text>
                    <Field name='max_30day_deposit'>
                        {({ field }: FormikValues) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency}
                                value={values.max_30day_deposit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength?.('max_30day_deposit')}
                                required
                                error={errors.max_30day_deposit}
                            />
                        )}
                    </Field>
                </div>
            </div>
        </React.Fragment>
    );
};

const SelfExclusionInputs = () => {
    const { footer_ref, goToConfirm, is_app_settings } = React.useContext(SelfExclusionContext);
    const { dirty, isSubmitting, isValid, values }: TFormikContext = useFormikContext<TFormikContext>();
    const versions: Record<string, { condition: boolean; components: Array<React.FunctionComponent> }> = {
        // App-specific settings, i.e. user accessing app settings from App Store or
        // through DWallet App header.
        app_settings: {
            condition: !!is_app_settings,
            components: [StakeLossAndLimitsInputs, MaximumAccountBalanceAndOpenPositionsInputs],
        },
        // Legacy Deriv.app, i.e. non-DWallet user accessing app.deriv.com/account/self-exclusion.
        deriv_app: {
            condition: !is_app_settings,
            components: [
                StakeLossAndLimitsInputs,
                SessionAndLoginLimitsInputs,
                MaximumAccountBalanceAndOpenPositionsInputs,
                MaximumDepositLimitInputs,
            ],
        },
    };

    return (
        <React.Fragment>
            {Object.keys(versions).map((version_name: string) => {
                const version = versions[version_name];
                if (!version.condition) return null;
                return (
                    <React.Fragment key={version_name}>
                        {version.components.map((Component, component_idx) => (
                            <Component key={`${version_name}component${component_idx}`} />
                        ))}
                    </React.Fragment>
                );
            })}
            {footer_ref ? (
                <SelfExclusionFooter />
            ) : (
                <div className='da-self-exclusion__button-wrapper'>
                    <Button
                        disabled={!dirty || !isValid || isSubmitting}
                        primary
                        className='da-self-exclusion__button'
                        large
                        onClick={() => goToConfirm?.(values)}
                        type='button'
                    >
                        <Localize i18n_default_text='Next' />
                    </Button>
                </div>
            )}
        </React.Fragment>
    );
};

export default SelfExclusionInputs;
