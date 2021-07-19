import * as React from 'react';
import classNames from 'classnames';
import { Button, DatePicker, Icon, Input, Text } from '@deriv/components';
import { epochToMoment, toMoment, PlatformContext, isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { Field, useFormikContext } from 'formik';
import SelfExclusionContext from './self-exclusion-context';
import SelfExclusionFooter from './self-exclusion-footer.jsx';

const SectionTitle = ({ title, has_border_line }) => {
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
    const { errors, handleBlur, handleChange, values } = useFormikContext();
    return (
        <React.Fragment>
            <SectionTitle title={<Localize i18n_default_text='Your spending and loss limits' />} />
            <div className='da-self-exclusion__item-wrapper'>
                <div className='da-self-exclusion__item'>
                    <h3 className='da-self-exclusion__item-title'>
                        <Localize i18n_default_text='24 hours' />
                    </h3>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. total spending' />
                    </Text>
                    <Field name='max_turnover'>
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_turnover ?? ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength('max_turnover')}
                                required
                                error={errors.max_turnover}
                            />
                        )}
                    </Field>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. total loss' />
                    </Text>
                    <Field name='max_losses'>
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_losses}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength('max_losses')}
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
                        <Localize i18n_default_text='Max. total spending' />
                    </Text>
                    <Field name='max_7day_turnover'>
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_7day_turnover}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength('max_7day_turnover')}
                                required
                                error={errors.max_7day_turnover}
                            />
                        )}
                    </Field>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. total loss' />
                    </Text>
                    <Field name='max_7day_losses'>
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_7day_losses}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength('max_7day_losses')}
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
                        <Localize i18n_default_text='Max. total spending' />
                    </Text>
                    <Field name='max_30day_turnover'>
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                // value={values.max_30day_turnover}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength('max_30day_turnover')}
                                required
                                error={errors.max_30day_turnover}
                            />
                        )}
                    </Field>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. total loss' />
                    </Text>
                    <Field name='max_30day_losses'>
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_30day_losses}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength('max_30day_losses')}
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
    const { is_mlt, is_mx, is_tablet, session_duration_digits } = React.useContext(SelfExclusionContext);
    const { errors, handleBlur, handleChange, setFieldValue, values } = useFormikContext();
    const { is_dashboard } = React.useContext(PlatformContext);

    return (
        <React.Fragment>
            <SectionTitle
                title={<Localize i18n_default_text='Your session and login limits' />}
                has_border_line={is_dashboard}
            />
            <div className='da-self-exclusion__item-wrapper'>
                <div className='da-self-exclusion__item'>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='You will be automatically logged out from each session after this time limit.' />
                    </Text>
                    <Field name='session_duration_limit'>
                        {({ field }) => (
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
                        {({ field }) => (
                            <DatePicker
                                min_date={toMoment().add(1, 'days').format('YYYY-MM-DD')}
                                max_date={toMoment().add(6, 'weeks').format('YYYY-MM-DD')}
                                {...field}
                                should_show_today={false}
                                className='da-self-exclusion__input'
                                label={localize('Date')}
                                value={values.timeout_until && epochToMoment(values.timeout_until)}
                                onChange={({ target }) =>
                                    setFieldValue('timeout_until', target?.value ? target.value.unix() : '', true)
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
                        {({ field }) => (
                            <DatePicker
                                min_date={toMoment().add(6, 'months').add(1, 'days').format('YYYY-MM-DD')}
                                max_date={toMoment().add(5, 'years').format('YYYY-MM-DD')}
                                {...field}
                                alignment={is_tablet ? 'bottom' : 'left'}
                                className='da-self-exclusion__input'
                                label={localize('Date')}
                                value={values.exclude_until}
                                onChange={({ target }) =>
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
            {values.exclude_until && (is_mlt || is_mx) && (
                <div className='da-self-exclusion__warning'>
                    <Icon icon='IcAlertWarning' className='da-self-exclusion__warning-icon' />
                    <div className='da-self-exclusion__warning-textbox'>
                        <Text as='p' size='xxxs'>
                            <Localize i18n_default_text='Self-exclusion on the website only applies to your Deriv.com account and does not include other companies or websites.' />
                        </Text>
                        <Text as='p' size='xxxs'>
                            {is_mlt ? (
                                <Localize
                                    i18n_default_text='If you are a UK resident, to self-exclude from all online gambling companies licensed in Great Britain, go to <0>www.gamstop.co.uk</0>.'
                                    components={[
                                        <a
                                            key={0}
                                            className='da-self-exclusion__warning-link'
                                            rel='noopener noreferrer'
                                            target='_blank'
                                            href='https://www.gamstop.co.uk'
                                        />,
                                    ]}
                                />
                            ) : (
                                <Localize
                                    i18n_default_text='To self-exclude from all online gambling companies licensed in Great Britain, go to <0>www.gamstop.co.uk</0>.'
                                    components={[
                                        <a
                                            key={0}
                                            className='da-self-exclusion__warning-link'
                                            rel='noopener noreferrer'
                                            target='_blank'
                                            href='https://www.gamstop.co.uk'
                                        />,
                                    ]}
                                />
                            )}
                        </Text>
                        <Text as='p' size='xxxs'>
                            <Localize
                                i18n_default_text='For more information and assistance to counselling and support services, please visit <0>begambleaware.org</0>.'
                                components={[
                                    <a
                                        key={0}
                                        className='da-self-exclusion__warning-link'
                                        rel='noopener noreferrer'
                                        target='_blank'
                                        href='http://begambleaware.org'
                                    />,
                                ]}
                            />
                        </Text>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

const MaximumAccountBalanceAndOpenPositionsInputs = () => {
    const { currency_display, getMaxLength } = React.useContext(SelfExclusionContext);
    const { errors, handleBlur, handleChange, values } = useFormikContext();
    const { is_dashboard } = React.useContext(PlatformContext);

    return (
        <React.Fragment>
            <SectionTitle
                title={<Localize i18n_default_text='Your maximum account balance and open positions' />}
                has_border_line={is_dashboard}
            />
            <div className='da-self-exclusion__item-wrapper'>
                <div className='da-self-exclusion__item'>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Once your account balance reaches this amount, you will not be able to deposit funds into your account.' />
                    </Text>
                    <Field name='max_balance'>
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency_display}
                                value={values.max_balance}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength('max_balance')}
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
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={localize('USD')}
                                value={values.max_open_bets}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength('max_open_bets')}
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
    const { currency, is_mlt, is_mf, is_mx, getMaxLength } = React.useContext(SelfExclusionContext);
    const { errors, handleBlur, handleChange, values } = useFormikContext();
    const { is_dashboard } = React.useContext(PlatformContext);
    const should_render = is_mlt || is_mf || is_mx;

    if (!should_render) {
        return null;
    }

    return (
        <React.Fragment>
            <SectionTitle
                title={<Localize i18n_default_text='Your maximum deposit limit' />}
                has_border_line={is_dashboard}
            />
            <div className='da-self-exclusion__item-wrapper'>
                <div className='da-self-exclusion__item'>
                    <h3 className='da-self-exclusion__item-title'>
                        <Localize i18n_default_text='24 hours' />
                    </h3>
                    <Text as='p' size='xs' className='da-self-exclusion__item-field'>
                        <Localize i18n_default_text='Max. deposit limit' />
                    </Text>
                    <Field name='max_deposit'>
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency}
                                value={values.max_deposit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength('max_deposit')}
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
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency}
                                value={values.max_7day_deposit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength('max_7day_deposit')}
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
                        {({ field }) => (
                            <Input
                                {...field}
                                data-lpignore='true'
                                className='da-self-exclusion__input'
                                label={currency}
                                value={values.max_30day_deposit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={getMaxLength('max_30day_deposit')}
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
    const { is_dashboard } = React.useContext(PlatformContext);
    const { footer_ref, goToConfirm, is_app_settings } = React.useContext(SelfExclusionContext);
    const { dirty, isSubmitting, isValid, values } = useFormikContext();
    const versions = {
        // Global settings for account for DWallet.
        dwallet: {
            condition: !!is_dashboard,
            components: [
                SessionAndLoginLimitsInputs,
                MaximumAccountBalanceAndOpenPositionsInputs,
                MaximumDepositLimitInputs,
            ],
        },
        // App-specific settings, i.e. user accessing app settings from App Store or
        // through DWallet App header.
        app_settings: {
            condition: !!is_app_settings,
            components: [StakeLossAndLimitsInputs, MaximumAccountBalanceAndOpenPositionsInputs],
        },
        // Legacy Deriv.app, i.e. non-DWallet user accessing app.deriv.com/account/self-exclusion.
        deriv_app: {
            condition: !!(!is_dashboard && !is_app_settings),
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
            {Object.keys(versions).map((version_name, version_idx) => {
                const version = versions[version_name];
                if (!version.condition) return null;
                return (
                    <React.Fragment key={`${version_name}${version_idx}`}>
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
                        onClick={() => goToConfirm(values)}
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
