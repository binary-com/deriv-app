import PropTypes                from 'prop-types';
import React                    from 'react';
import {
    Money,
    Icon,
    ThemedScrollbars }          from 'deriv-components';
import { localize }             from 'deriv-translations';
import {
    epochToMoment,
    toGMTFormat }               from 'Utils/Date';
import {
    getBarrierLabel,
    getBarrierValue,
    isDigitType }               from 'App/Components/Elements/PositionsDrawer/helpers';
import { isUserCancelled }      from 'Stores/Modules/Contract/Helpers/logic';
import { isMultiplierContract } from 'Stores/Modules/Contract/Helpers/multiplier';
import ContractAuditItem        from './contract-audit-item.jsx';

const ContractDetails = ({
    contract_end_time,
    contract_info,
    duration,
    duration_unit,
    exit_spot,
}) => {
    const is_profit     = (contract_info.profit >= 0);
    const is_cancelled  = isUserCancelled(contract_info);
    const has_deal_cancellation = contract_info.deal_cancellation;

    return (
        <ThemedScrollbars
            style={{ width: '100%', height: 'calc(100vh - 404px)'  }}
            autoHide
        >
            <div style={{ padding: '0.8rem' }}>
                <ContractAuditItem
                    id='dt_id_label'
                    icon={<Icon icon='IcContractId' size={24} />}
                    label={localize('Reference ID')}
                    value={localize('{{buy_value}} (Buy)', { buy_value: contract_info.transaction_ids.buy })}
                    value2={localize('{{sell_value}} (Sell)', { sell_value: contract_info.transaction_ids.sell })}
                />
                {
                    isMultiplierContract(contract_info.contract_type) ?
                        <React.Fragment>
                            <ContractAuditItem
                                id='dt_commission_label'
                                icon={<Icon icon='IcContractCommission' size={24} />}
                                label={localize('Commission')}
                                value={<Money
                                    amount={contract_info.commission}
                                    currency={contract_info.currency}
                                />
                                }
                            />
                            {has_deal_cancellation &&
                                <ContractAuditItem
                                    id='dt_deal_cancellation_label'
                                    icon={<Icon icon='IcContractSafeguard' size={24} />}
                                    label={is_cancelled ? localize('Cancel deal (used)') : localize('Cancel deal (expired)')}
                                    value={<Money
                                        amount={contract_info.deal_cancellation.ask_price}
                                        currency={contract_info.currency}
                                    />
                                    }
                                />
                            }
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <ContractAuditItem
                                id='dt_duration_label'
                                icon={<Icon icon='IcContractDuration' size={24} />}
                                label={localize('Duration')}
                                value={(contract_info.tick_count > 0) ?
                                    `${contract_info.tick_count} ${(contract_info.tick_count < 2) ? localize('tick') : localize('ticks')}`
                                    :
                                    `${duration} ${duration_unit}`}
                            />
                            <ContractAuditItem
                                id='dt_bt_label'
                                icon={
                                    isDigitType(contract_info.contract_type)
                                        ? <Icon icon='IcContractTarget' size={24} />
                                        : <Icon icon='IcContractBarrier' size={24} />
                                }
                                label={getBarrierLabel(contract_info)}
                                value={getBarrierValue(contract_info) || ' - '}
                            />
                        </React.Fragment>
                }
                <ContractAuditItem
                    id='dt_start_time_label'
                    icon={<Icon icon='IcContractStartTime' size={24} />}
                    label={localize('Start time')}
                    value={toGMTFormat(epochToMoment(contract_info.purchase_time)) || ' - '}
                />
                {
                    !isDigitType(contract_info.contract_type) &&
                        <ContractAuditItem
                            id='dt_entry_spot_label'
                            icon={<Icon icon='IcContractEntrySpot' size={24} />}
                            label={localize('Entry spot')}
                            value={contract_info.entry_spot_display_value || ' - '}
                            value2={toGMTFormat(epochToMoment(contract_info.entry_tick_time)) || ' - '}
                        />
                }
                {
                    !isNaN(exit_spot) &&
                        <ContractAuditItem
                            id='dt_exit_spot_label'
                            icon={<Icon icon='IcContractExitSpot' size={24} />}
                            label={localize('Exit spot')}
                            value={exit_spot || ' - '}
                            value2={toGMTFormat(epochToMoment(contract_info.exit_tick_time)) || ' - '}
                        />
                }
                <ContractAuditItem
                    id='dt_exit_time_label'
                    icon={<Icon icon='IcContractExitTime' color={is_profit ? 'green' : 'red'} size={24} />}
                    label={localize('Exit Time')}
                    value={toGMTFormat(epochToMoment(contract_end_time)) || ' - '}
                />
            </div>
        </ThemedScrollbars>
    );
};

ContractDetails.propTypes = {
    contract_end_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    contract_info: PropTypes.object,
    duration     : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit: PropTypes.string,
    exit_spot    : PropTypes.string,
};

export default ContractDetails;
