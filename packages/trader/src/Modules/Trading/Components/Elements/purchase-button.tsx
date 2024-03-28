import classNames from 'classnames';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Money, IconTradeTypes, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import ContractInfo from 'Modules/Trading/Components/Form/Purchase/contract-info';
import { MT5_ACCOUNT_STATUS, getContractTypeDisplay } from '@deriv/shared';
import { TProposalTypeInfo, TTradeStore } from 'Types';
import { useMFAccountStatus } from '@deriv/hooks';

type TPurchaseButton = {
    basis: string;
    buy_info: TTradeStore['purchase_info'];
    currency: string;
    growth_rate: number;
    has_deal_cancellation: boolean;
    index: number;
    info: TProposalTypeInfo;
    is_accumulator: boolean;
    is_disabled: boolean;
    is_high_low: boolean;
    is_loading: boolean;
    is_multiplier: boolean;
    is_proposal_empty: boolean;
    is_vanilla_fx?: boolean;
    is_vanilla: boolean;
    is_turbos: boolean;
    onClickPurchase: (proposal_id: string, price: string | number, type: string) => void;
    purchased_states_arr: boolean[];
    should_fade: boolean;
    setPurchaseState: (index: number) => void;
    type: string;
};

type TButtonTextWrapper = {
    should_fade: boolean;
    is_loading: boolean;
    type: string;
    is_high_low: boolean;
};

// TODO [lazy-loading-required] Responsive related components
const ButtonTextWrapper = ({ should_fade, is_loading, type, is_high_low }: TButtonTextWrapper) => {
    return (
        <div className='btn-purchase__text_wrapper'>
            <Text size='xs' weight='bold' color='colored-background'>
                {!should_fade && is_loading
                    ? ''
                    : getContractTypeDisplay(type, { isHighLow: is_high_low, showButtonName: true })}
            </Text>
        </div>
    );
};

const IconComponentWrapper = ({ type }: { type: string }) => (
    <div className='btn-purchase__icon_wrapper'>
        <IconTradeTypes type={type} className='btn-purchase__icon' color='active' />
    </div>
);

const PurchaseButton = ({
    basis, // mobile-only
    buy_info,
    currency,
    growth_rate,
    has_deal_cancellation,
    index,
    info,
    is_accumulator,
    is_disabled,
    is_high_low,
    is_loading,
    is_multiplier,
    is_proposal_empty,
    is_turbos,
    is_vanilla_fx,
    is_vanilla,
    onClickPurchase,
    purchased_states_arr,
    setPurchaseState,
    should_fade,
    type,
}: TPurchaseButton) => {
    const {
        ui: { setIsMFVericationPendingModal },
    } = useStore();
    const mf_account_status = useMFAccountStatus();
    const getIconType = () => {
        if (!should_fade && is_loading) return '';
        return is_high_low ? `${type.toLowerCase()}_barrier` : type.toLowerCase();
    };
    const is_button_disabled = (is_disabled && !is_loading) || is_proposal_empty;

    let button_value;

    if (is_multiplier) {
        button_value = (
            <Text size='xs' weight='bold' color='colored-background'>
                <Money amount={info.stake} currency={currency} show_currency />
            </Text>
        );
    } else if (!is_vanilla && !is_turbos && !is_accumulator) {
        button_value = (
            <Text size='xs' weight='bold' color='colored-background'>
                {!(is_loading || is_disabled) ? info.returns : ''}
            </Text>
        );
    }

    return (
        <button
            disabled={is_disabled}
            id={`dt_purchase_${type.toLowerCase()}_button`}
            className={classNames('btn-purchase', {
                'btn-purchase--disabled': is_button_disabled || !!buy_info.error,
                'btn-purchase--animated--slide': is_loading && !should_fade,
                'btn-purchase--animated--fade': is_loading && should_fade,
                'btn-purchase--swoosh': !!purchased_states_arr[index],
                'btn-purchase--1': index === 0,
                'btn-purchase--2': index === 1,
                'btn-purchase--accumulator': is_accumulator,
                'btn-purchase--multiplier': is_multiplier,
                'btn-purchase--multiplier-deal-cancel': has_deal_cancellation,
                'btn-purchase--turbos': is_turbos,
                'btn-purchase--1__vanilla-opts': index === 0 && is_vanilla,
                'btn-purchase--2__vanilla-opts': index === 1 && is_vanilla,
            })}
            onClick={() => {
                if (is_multiplier && mf_account_status === MT5_ACCOUNT_STATUS.PENDING) {
                    setIsMFVericationPendingModal(true);
                } else {
                    setPurchaseState(index);
                    onClickPurchase(info.id, info.stake, type);
                }
            }}
        >
            <DesktopWrapper>
                <div className='btn-purchase__info btn-purchase__info--left'>
                    <div className='btn-purchase__type-wrapper'>
                        <IconComponentWrapper type={getIconType()} />
                        <ButtonTextWrapper
                            should_fade={should_fade}
                            is_loading={is_loading}
                            type={type}
                            is_high_low={is_high_low}
                        />
                    </div>
                </div>
                <div className='btn-purchase__effect-detail' />
                <div className='btn-purchase__effect-detail--arrow' />
                <div className='btn-purchase__info btn-purchase__info--right'>
                    <div className='btn-purchase__text_wrapper'>{button_value}</div>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <div
                    className={classNames('btn-purchase__top', {
                        'btn-purchase__top--accumulator': is_accumulator,
                        'btn-purchase--vanilla': is_vanilla,
                    })}
                >
                    <IconComponentWrapper type={getIconType()} />
                    <ButtonTextWrapper
                        should_fade={should_fade}
                        is_loading={is_loading}
                        type={type}
                        is_high_low={is_high_low}
                    />
                </div>
                {!is_turbos && !is_vanilla && !is_accumulator && (
                    <div className='btn-purchase__bottom'>
                        <ContractInfo
                            basis={basis}
                            currency={currency}
                            growth_rate={growth_rate}
                            is_accumulator={is_accumulator}
                            is_loading={is_loading}
                            is_multiplier={is_multiplier}
                            is_turbos={is_turbos}
                            is_vanilla_fx={is_vanilla_fx}
                            is_vanilla={is_vanilla}
                            should_fade={should_fade}
                            proposal_info={info}
                            type={type}
                        />
                    </div>
                )}
            </MobileWrapper>
        </button>
    );
};

export default PurchaseButton;
