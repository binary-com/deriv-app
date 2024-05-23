import React from 'react';
import { Button, Icon, StaticUrl, Text } from '@deriv/components';
import { FormikValues, useFormikContext } from 'formik';
import { formatMoney, toMoment } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import SelfExclusionContext from './self-exclusion-context';
import SelfExclusionConfirmLimits from './self-exclusion-confirm-limits';

const SelfExclusionConfirmPage = () => {
    const { backFromConfirmLimits, currency, currency_display, exclusion_texts, is_eu, state } =
        React.useContext(SelfExclusionContext);
    const { isSubmitting, values } = useFormikContext<FormikValues>();

    if (state?.show_confirm) {
        return <SelfExclusionConfirmLimits />;
    }

    return (
        <React.Fragment>
            <div onClick={backFromConfirmLimits} className='da-self-exclusion__back'>
                <Icon icon='IcArrowLeftBold' />
                <Text as='p' size='xs' weight='bold'>
                    <Localize i18n_default_text='Back' />
                </Text>
            </div>
            <div className='da-self-exclusion__confirm'>
                <Text
                    className='da-self-exclusion__confirm-header'
                    as='h2'
                    size='s'
                    line_height='l'
                    weight='bold'
                    color='prominent'
                >
                    <Localize i18n_default_text='You have set the following limits:' />
                </Text>
                {state?.changed_attributes.map((key: string) => {
                    const need_date_format = ['exclude_until', 'timeout_until'];
                    const need_money_format = [
                        'max_deposit',
                        'max_7day_deposit',
                        'max_30day_deposit',
                        'max_total_stake',
                        'max_turnover',
                        'max_losses',
                        'max_7day_turnover',
                        'max_7day_losses',
                        'max_30day_turnover',
                        'max_30day_losses',
                        'max_balance',
                    ];
                    const need_minutes = ['session_duration_limit'];
                    const need_amount = ['max_open_bets'];

                    let value = '';

                    if (need_date_format.includes(key)) {
                        value = toMoment(values[key]).format('DD/MM/YYYY');
                    } else if (need_money_format.includes(key)) {
                        value = `${formatMoney(currency, +values[key], true)} ${currency_display}`;
                    } else if (need_minutes.includes(key)) {
                        value = localize('{{value}} mins', { value: values[key] });
                    } else if (need_amount.includes(key)) {
                        value = `${values[key]}`;
                    }

                    const checked_value = +values[key] === 0 ? 'Removed' : value;

                    return (
                        <div key={key} className='da-self-exclusion__confirm-item'>
                            <Text as='p' size='xs'>
                                {exclusion_texts ? exclusion_texts[key] : ''}
                            </Text>
                            <Text as='p' size='xs' align='right' weight='bold'>
                                {checked_value}
                            </Text>
                        </div>
                    );
                })}
                <Text as='p' size='xs' align='center' className='da-self-exclusion__confirm-note'>
                    {is_eu ? (
                        <Localize
                            i18n_default_text='You’ll be able to adjust these limits at any time. You can reduce your limits from the <0>self-exclusion page</0>. To increase or remove your limits, please contact our <1>Customer Support team</1>.'
                            components={[
                                <Text key={0} size='xs' color='loss-danger' weight='bold' />,
                                <StaticUrl key={1} className='link link--orange' href='/contact-us' />,
                            ]}
                        />
                    ) : (
                        <Localize
                            i18n_default_text='We’ll update your limits. Click <0>Accept</0> to acknowledge that you are fully responsible for your actions, and we are not liable for any addiction or loss.'
                            components={[<Text key={0} size='xs' weight='bold' />]}
                        />
                    )}
                </Text>
                <Text as='p' size='xs' align='center' color='loss-danger' className='da-self-exclusion__error'>
                    {state?.submit_error_message}
                </Text>
                {is_eu ? (
                    <Button is_loading={isSubmitting} is_disabled={isSubmitting} primary large type='submit'>
                        <Localize i18n_default_text='Confirm my limits' />
                    </Button>
                ) : (
                    <Button is_loading={isSubmitting} is_disabled={isSubmitting} primary large type='submit'>
                        <Localize i18n_default_text='Accept' />
                    </Button>
                )}
            </div>
        </React.Fragment>
    );
};

export default SelfExclusionConfirmPage;
