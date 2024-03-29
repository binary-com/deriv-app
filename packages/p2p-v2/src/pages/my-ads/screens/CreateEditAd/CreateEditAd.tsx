import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useFloatingRate } from '@/hooks';
import { p2p, useActiveAccount } from '@deriv/api-v2';
import { AdWizard } from '../../components/AdWizard';

const STEPS = [
    { header: { title: 'Set ad type and amount' } },
    { header: { title: 'Set payment details' } },
    { header: { title: 'Set ad conditions' } },
];

const CreateEditAd = () => {
    const { rateType } = useFloatingRate();
    const { data: activeAccount } = useActiveAccount();
    const { data: p2pSettings } = p2p.settings.useGetSettings();
    const { order_payment_period: orderPaymentPeriod } = p2pSettings ?? {};
    const methods = useForm({
        defaultValues: {
            'ad-type': 'buy',
            amount: '',
            instructions: '',
            'max-order': '',
            'min-order': '',
            'order-completion-time': `${orderPaymentPeriod ? (orderPaymentPeriod * 60).toString() : '3600'}`,
            'rate-value': '-0.01',
        },
        mode: 'all',
    });

    const onSubmit = () => {
        // TODO: handle submit after all the steps are completed
    };
    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <AdWizard
                    currency={activeAccount?.currency ?? 'USD'}
                    localCurrency={p2pSettings?.localCurrency}
                    rateType={rateType}
                    steps={STEPS}
                />
            </form>
        </FormProvider>
    );
};

export default CreateEditAd;
