import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { Localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Button, useNotifications } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';
import {
    getCardLabelsV2,
    getContractTypeDisplay,
    getIndicativePrice,
    hasContractEntered,
    isAccumulatorContract,
    isOpen,
    isValidToSell,
} from '@deriv/shared';
import PurchaseButtonContent from './purchase-button-content';
import { getTradeTypeTabsList } from 'AppV2/Utils/trade-params-utils';
import { StandaloneStopwatchRegularIcon } from '@deriv/quill-icons';
import { CSSTransition } from 'react-transition-group';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import { usePrevious } from '@deriv/components';

const PurchaseButton = observer(() => {
    const [loading_button_index, setLoadingButtonIndex] = React.useState<number | null>(null);
    const { isMobile } = useDevice();
    const { addBanner } = useNotifications();
    const {
        contract_replay: { is_market_closed },
        portfolio: { all_positions, onClickSell, open_accu_contract, active_positions },
        client: { is_logged_in },
    } = useStore();
    const {
        contract_type,
        currency,
        has_open_accu_contract,
        is_accumulator,
        is_multiplier,
        is_purchase_enabled,
        is_touch,
        is_trade_enabled_v2,
        is_turbos,
        is_vanilla_fx,
        is_vanilla,
        proposal_info,
        onPurchaseV2,
        symbol,
        trade_type_tab,
        trade_types,
    } = useTraderStore();

    const [is_sell_button_visible, setIsSellButtonVisibile] = React.useState(is_accumulator && has_open_accu_contract);
    const [animation_duration, setAnimationDuration] = React.useState(450);
    const prev_has_open_accu_contract = usePrevious(
        !!open_accu_contract &&
            !!active_positions.find(
                ({ contract_info, type }) => isAccumulatorContract(type) && contract_info.underlying === symbol
            )
    );

    /*TODO: add error handling when design will be ready. validation_errors can be taken from useTraderStore
    const hasError = (info: TTradeStore['proposal_info'][string]) => {
        const has_validation_error = Object.values(validation_errors).some(e => e.length);
        return has_validation_error || info?.has_error
    };*/
    const is_high_low = /^high_low$/.test(contract_type.toLowerCase());
    const purchase_button_content_props = {
        currency,
        has_open_accu_contract,
        is_multiplier,
        is_turbos,
        is_vanilla,
    };
    const has_no_button_content =
        is_vanilla ||
        is_vanilla_fx ||
        is_turbos ||
        is_high_low ||
        is_touch ||
        (is_accumulator && !has_open_accu_contract);
    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    const active_accu_contract = is_accumulator
        ? all_positions.find(
              ({ contract_info, type }) =>
                  isAccumulatorContract(type) && contract_info.underlying === symbol && !contract_info.is_sold
          )
        : undefined;
    const is_valid_to_sell = active_accu_contract?.contract_info
        ? hasContractEntered(active_accu_contract.contract_info) &&
          isOpen(active_accu_contract.contract_info) &&
          isValidToSell(active_accu_contract.contract_info)
        : false;
    const current_stake =
        (is_valid_to_sell && active_accu_contract && getIndicativePrice(active_accu_contract.contract_info)) || null;
    const cardLabels = getCardLabelsV2();

    const is_accu_sell_disabled = !is_valid_to_sell || active_accu_contract?.is_sell_requested;

    const getButtonType = (index: number, trade_type: string) => {
        const tab_index = getTradeTypeTabsList(contract_type).findIndex(tab => tab.contract_type === trade_type);
        const button_index = tab_index < 0 ? index : tab_index;
        return button_index ? 'sell' : 'purchase';
    };

    const addNotificationBannerCallback = (params: Parameters<typeof addBanner>[0]) =>
        addBanner({
            icon: (
                <StandaloneStopwatchRegularIcon
                    iconSize='sm'
                    className='trade-notification--purchase'
                    key='contract-opened'
                />
            ),
            ...params,
        });

    React.useEffect(() => {
        if (is_purchase_enabled) setLoadingButtonIndex(null);
    }, [is_purchase_enabled]);

    React.useEffect(() => {
        const is_animated =
            (!prev_has_open_accu_contract && has_open_accu_contract) ||
            (prev_has_open_accu_contract && !has_open_accu_contract && is_accumulator);
        setAnimationDuration(is_animated ? 450 : 0);

        setIsSellButtonVisibile(is_accumulator ? has_open_accu_contract : false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_accumulator, has_open_accu_contract]);

    return (
        <React.Fragment>
            <CSSTransition
                in={!is_sell_button_visible}
                timeout={animation_duration}
                classNames='slide'
                key='purchase-button'
                unmountOnExit
                mountOnEnter
            >
                <div
                    className={clsx('purchase-button__wrapper', {
                        'purchase-button__wrapper__un-auth': !is_logged_in,
                    })}
                >
                    {contract_types.map((trade_type, index) => {
                        const info = proposal_info?.[trade_type] || {};
                        const is_single_button = contract_types.length === 1;
                        const is_loading = loading_button_index === index;
                        const is_disabled = !is_trade_enabled_v2 || info.has_error;

                        const getErrorMessage = () => {
                            if (['amount', 'stake'].includes(info.error_field ?? '')) {
                                return <Localize i18n_default_text='Invalid stake' />;
                            }

                            /* TODO: stop using error text for is_max_payout_exceeded after validation_params are added to proposal API (both success & error response):
                            E.g., for is_max_payout_exceeded, we have to temporarily check the error text: Max payout error always contains 3 numbers, the check will work for any languages: */
                            const float_number_search_regex = /\d+(\.\d+)?/g;
                            const is_max_payout_exceeded =
                                info.has_error && info.message?.match(float_number_search_regex)?.length === 3;

                            if (is_max_payout_exceeded) {
                                return <Localize i18n_default_text='Exceeds max payout' />;
                            }

                            const api_error = info.has_error && !is_market_closed && !!info.message ? info.message : '';
                            return api_error;
                        };

                        const error_message = getErrorMessage();

                        return (
                            <React.Fragment key={trade_type}>
                                <Button
                                    color={getButtonType(index, trade_type)}
                                    size='lg'
                                    label={getContractTypeDisplay(trade_type, {
                                        isHighLow: is_high_low,
                                        showButtonName: true,
                                    })}
                                    fullWidth
                                    className={clsx(
                                        'purchase-button',
                                        is_loading && 'purchase-button--loading',
                                        is_single_button && 'purchase-button--single'
                                    )}
                                    isLoading={is_loading}
                                    isOpaque
                                    disabled={is_disabled && !is_loading}
                                    onClick={() => {
                                        setLoadingButtonIndex(index);
                                        onPurchaseV2(trade_type, isMobile, addNotificationBannerCallback);
                                    }}
                                >
                                    {!is_loading && (
                                        <PurchaseButtonContent
                                            {...purchase_button_content_props}
                                            error={error_message}
                                            has_no_button_content={has_no_button_content}
                                            info={info}
                                            is_reverse={!!index}
                                        />
                                    )}
                                </Button>
                            </React.Fragment>
                        );
                    })}
                </div>
            </CSSTransition>
            <CSSTransition
                in={is_sell_button_visible}
                timeout={animation_duration}
                classNames='slide'
                key='sell-button'
                unmountOnExit
                mountOnEnter
            >
                <div className='purchase-button__wrapper'>
                    <Button
                        color='black-white'
                        size='lg'
                        label={
                            is_accu_sell_disabled
                                ? `${cardLabels.CLOSE}`
                                : `${cardLabels.CLOSE} ${current_stake} ${currency}`
                        }
                        fullWidth
                        isOpaque
                        isLoading={active_accu_contract?.is_sell_requested}
                        className='purchase-button purchase-button--single'
                        disabled={!is_valid_to_sell}
                        onClick={() => onClickSell(active_accu_contract?.contract_info.contract_id)}
                    />
                </div>
            </CSSTransition>
        </React.Fragment>
    );
});

export default PurchaseButton;
