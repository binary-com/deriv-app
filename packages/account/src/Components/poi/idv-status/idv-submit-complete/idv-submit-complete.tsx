import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv/components';
import { TIDVErrorStatus, IDV_ERROR_STATUS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { DerivLightWaitingPoiIcon } from '@deriv/quill-icons';
import PoaButton from '../../../poa/poa-button';

type TIdvSubmitComplete = {
    is_from_external: boolean;
    mismatch_status: TIDVErrorStatus;
    needs_poa: boolean;
    redirect_button: React.ReactNode;
};

const IdvSubmitComplete = observer(
    ({ is_from_external, mismatch_status, needs_poa, redirect_button }: Partial<TIdvSubmitComplete>) => {
        const { client } = useStore();
        const { is_already_attempted } = client;

        const is_mismatch_error =
            mismatch_status === IDV_ERROR_STATUS.NameDobMismatch.code ||
            mismatch_status === IDV_ERROR_STATUS.DobMismatch.code ||
            mismatch_status === IDV_ERROR_STATUS.NameMismatch.code;

        const is_expired_or_failed_error =
            mismatch_status === IDV_ERROR_STATUS.Expired.code || mismatch_status === IDV_ERROR_STATUS.Failed.code;

        const getHeaderText = () => {
            if (is_already_attempted) {
                if (is_mismatch_error) return <Localize i18n_default_text='Your profile is updated' />;
                if (is_expired_or_failed_error)
                    return <Localize i18n_default_text='Your document has been submitted' />;
            }
            return <Localize i18n_default_text='Review in progress' />;
        };

        const getDescriptionText = () => {
            if (is_already_attempted && (is_mismatch_error || is_expired_or_failed_error))
                return (
                    <Localize i18n_default_text="We'll review your proof of identity again and will give you an update as soon as possible." />
                );
            return (
                <Localize i18n_default_text='Your proof of identity is under review. We’ll get back to you within 5 minutes.' />
            );
        };

        const poa_button = !is_from_external && <PoaButton custom_text={<Localize i18n_default_text='Next' />} />;

        return (
            <div className={clsx('proof-of-identity__container', 'proof-of-identity__container--status')}>
                <DerivLightWaitingPoiIcon className='icon' />
                <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                    {getHeaderText()}
                </Text>
                <Text className='proof-of-identity__text text' size='xs' align='center'>
                    {getDescriptionText()}
                </Text>
                {needs_poa ? (
                    <React.Fragment>
                        <Text className='text' size='xs' align='center'>
                            <Localize i18n_default_text='To start trading, you also need to verify your address.' />
                        </Text>
                        {poa_button}
                    </React.Fragment>
                ) : (
                    <div className='proof-of-identity__redirection'>{redirect_button}</div>
                )}
            </div>
        );
    }
);

export default React.memo(IdvSubmitComplete);
