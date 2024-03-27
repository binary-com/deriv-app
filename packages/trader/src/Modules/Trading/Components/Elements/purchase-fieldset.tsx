import classNames from 'classnames';
import React from 'react';
import { Popover } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset';
import ContractInfo from 'Modules/Trading/Components/Form/Purchase/contract-info';
import PurchaseButton from 'Modules/Trading/Components/Elements/purchase-button';
import CancelDealInfo from '../Form/Purchase/cancel-deal-info';
import { TProposalTypeInfo, TTradeStore } from 'Types';
import { useDevice } from '@deriv/hooks';

type TPurchaseFieldset = {
    basis: string;
    buy_info: TTradeStore['purchase_info'];
    currency: string;
    growth_rate: number;
    has_cancellation: boolean;
    index: number;
    info: TProposalTypeInfo;
    is_accumulator: boolean;
    is_disabled: boolean;
    is_high_low: boolean;
    is_loading: boolean;
    is_market_closed?: boolean;
    is_multiplier: boolean;
    is_proposal_empty: boolean;
    is_proposal_error: boolean;
    is_vanilla_fx?: boolean;
    is_vanilla: boolean;
    is_turbos: boolean;
    onClickPurchase: (proposal_id: string, price: string | number, type: string, isMobile: boolean) => void;
    onHoverPurchase: (is_over: boolean, contract_type: string) => void;
    purchased_states_arr: boolean[];
    setPurchaseState: (index: number) => void;
    type: string;
};

const PurchaseFieldset = ({
    basis,
    buy_info,
    currency,
    growth_rate,
    has_cancellation,
    index,
    info,
    is_accumulator,
    is_disabled,
    is_high_low,
    is_loading,
    is_market_closed,
    is_multiplier,
    is_proposal_empty,
    is_proposal_error,
    is_turbos,
    is_vanilla_fx,
    is_vanilla,
    onClickPurchase,
    onHoverPurchase,
    purchased_states_arr,
    setPurchaseState,
    type,
}: TPurchaseFieldset) => {
    const [should_fade, setShouldFade] = React.useState(false);
    const { isMobile } = useDevice();

    React.useEffect(() => {
        setShouldFade(true);
    }, []);

    const purchase_button = (
        <React.Fragment>
            {is_multiplier && has_cancellation && isMobile && <CancelDealInfo proposal_info={info} />}
            <PurchaseButton
                buy_info={buy_info}
                currency={currency}
                info={info}
                index={index}
                growth_rate={growth_rate}
                has_deal_cancellation={is_multiplier && has_cancellation}
                is_accumulator={is_accumulator}
                is_disabled={is_disabled}
                is_high_low={is_high_low}
                is_loading={is_loading}
                is_multiplier={is_multiplier}
                is_vanilla={is_vanilla}
                is_vanilla_fx={is_vanilla_fx}
                is_proposal_empty={is_proposal_empty}
                is_turbos={is_turbos}
                purchased_states_arr={purchased_states_arr}
                onClickPurchase={onClickPurchase}
                setPurchaseState={setPurchaseState}
                should_fade={should_fade}
                type={type}
                basis={basis} // mobile-only
            />
        </React.Fragment>
    );

    return (
        <Fieldset
            className={classNames('trade-container__fieldset', 'purchase-container__option', {
                'purchase-container__option--has-cancellation': has_cancellation,
                'purchase-container__option--turbos': is_turbos,
            })}
        >
            {!isMobile && (
                <div
                    className={classNames('trade-container__fieldset-wrapper', {
                        'trade-container__fieldset-wrapper--disabled': is_proposal_error || is_disabled,
                    })}
                >
                    {(has_cancellation || !is_multiplier) && !is_accumulator && (
                        <ContractInfo
                            basis={basis}
                            currency={currency}
                            is_loading={is_loading}
                            is_multiplier={is_multiplier}
                            is_turbos={is_turbos}
                            is_vanilla={is_vanilla}
                            is_vanilla_fx={is_vanilla_fx}
                            proposal_info={info}
                            should_fade={should_fade}
                            type={type}
                            is_accumulator={is_accumulator}
                            growth_rate={growth_rate}
                        />
                    )}
                    <div
                        className={classNames('btn-purchase__shadow-wrapper', {
                            'btn-purchase__shadow-wrapper--disabled': is_proposal_error || is_disabled,
                        })}
                        onMouseEnter={() => {
                            if (!is_disabled) {
                                onHoverPurchase(true, type);
                            }
                        }}
                        onMouseLeave={() => {
                            if (!is_disabled) {
                                onHoverPurchase(false, type);
                            }
                        }}
                        onClick={() => {
                            if (!is_disabled) {
                                onHoverPurchase(false, type);
                            }
                        }}
                    >
                        <div className='btn-purchase__box-shadow' />
                        {is_proposal_error && !is_market_closed ? (
                            <Popover
                                has_error
                                alignment='left'
                                message={info.message}
                                is_open={is_proposal_error && !is_market_closed}
                                relative_render
                                margin={6}
                            >
                                {purchase_button}
                            </Popover>
                        ) : (
                            <React.Fragment>
                                {is_multiplier ? (
                                    <Popover
                                        alignment='left'
                                        is_bubble_hover_enabled
                                        margin={8}
                                        message={info.message}
                                        relative_render
                                    >
                                        {purchase_button}
                                    </Popover>
                                ) : (
                                    purchase_button
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </div>
            )}
            {isMobile && (
                <React.Fragment>
                    {is_proposal_error && <div className='btn-purchase__error'>{info.message}</div>}
                    {purchase_button}
                </React.Fragment>
            )}
        </Fieldset>
    );
};

export default React.memo(PurchaseFieldset);
