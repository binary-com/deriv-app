import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { ContractCard } from '@deriv/components';
import ContractCardLoader from 'Components/contract-card-loading';
import { getCardLabels, getContractTypeDisplay } from 'Constants/contract';
import { connect } from 'Stores/connect';
import { connectWithContractUpdate } from 'Utils/multiplier';

const SummaryCard = ({
    addToast,
    contract_info,
    contract_store,
    current_focus,
    is_contract_completed,
    is_contract_loading,
    is_contract_inactive,
    is_mobile,
    is_multiplier,
    onClickSell,
    is_sell_requested,
    removeToast,
    server_time,
    setCurrentFocus,
}) => {
    const card_header = (
        <ContractCard.Header
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            getContractTypeDisplay={getContractTypeDisplay}
            has_progress_slider={!is_multiplier}
            is_mobile={is_mobile}
            is_sold={is_contract_completed}
            server_time={server_time}
        />
    );

    const card_body = (
        <ContractCard.Body
            addToast={addToast}
            connectWithContractUpdate={connectWithContractUpdate}
            contract_info={contract_info}
            currency={contract_info && contract_info.currency}
            current_focus={current_focus}
            error_message_alignment='left'
            getCardLabels={getCardLabels}
            getContractById={() => contract_store}
            is_mobile={is_mobile}
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
                'db-summary-card--mobile': is_mobile,
                'db-summary-card--inactive': is_contract_inactive,
                'db-summary-card--is-loading': is_contract_loading,
                'db-summary-card--completed': is_contract_completed,
                'db-summary-card--completed-mobile': is_contract_completed && is_mobile,
            })}
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
                <React.Fragment>
                    {localize('Build a bot from the start menu then hit the run button to run the bot.')}
                </React.Fragment>
            )}
        </div>
    );
};

SummaryCard.propTypes = {
    addToast: PropTypes.func,
    contract_info: PropTypes.object,
    contract_store: PropTypes.object,
    current_focus: PropTypes.object,
    is_contract_completed: PropTypes.bool,
    is_contract_inactive: PropTypes.bool,
    is_contract_loading: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    onClickSell: PropTypes.func,
    is_sell_requested: PropTypes.bool,
    removeToast: PropTypes.func,
    server_time: PropTypes.object,
    setCurrentFocus: PropTypes.func,
};

export default connect(({ summary_card, common, run_panel, ui }) => ({
    addToast: ui.addToast,
    contract_info: summary_card.contract_info,
    contract_store: summary_card,
    current_focus: ui.current_focus,
    is_contract_completed: summary_card.is_contract_completed,
    is_contract_inactive: summary_card.is_contract_inactive,
    is_contract_loading: summary_card.is_contract_loading,
    is_mobile: ui.is_mobile,
    is_multiplier: summary_card.is_multiplier,
    onClickSell: run_panel.onClickSell,
    is_sell_requested: run_panel.is_sell_requested,
    removeToast: ui.removeToast,
    server_time: common.server_time,
    setCurrentFocus: ui.setCurrentFocus,
}))(SummaryCard);
