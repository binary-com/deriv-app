import React from 'react';
import { FormikValues, useFormikContext } from 'formik';
import { Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import BlockSelector from 'Components/block-selector';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AdFormController from 'Pages/my-ads/ad-form-controller';
import PreferredCountriesSelector from 'Pages/my-ads/preferred-countries-selector';
import { useStores } from 'Stores';
import { TCountryListProps } from 'Types';
import CreateAdSummary from '../create-ad-summary.jsx';

type TAdConditionsSection = {
    action: string;
    country_list: TCountryListProps;
    goToFirstStep: () => void;
    is_form_dirty: boolean;
};
const AdConditionsSection = ({
    action,
    country_list,
    is_form_dirty,
    goToFirstStep,
    ...props
}: TAdConditionsSection) => {
    const [has_min_join_days_changed, setHasMinJoinDaysChange] = React.useState(false);
    const [has_min_completion_rate_changed, setHasMinCompletionRateChanged] = React.useState(false);
    const { showModal } = useModalManagerContext();
    const { dirty, errors, values } = useFormikContext<FormikValues>();
    const { my_ads_store } = useStores();
    const { min_completion_rate = 0, min_join_days = 0 } = my_ads_store.p2p_advert_information;
    const joining_days = [
        { name: '15 days', value: 15 },
        { name: '30 days', value: 30 },
        { name: '60 days', value: 60 },
    ];
    const completion_rates = [
        { name: '50%', value: 50 },
        { name: '70%', value: 70 },
        { name: '90%', value: 90 },
    ];
    const setJoiningDays = (value: number) => {
        my_ads_store.setMinJoinDays(value);
        setHasMinJoinDaysChange(value !== min_join_days);
    };
    const setMinCompletionRate = (value: number) => {
        my_ads_store.setMinCompletionRate(value);
        setHasMinCompletionRateChanged(value !== min_completion_rate);
    };

    React.useEffect(() => {
        if (my_ads_store.error_code) {
            showModal({
                key: 'AdCreateEditErrorModal',
                props: {
                    onUpdateAd: () => {
                        goToFirstStep();
                        my_ads_store.setApiErrorCode(null);
                    },
                },
            });
        }
    }, [my_ads_store.error_code]);

    return (
        <>
            <CreateAdSummary
                offer_amount={errors.offer_amount ? '' : values.offer_amount}
                price_rate={values.rate_type}
                type={values.type}
            />
            <Text as='div' className='ad-conditions-section__label' color='prominent' size='xs'>
                <Localize i18n_default_text='Counterparty conditions (optional)' />
            </Text>
            <Text as='div' color='less-prominent' size='xs'>
                <Localize i18n_default_text='Only users who match these criteria will see your ad.' />
            </Text>
            <BlockSelector
                label={localize('Joined more than')}
                onSelect={setJoiningDays}
                options={joining_days}
                tooltip_info={
                    <Localize i18n_default_text="We'll only show your ad to people who've been using Deriv P2P for longer than the time you choose." />
                }
                value={min_join_days}
            />
            <BlockSelector
                label={localize('Completion rate of more than')}
                onSelect={setMinCompletionRate}
                options={completion_rates}
                tooltip_info={
                    <>
                        <Text size='xs'>
                            <Localize i18n_default_text="We'll only show your ad to people with a completion rate higher than your selection." />
                        </Text>
                        <Text as='div' className='ad-conditions-section__rate' size='xs'>
                            <Localize i18n_default_text='The completion rate is the percentage of successful orders.' />
                        </Text>
                    </>
                }
                value={min_completion_rate}
            />
            <div className='ad-conditions-section__countries-label'>
                <Text color='less-prominent' size='xs' line_height='xl'>
                    <Localize i18n_default_text='Preferred countries' />
                </Text>
                <Icon
                    color='disabled'
                    icon='IcInfoOutline'
                    onClick={() => {
                        showModal({
                            key: 'ErrorModal',
                            props: {
                                error_message: localize(
                                    'We’ll only show your ad to people in the countries you choose.'
                                ),
                                error_modal_title: localize('Preferred countries'),
                                has_close_icon: false,
                            },
                        });
                    }}
                />
            </div>
            <PreferredCountriesSelector country_list={country_list} />
            <AdFormController
                {...props}
                action={action}
                is_save_btn_disabled={
                    !dirty &&
                    !is_form_dirty &&
                    !has_min_join_days_changed &&
                    !has_min_completion_rate_changed &&
                    my_ads_store.required_ad_type === my_ads_store.selected_ad_type
                }
            />
        </>
    );
};

export default observer(AdConditionsSection);
