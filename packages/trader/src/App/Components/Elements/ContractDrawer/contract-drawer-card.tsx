import classNames from 'classnames';
import React from 'react';
import { Collapsible, ContractCard, useHover } from '@deriv/components';
import {
    getEndTime,
    getSymbolDisplayName,
    getCardLabels,
    getContractTypeDisplay,
    getMarketInformation,
    isCryptoContract,
    isDesktop,
    toMoment,
} from '@deriv/shared';
import { SwipeableContractDrawer } from './swipeable-components';
import MarketClosedContractOverlay from './market-closed-contract-overlay';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv/hooks';

type TContractCardBodyProps = React.ComponentProps<typeof ContractCard.Body>;
type TContractCardFooterProps = React.ComponentProps<typeof ContractCard.Footer>;
type TSwipeableContractDrawerProps = React.ComponentProps<typeof SwipeableContractDrawer>;

type TContractDrawerCardProps = {
    currency?: string;
    is_collapsed: boolean;
    is_market_closed: boolean;
    result?: string;
    server_time?: moment.Moment;
    toggleContractAuditDrawer: () => void;
} & Pick<
    TContractCardBodyProps,
    | 'contract_info'
    | 'contract_update'
    | 'is_accumulator'
    | 'is_mobile'
    | 'is_multiplier'
    | 'is_turbos'
    | 'is_vanilla'
    | 'is_lookbacks'
> &
    Pick<TContractCardFooterProps, 'is_sell_requested' | 'onClickCancel' | 'onClickSell'> &
    Pick<TSwipeableContractDrawerProps, 'onSwipedDown' | 'onSwipedUp'>;

const ContractDrawerCard = observer(
    ({
        contract_info,
        contract_update,
        currency = '',
        is_accumulator,
        is_collapsed,
        is_market_closed,
        is_mobile,
        is_multiplier,
        is_vanilla,
        is_sell_requested,
        is_turbos,
        is_lookbacks,
        onClickCancel,
        onClickSell,
        onSwipedUp,
        onSwipedDown,
        result,
        server_time = toMoment(),
        toggleContractAuditDrawer,
    }: TContractDrawerCardProps) => {
        const { ui, contract_trade } = useStore();
        const { active_symbols } = useTraderStore();
        const {
            addToast,
            current_focus,
            removeToast,
            should_show_cancellation_warning,
            setCurrentFocus,
            toggleCancellationWarning,
        } = ui;
        const { getContractById } = contract_trade;
        const [hover_ref, should_hide_closed_overlay] = useHover<HTMLDivElement>();
        const { isMobile } = useDevice();

        const { profit, validation_error } = contract_info;
        const is_sold = !!getEndTime(contract_info);
        const display_name = getSymbolDisplayName(
            active_symbols,
            getMarketInformation(contract_info.shortcode || '').underlying
        );

        const is_crypto = isCryptoContract(contract_info.underlying);
        const has_progress_slider = !is_multiplier || (is_crypto && is_multiplier);

        const card_header = (
            <ContractCard.Header
                contract_info={contract_info}
                display_name={display_name}
                getCardLabels={getCardLabels}
                getContractTypeDisplay={getContractTypeDisplay}
                has_progress_slider={isDesktop() && has_progress_slider}
                is_mobile={is_mobile}
                is_sell_requested={is_sell_requested}
                is_sold={is_sold}
                onClickSell={onClickSell}
                server_time={server_time}
            />
        );

        const card_body = (
            <ContractCard.Body
                addToast={addToast}
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                current_focus={current_focus ?? ''}
                getCardLabels={getCardLabels}
                getContractById={getContractById}
                is_accumulator={is_accumulator}
                is_mobile={is_mobile}
                is_multiplier={is_multiplier}
                is_sold={is_sold}
                is_turbos={is_turbos}
                is_vanilla={is_vanilla}
                is_lookbacks={is_lookbacks}
                has_progress_slider={has_progress_slider}
                removeToast={removeToast}
                server_time={server_time}
                setCurrentFocus={setCurrentFocus}
                should_show_cancellation_warning={should_show_cancellation_warning}
                toggleCancellationWarning={toggleCancellationWarning}
            />
        );

        const card_footer = (
            <ContractCard.Footer
                contract_info={contract_info}
                getCardLabels={getCardLabels}
                is_multiplier={is_multiplier}
                is_lookbacks={is_lookbacks}
                is_sell_requested={is_sell_requested}
                onClickCancel={onClickCancel}
                onClickSell={onClickSell}
                server_time={server_time}
            />
        );

        const contract_el = (
            <React.Fragment>
                {card_header}
                {card_body}
            </React.Fragment>
        );

        const contract_card = (
            <ContractCard
                contract_info={contract_info}
                getCardLabels={getCardLabels}
                is_multiplier={is_multiplier}
                profit_loss={Number(profit)}
                should_show_result_overlay={false}
            >
                <div
                    className={classNames('dc-contract-card', {
                        'dc-contract-card--green': Number(profit) > 0 && !result,
                        'dc-contract-card--red': Number(profit) < 0 && !result,
                        'contract-card__market-closed--disabled': is_market_closed && should_hide_closed_overlay,
                    })}
                    ref={hover_ref}
                >
                    {is_market_closed && !getEndTime(contract_info) && (
                        <div
                            className={classNames({
                                'contract-card__market-closed--hidden': isDesktop() && should_hide_closed_overlay,
                            })}
                        >
                            <MarketClosedContractOverlay validation_error={validation_error} />
                        </div>
                    )}
                    {contract_el}
                    {card_footer}
                </div>
            </ContractCard>
        );

        if (isMobile) {
            return (
                <SwipeableContractDrawer onSwipedUp={onSwipedUp} onSwipedDown={onSwipedDown}>
                    <Collapsible.ArrowButton onClick={toggleContractAuditDrawer} is_collapsed={is_collapsed} />
                    {contract_card}
                </SwipeableContractDrawer>
            );
        }

        return contract_card;
    }
);

export default ContractDrawerCard;
