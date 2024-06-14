import React from 'react';
import { Button, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { useP2PSettings } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { api_error_codes } from 'Constants/api-error-codes';
import { buy_sell } from 'Constants/buy-sell';
import AdRateError from './ad-rate-error';

type TAdErrorTooltipModal = {
    visibility_status: string[];
    account_currency: string;
    remaining_amount: number;
    advert_type: string;
};

const AdErrorTooltipModal = ({
    visibility_status = [],
    account_currency = '',
    remaining_amount,
    advert_type,
}: TAdErrorTooltipModal) => {
    const { general_store } = useStores();
    const {
        ui: { is_mobile_or_tablet },
    } = useStore();
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { advertiser_buy_limit, advertiser_sell_limit } = general_store;

    const { p2p_settings } = useP2PSettings();

    const getAdErrorMessage = (error_code: string) => {
        switch (error_code) {
            case api_error_codes.ADVERT_INACTIVE:
                return <AdRateError />;
            case api_error_codes.ADVERT_MAX_LIMIT:
                return (
                    <Localize
                        i18n_default_text='This ad is not listed on Buy/Sell because its minimum order is higher than {{maximum_order_amount}} {{currency}}.'
                        values={{
                            maximum_order_amount: p2p_settings?.maximum_order_amount,
                            currency: account_currency,
                        }}
                    />
                );
            case api_error_codes.ADVERT_MIN_LIMIT:
                return (
                    <Localize i18n_default_text='This ad is not listed on Buy/Sell because its maximum order is lower than the minimum amount you can specify for orders in your ads.' />
                );
            case api_error_codes.ADVERT_REMAINING:
                return (
                    <Localize
                        i18n_default_text='This ad is not listed on Buy/Sell because its minimum order is higher than the ad’s remaining amount ({{remaining_amount}} {{currency}}).'
                        values={{
                            remaining_amount,
                            currency: account_currency,
                        }}
                    />
                );
            case api_error_codes.ADVERTISER_ADS_PAUSED:
                return (
                    <Localize i18n_default_text='This ad is not listed on Buy/Sell because you have paused all your ads.' />
                );
            case api_error_codes.AD_EXCEEDS_BALANCE:
                return (
                    <Localize
                        i18n_default_text='This ad is not listed on Buy/Sell because its minimum order is higher than your Deriv P2P available balance ({{balance}} {{currency}}).'
                        values={{
                            balance: general_store.advertiser_info.balance_available,
                            currency: account_currency,
                        }}
                    />
                );
            case api_error_codes.AD_EXCEEDS_DAILY_LIMIT: {
                const remaining_limit = advert_type === buy_sell.BUY ? advertiser_buy_limit : advertiser_sell_limit;
                return (
                    <Localize
                        i18n_default_text='This ad is not listed on Buy/Sell because its minimum order is higher than your remaining daily limit ({{remaining_limit}} {{currency}}).'
                        values={{
                            remaining_limit,
                            currency: account_currency,
                        }}
                    />
                );
            }
            case api_error_codes.ADVERTISER_TEMP_BAN:
                return (
                    <Localize i18n_default_text='You’re not allowed to use Deriv P2P to advertise. Please contact us via live chat for more information.' />
                );
            default:
                return <Localize i18n_default_text='Your ad is not listed' />;
        }
    };

    const getMultipleErrorMessages = (error_statuses: string[]) =>
        error_statuses.map((status, index) => (
            <div key={index}>
                {index + 1}. {getAdErrorMessage(status)}
            </div>
        ));

    return (
        <Modal className='ad-error-tooltip-modal' is_open={is_modal_open} small has_close_icon={false}>
            <ThemedScrollbars height={'calc(100vh - 8.4rem)'}>
                <Modal.Body>
                    <Text
                        as='div'
                        color='prominent'
                        size={is_mobile_or_tablet ? 'xxs' : 'xs'}
                        line_height={is_mobile_or_tablet ? 'l' : 'xl'}
                    >
                        {visibility_status.length === 1 ? (
                            getAdErrorMessage(visibility_status[0])
                        ) : (
                            <div>
                                <Localize i18n_default_text='Your ad isn’t listed on Buy/Sell due to the following reason(s):' />
                                {getMultipleErrorMessages(visibility_status)}
                            </div>
                        )}
                    </Text>
                </Modal.Body>
            </ThemedScrollbars>
            <Modal.Footer>
                <Button has_effect text={localize('OK')} onClick={hideModal} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(AdErrorTooltipModal);
