import React from 'react';
import { FormikValues, useFormikContext } from 'formik';
import { Button, Icon, Popover, Text } from '@deriv/components';
import BlockSelector from 'Components/block-selector';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AdFormController from 'Pages/my-ads/ad-form-controller';
import { useStores } from 'Stores';
import CreateAdSummary from '../create-ad-summary.jsx';

const AdConditionsSection = ({ ...props }) => {
    const { errors, isSubmitting, isValid, values } = useFormikContext<FormikValues>();
    const { showModal } = useModalManagerContext();
    const { my_ads_store } = useStores();
    const { min_completion_rate, min_join_days } = my_ads_store.p2p_advert_information;
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
    };
    const setMinCompletionRate = (value: number) => {
        my_ads_store.setMinCompletionRate(value);
    };

    return (
        <>
            <CreateAdSummary
                offer_amount={errors.offer_amount ? '' : values.offer_amount}
                price_rate={values.rate_type}
                type={values.type}
            />
            <Text as='div' color='prominent' size='xs'>
                <Localize i18n_default_text='Counterparty conditions (optional)' />
            </Text>
            <Text as='div' color='less-prominent' size='xs'>
                <Localize i18n_default_text='Only users who match these criteria will see your ad.' />
            </Text>
            <BlockSelector
                label={localize('Joined more than')}
                onSelect={setJoiningDays}
                options={joining_days}
                tooltip_info="We'll only show your ad to people who've been using Deriv P2P for longer than the time you choose."
                value={min_join_days}
            />
            <BlockSelector
                label={localize('Completion rate of more than')}
                onSelect={setMinCompletionRate}
                options={completion_rates}
                tooltip_info="We'll only show your ad to people with a completion rate higher than your selection. The completion rate is the percentage of successful orders."
                value={min_completion_rate}
            />
            <div className='ad-conditions-section__countries-label'>
                <Text color='less-prominent' size='xs' line_height='xl'>
                    <Localize i18n_default_text='Preferred countries' />
                </Text>
                <Popover
                    alignment='top'
                    message={
                        <Localize i18n_default_text='We’ll only show your ad to people in the countries you choose.' />
                    }
                >
                    <Icon color='disabled' icon='IcInfoOutline' />
                </Popover>
            </div>
            <Button
                onClick={() => {
                    showModal({
                        key: 'PreferredCountriesModal',
                        props: {},
                    });
                }}
                type='button'
            >
                <Localize i18n_default_text='All countries' />
            </Button>
            <AdFormController {...props} isSubmitting={isSubmitting} isValid={isValid} />
        </>
    );
};

export default AdConditionsSection;
