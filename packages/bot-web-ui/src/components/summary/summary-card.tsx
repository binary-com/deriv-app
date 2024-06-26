import React from 'react';
import classNames from 'classnames';
import { ContractCard, Text } from '@deriv/components';
import { getCardLabels } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import ContractCardLoader from 'Components/contract-card-loading';
import { getContractTypeDisplay } from 'Constants/contract';
import { useDBotStore } from 'Stores/useDBotStore';
import { TSummaryCardProps } from './summary-card.types';

const SummaryCard = observer(({ contract_info, is_contract_loading }: TSummaryCardProps) => {
    const { summary_card, run_panel } = useDBotStore();
    const { ui, common } = useStore();
    const { is_contract_completed, is_contract_inactive, is_multiplier } = summary_card;
    const { onClickSell, is_sell_requested } = run_panel;
    const { addToast, current_focus, removeToast, setCurrentFocus } = ui;
    const { server_time } = common;

    const { is_desktop } = ui;

    const card_header = (
        <ContractCard.Header
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            getContractTypeDisplay={getContractTypeDisplay}
            has_progress_slider={!is_multiplier}
            is_sold={is_contract_completed}
            server_time={server_time}
        />
    );

    const card_body = (
        <ContractCard.Body
            addToast={addToast}
            contract_info={contract_info}
            currency={contract_info?.currency ?? ''}
            current_focus={current_focus}
            error_message_alignment='left'
            getCardLabels={getCardLabels}
            getContractById={() => summary_card}
            is_mobile={!is_desktop}
            is_multiplier={is_multiplier}
            is_sold={is_contract_completed}
            removeToast={removeToast}
            server_time={server_time}
            setCurrentFocus={setCurrentFocus}
        />
    );

    const card_footer = (
        <ContractCard.Footer
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            is_multiplier={is_multiplier}
            is_sell_requested={is_sell_requested}
            onClickSell={onClickSell}
        />
    );

    const contract_el = (
        <React.Fragment>
            {card_header}
            {card_body}
            {card_footer}
        </React.Fragment>
    );

    return (
        <div
            className={classNames('db-summary-card', {
                'db-summary-card--mobile': !is_desktop,
                'db-summary-card--inactive': is_contract_inactive && !is_contract_loading && !contract_info,
                'db-summary-card--is-loading': is_contract_loading,
                'db-summary-card--completed': is_contract_completed,
                'db-summary-card--completed-mobile': is_contract_completed && !is_desktop,
            })}
            data-testid='dt_mock_summary_card'
        >
            {is_contract_loading && <ContractCardLoader speed={2} />}
            {!is_contract_loading && contract_info && (
                <ContractCard
                    contract_info={contract_info}
                    getCardLabels={getCardLabels}
                    is_multiplier={is_multiplier}
                    profit_loss={contract_info.profit}
                    should_show_result_overlay={true}
                >
                    <div
                        className={classNames('dc-contract-card', {
                            'dc-contract-card--green': contract_info.profit > 0,
                            'dc-contract-card--red': contract_info.profit < 0,
                        })}
                    >
                        {contract_el}
                    </div>
                </ContractCard>
            )}
            {!is_contract_loading && !contract_info && (
                <Text as='p' line_height='s' size='xs'>
                    {localize('When you’re ready to trade, hit ')}
                    <strong>{localize('Run')}</strong>
                    {localize('. You’ll be able to track your bot’s performance here.')}
                </Text>
            )}
        </div>
    );
});

export default SummaryCard;
