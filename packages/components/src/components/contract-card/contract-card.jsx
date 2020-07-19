import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { isMultiplierContract } from '@deriv/shared';
import ContractCardLoader from './contract-card-loader';
import ContractCardHeader from './contract-card-items/contract-card-header.jsx';
import ContractCardBody from './contract-card-items/contract-card-body.jsx';
import ResultOverlay from './result-overlay';
import MobileWrapper from '../mobile-wrapper';
import DesktopWrapper from '../desktop-wrapper';

const ContractCard = ({
    card_footer,
    className,
    contract_info,
    contract_update,
    currency,
    getCardLabels,
    getContractPath,
    getContractTypeDisplay,
    id,
    is_positions,
    is_sell_requested,
    is_unsupported,
    is_valid_to_sell,
    onClickRemove,
    onClickSell,
    onMouseEnter,
    onMouseLeave,
    profit_loss,
    result,
    server_time,
    should_show_result_overlay,
    show_transition,
    status,
    toggleUnsupportedContractModal,
}) => {
    const loader_el = (
        <div className='contract-card__content-loader'>
            <ContractCardLoader speed={2} />
        </div>
    );

    const fallback_result = profit_loss >= 0 ? 'won' : 'lost';
    const is_multiplier = isMultiplierContract(contract_info.contract_type);

    const card_body = (
        <ContractCardBody
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            getCardLabels={getCardLabels}
            is_multiplier={is_multiplier}
            status={status}
            server_time={server_time}
        />
    );

    const card_body_wrapper = (
        <React.Fragment>
            <DesktopWrapper>{card_body}</DesktopWrapper>
            <MobileWrapper>
                <div className='contract-card__body-wrapper contract-card__separator'>{card_body}</div>
            </MobileWrapper>
        </React.Fragment>
    );

    const contract_el = (
        <React.Fragment>
            <ContractCardHeader
                contract_info={contract_info}
                getCardLabels={getCardLabels}
                getContractTypeDisplay={getContractTypeDisplay}
                has_progress_slider={!is_multiplier}
                id={id}
                is_sell_requested={is_sell_requested}
                is_valid_to_sell={is_valid_to_sell}
                onClickSell={onClickSell}
                server_time={server_time}
            />
            {card_body_wrapper}
        </React.Fragment>
    );

    // When scrolling fast in react-window, sometimes card is stuck with enter transition class and it is not removed after timeout making the card to be invisible.
    // So added a class based on isScrolling from react-window to show the transition.
    const transition_class = show_transition && 'contract-card__wrapper--transition';

    return (
        <>
            {should_show_result_overlay && (
                <DesktopWrapper>
                    <ResultOverlay
                        contract_id={contract_info.contract_id}
                        getCardLabels={getCardLabels}
                        getContractPath={getContractPath}
                        is_unsupported={is_unsupported}
                        is_multiplier={is_multiplier}
                        is_visible={!!contract_info.is_sold}
                        onClickRemove={onClickRemove}
                        onClick={() => toggleUnsupportedContractModal(true)}
                        result={result || fallback_result}
                        is_positions={is_positions}
                    />
                </DesktopWrapper>
            )}
            {is_positions ? (
                <div
                    id={`contract_card_${contract_info.contract_id}`}
                    className={classNames('contract-card__wrapper', transition_class, className)}
                    onMouseEnter={() => {
                        onMouseEnter(true, contract_info);
                    }}
                    onMouseLeave={() => {
                        onMouseLeave(false, contract_info);
                    }}
                    onClick={() => {
                        onMouseLeave(false, contract_info);
                    }}
                >
                    {is_unsupported ? (
                        <div
                            className={classNames('contract-card', {
                                'contract-card--green': !is_multiplier && profit_loss > 0 && !result,
                                'contract-card--red': !is_multiplier && profit_loss < 0 && !result,
                            })}
                            onClick={() => toggleUnsupportedContractModal(true)}
                        >
                            {contract_info.underlying ? contract_el : loader_el}
                        </div>
                    ) : (
                        <NavLink
                            className={classNames('contract-card', {
                                'contract-card--green': !is_multiplier && profit_loss > 0 && !result,
                                'contract-card--red': !is_multiplier && profit_loss < 0 && !result,
                            })}
                            to={{
                                pathname: `/contract/${contract_info.contract_id}`,
                                state: {
                                    // from_table_row: true,
                                },
                            }}
                        >
                            {contract_info.underlying ? contract_el : loader_el}
                        </NavLink>
                    )}
                    {card_footer}
                </div>
            ) : (
                <div
                    className={classNames('contract-card', {
                        'contract-card--green': !is_multiplier && profit_loss > 0 && !result,
                        'contract-card--red': !is_multiplier && profit_loss < 0 && !result,
                    })}
                >
                    {contract_el}
                    {card_footer}
                </div>
            )}
        </>
    );
};

ContractCard.propTypes = {
    className: PropTypes.string,
    contract_info: PropTypes.object,
    currency: PropTypes.string,
    is_unsupported: PropTypes.bool,
    onClickRemove: PropTypes.func,
    result: PropTypes.string,
    status: PropTypes.string,
    toggleUnsupportedContractModal: PropTypes.func,
};

export default ContractCard;
