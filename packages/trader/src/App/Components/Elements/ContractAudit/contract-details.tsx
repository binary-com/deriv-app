import React from 'react';
import classNames from 'classnames';
import { Money, Icon, ThemedScrollbars, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import {
    addComma,
    epochToMoment,
    getCancellationPrice,
    getCurrencyDisplayCode,
    getLocalizedBasis,
    formatResetDuration,
    hasTwoBarriers,
    isAccumulatorContract,
    isAsiansContract,
    isEndedBeforeCancellationExpired,
    isMultiplierContract,
    isSmartTraderContract,
    isLookBacksContract,
    isTicksContract,
    isResetContract,
    isTurbosContract,
    isUserCancelled,
    isUserSold,
    isVanillaFxContract,
    TContractInfo,
    CONTRACT_TYPES,
    toGMTFormat,
} from '@deriv/shared';
import { Analytics } from '@deriv-com/analytics';
import { getBarrierLabel, getBarrierValue, isDigitType } from 'App/Components/Elements/PositionsDrawer/helpers';
import ContractAuditItem from './contract-audit-item';
import { isCancellationExpired } from 'Stores/Modules/Trading/Helpers/logic';
import { useDevice } from '@deriv/hooks';

type TContractDetails = {
    contract_end_time?: number;
    contract_info: TContractInfo;
    duration: number | string;
    duration_unit: string;
    exit_spot?: string;
    is_vanilla?: boolean;
};

const ContractDetails = ({
    contract_end_time,
    contract_info,
    duration,
    duration_unit,
    exit_spot,
    is_vanilla,
}: TContractDetails) => {
    const {
        barrier,
        commission,
        contract_type,
        currency,
        date_start,
        display_number_of_contracts,
        entry_spot_display_value,
        entry_tick_time,
        exit_tick_time,
        high_barrier,
        is_sold,
        low_barrier,
        profit,
        selected_tick,
        status,
        tick_count,
        tick_passed,
        transaction_ids: { buy, sell } = {},
        reset_barrier,
        reset_time,
        underlying,
    } = contract_info;
    const { isMobile } = useDevice();

    const is_profit = Number(profit) >= 0;
    const cancellation_price = getCancellationPrice(contract_info);
    const show_barrier = !is_vanilla && !isAccumulatorContract(contract_type) && !isSmartTraderContract(contract_type);
    const show_duration = !isAccumulatorContract(contract_type) || !isNaN(Number(contract_end_time));
    const show_payout_per_point = isTurbosContract(contract_type) || is_vanilla;
    const ticks_label = Number(tick_count) < 2 ? localize('tick') : localize('ticks');
    const show_strike_barrier = is_vanilla || isAsiansContract(contract_type) || isResetContract(contract_type);
    const ticks_duration_text = isAccumulatorContract(contract_type)
        ? `${tick_passed}/${tick_count} ${localize('ticks')}`
        : `${tick_count} ${ticks_label}`;

    const INDICATIVE_HIGH = 'H';
    const INDICATIVE_LOW = 'L';

    const additional_info = isResetContract(contract_type) ? (
        <Localize
            i18n_default_text='The reset time is {{ reset_time }}'
            values={{
                reset_time:
                    Number(tick_count) > 0
                        ? `${Math.floor(Number(tick_count) / 2)} ${ticks_label}`
                        : formatResetDuration(contract_info),
            }}
        />
    ) : (
        ''
    );

    const createLookBacksMarker = (abbreviation?: string) => {
        const low_spot_text = is_sold ? (
            <Localize i18n_default_text='Low spot' />
        ) : (
            <Localize i18n_default_text='Indicative low spot' />
        );
        const high_spot_text = is_sold ? (
            <Localize i18n_default_text='High spot' />
        ) : (
            <Localize i18n_default_text='Indicative high spot' />
        );
        return {
            label: abbreviation === INDICATIVE_LOW ? low_spot_text : high_spot_text,
            icon: (
                <div className='lookbacks-marker__wrapper'>
                    <Text color='colored-background' size='xxxs' className='lookbacks-marker__asset'>
                        {abbreviation}
                    </Text>
                </div>
            ),
        };
    };

    const lookbacks_marker = createLookBacksMarker(
        contract_type === CONTRACT_TYPES.LB_PUT ? INDICATIVE_HIGH : INDICATIVE_LOW
    );

    const vanilla_payout_text = isVanillaFxContract(contract_type, underlying)
        ? getLocalizedBasis().payout_per_pip
        : getLocalizedBasis().payout_per_point;

    const getLabel = () => {
        if (isUserSold(contract_info) && isEndedBeforeCancellationExpired(contract_info))
            return localize('Deal cancellation');
        if (isUserCancelled(contract_info)) return localize('Deal cancellation (executed)');
        if (isCancellationExpired(contract_info)) return localize('Deal cancellation (expired)');
        return localize('Deal cancellation (active)');
    };

    React.useEffect(() => {
        Analytics.trackEvent('ce_reports_form', {
            action: 'open_contract_details',
            form_name: 'default',
            form_source: 'deriv_trader',
        });
    }, []);

    return (
        <ThemedScrollbars is_bypassed={isMobile}>
            <div className='contract-audit__tabs-content'>
                <ContractAuditItem
                    id='dt_id_label'
                    icon={<Icon icon='IcContractId' size={24} />}
                    label={localize('Reference ID')}
                    value={localize('{{buy_value}} (Buy)', { buy_value: buy })}
                    value2={sell ? localize('{{sell_value}} (Sell)', { sell_value: sell }) : undefined}
                />
                {isMultiplierContract(contract_type) ? (
                    <React.Fragment>
                        <ContractAuditItem
                            id='dt_commission_label'
                            icon={<Icon icon='IcContractCommission' size={24} />}
                            label={localize('Commission')}
                            value={<Money amount={commission ?? ''} currency={currency} show_currency />}
                        />
                        {!!cancellation_price && (
                            <ContractAuditItem
                                id='dt_cancellation_label'
                                icon={<Icon icon='IcContractSafeguard' size={24} />}
                                label={getLabel()}
                                value={<Money amount={cancellation_price} currency={currency} />}
                            />
                        )}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {show_duration && (
                            <ContractAuditItem
                                id='dt_duration_label'
                                icon={<Icon icon='IcContractDuration' size={24} />}
                                label={localize('Duration')}
                                value={Number(tick_count) > 0 ? ticks_duration_text : `${duration} ${duration_unit}`}
                                additional_info={additional_info}
                            />
                        )}
                        {show_strike_barrier && (
                            <React.Fragment>
                                <ContractAuditItem
                                    id='dt_bt_label'
                                    icon={<Icon icon='IcContractStrike' size={24} />}
                                    label={getBarrierLabel(contract_info)}
                                    value={
                                        (isResetContract(contract_type)
                                            ? addComma(entry_spot_display_value)
                                            : getBarrierValue(contract_info)) || ' - '
                                    }
                                />
                                {reset_time && (
                                    <React.Fragment>
                                        <ContractAuditItem
                                            id='dt_reset_barrier_label'
                                            icon={<Icon icon='IcContractResetBarrier' size={24} />}
                                            label={localize('Reset barrier')}
                                            value={reset_barrier ? addComma(reset_barrier) : ' - '}
                                        />
                                        <ContractAuditItem
                                            id='dt_reset_time_label'
                                            icon={<Icon icon='IcContractResetTime' size={24} />}
                                            label={localize('Reset time')}
                                            value={toGMTFormat(epochToMoment(reset_time))}
                                        />
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )}
                        {show_barrier && (
                            <ContractAuditItem
                                id='dt_bt_label'
                                icon={
                                    isDigitType(contract_type) ? (
                                        <Icon icon='IcContractTarget' size={24} />
                                    ) : (
                                        <Icon icon='IcContractBarrier' size={24} />
                                    )
                                }
                                label={getBarrierLabel(contract_info)}
                                value={getBarrierValue(contract_info) || ' - '}
                            />
                        )}
                        {hasTwoBarriers(contract_type) && (
                            <React.Fragment>
                                {[high_barrier, low_barrier].map((barrier, index) => (
                                    <ContractAuditItem
                                        id={`dt_bt_label_${index + 1}`}
                                        icon={<Icon icon='IcContractStrike' size={24} />}
                                        key={barrier}
                                        label={
                                            high_barrier === barrier
                                                ? localize('High barrier')
                                                : localize('Low barrier')
                                        }
                                        value={barrier}
                                    />
                                ))}
                            </React.Fragment>
                        )}
                        {show_payout_per_point && (
                            <ContractAuditItem
                                id='dt_bt_label'
                                icon={<Icon icon='IcContractPayout' size={24} />}
                                label={vanilla_payout_text}
                                value={
                                    display_number_of_contracts
                                        ? `${display_number_of_contracts} ${getCurrencyDisplayCode(currency)}`
                                        : ' - '
                                }
                            />
                        )}
                    </React.Fragment>
                )}
                {isTicksContract(contract_type) && (
                    <ContractAuditItem
                        id='dt_entry_spot_label'
                        icon={
                            <div className='contract-audit__selected-tick'>
                                <div
                                    className={classNames(
                                        'contract-audit__selected-tick--marker',
                                        `contract-audit__selected-tick--marker--${status}`
                                    )}
                                >
                                    {selected_tick}
                                </div>
                            </div>
                        }
                        label={localize('Selected tick')}
                        value={barrier || '----'}
                    />
                )}
                <ContractAuditItem
                    id='dt_start_time_label'
                    icon={<Icon icon='IcContractStartTime' size={24} />}
                    label={localize('Start time')}
                    value={toGMTFormat(epochToMoment(Number(date_start))) || ' - '}
                />
                {isLookBacksContract(contract_type) && (
                    <React.Fragment>
                        {contract_type === CONTRACT_TYPES.LB_HIGH_LOW ? (
                            <React.Fragment>
                                {[high_barrier, low_barrier].map((barrier, index) => {
                                    const high_low_marker = createLookBacksMarker(
                                        index === 0 ? INDICATIVE_HIGH : INDICATIVE_LOW
                                    );

                                    return (
                                        <ContractAuditItem
                                            id={`dt_bt_label_${index + 1}`}
                                            icon={high_low_marker.icon}
                                            key={barrier}
                                            label={high_low_marker.label}
                                            value={barrier}
                                        />
                                    );
                                })}
                            </React.Fragment>
                        ) : (
                            <ContractAuditItem
                                id='dt_indicative_high_spot'
                                icon={lookbacks_marker.icon}
                                label={lookbacks_marker.label}
                                value={contract_info?.barrier}
                            />
                        )}
                    </React.Fragment>
                )}
                {!isDigitType(contract_type) && (
                    <ContractAuditItem
                        id='dt_entry_spot_label'
                        icon={<Icon icon='IcContractEntrySpot' size={24} />}
                        label={localize('Entry spot')}
                        value={entry_spot_display_value ? addComma(entry_spot_display_value) : ' - '}
                        value2={entry_tick_time ? toGMTFormat(epochToMoment(entry_tick_time)) : ' - '}
                        additional_info={
                            isTicksContract(contract_type) &&
                            localize('The entry spot is the first tick for High/Low Ticks.')
                        }
                    />
                )}
                {!isNaN(Number(exit_spot)) && (
                    <ContractAuditItem
                        id='dt_exit_spot_label'
                        icon={<Icon icon='IcContractExitSpot' size={24} />}
                        label={localize('Exit spot')}
                        value={exit_spot ? addComma(exit_spot) : ' - '}
                        value2={toGMTFormat(epochToMoment(Number(exit_tick_time))) || ' - '}
                    />
                )}
                {!isNaN(Number(contract_end_time)) && (
                    <ContractAuditItem
                        id='dt_exit_time_label'
                        icon={<Icon icon='IcContractExitTime' color={is_profit ? 'green' : 'red'} size={24} />}
                        label={localize('Exit time')}
                        value={toGMTFormat(epochToMoment(Number(contract_end_time))) || ' - '}
                    />
                )}
            </div>
        </ThemedScrollbars>
    );
};

export default ContractDetails;
