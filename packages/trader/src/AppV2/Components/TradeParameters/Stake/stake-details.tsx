import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/quill-ui';
import { formatMoney, getCurrencyDisplayCode, getTradeTypeName, TRADE_TYPES } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TTradeStore } from 'Types';

type TStakeDetailsProps = Pick<
    TTradeStore,
    'commission' | 'contract_type' | 'currency' | 'has_stop_loss' | 'is_multiplier' | 'stop_out'
> & {
    contract_types: string[];
    details: {
        first_contract_payout: number;
        max_payout: string | number;
        max_stake: string | number;
        min_stake: string | number;
        second_contract_payout: number;
    };
    is_loading_proposal: boolean;
    is_max_payout_exceeded: boolean;
    should_show_payout_details: boolean;
    stake_error: string;
};

const StakeDetails = ({
    commission,
    contract_type,
    contract_types,
    currency,
    details,
    has_stop_loss,
    is_loading_proposal,
    is_multiplier,
    is_max_payout_exceeded,
    should_show_payout_details,
    stake_error,
    stop_out,
}: TStakeDetailsProps) => {
    const [displayed_values, setDisplayedValues] = React.useState({
        max_payout: '',
        commission: '',
        first_contract_payout: '',
        second_contract_payout: '',
        stop_out: '',
    });

    React.useEffect(() => {
        const getDisplayedValue = (new_value?: number | string, current_value?: string) => {
            return ((current_value === '-' && is_loading_proposal) || stake_error) && !is_max_payout_exceeded
                ? '-'
                : formatMoney(currency, Number(new_value), true);
        };

        const {
            commission: commission_value,
            first_contract_payout,
            second_contract_payout,
            stop_out: stop_out_value,
            max_payout,
        } = displayed_values;
        const new_commission = getDisplayedValue(Math.abs(Number(commission)), commission_value);
        const new_payout_1 = getDisplayedValue(details.first_contract_payout, first_contract_payout);
        const new_payout_2 = getDisplayedValue(details.second_contract_payout, second_contract_payout);
        const new_stop_out = getDisplayedValue(Math.abs(Number(stop_out)), stop_out_value);
        const new_max_payout = getDisplayedValue(details.max_payout, max_payout);

        if (
            commission_value !== new_commission ||
            first_contract_payout !== new_payout_1 ||
            second_contract_payout !== new_payout_2 ||
            stop_out_value !== new_stop_out ||
            max_payout !== new_max_payout
        ) {
            setDisplayedValues({
                commission: new_commission,
                first_contract_payout: new_payout_1,
                second_contract_payout: new_payout_2,
                stop_out: new_stop_out,
                max_payout: new_max_payout,
            });
        }
    }, [
        commission,
        currency,
        details,
        displayed_values,
        is_loading_proposal,
        is_max_payout_exceeded,
        stake_error,
        stop_out,
    ]);

    const payout_title = <Localize i18n_default_text='Payout' />;
    const content = [
        {
            is_displayed: !has_stop_loss && is_multiplier && !should_show_payout_details,
            label: <Localize i18n_default_text='Stop out' />,
            value: displayed_values.stop_out,
        },
        {
            is_displayed: is_multiplier && !should_show_payout_details,
            label: <Localize i18n_default_text='Commission' />,
            value: displayed_values.commission,
        },
        {
            is_displayed: !!details.max_payout && should_show_payout_details,
            label: <Localize i18n_default_text='Max payout' />,
            value: formatMoney(currency, +details.max_payout, true),
        },
        {
            contract_type: getTradeTypeName(contract_types[0], {
                isHighLow: contract_type === TRADE_TYPES.HIGH_LOW,
            }),
            is_displayed: !!contract_types.length && should_show_payout_details,
            label: payout_title,
            has_error: details.first_contract_payout > +details.max_payout && is_max_payout_exceeded,
            value: displayed_values.first_contract_payout,
        },
        {
            contract_type: getTradeTypeName(contract_types[1], {
                isHighLow: contract_type === TRADE_TYPES.HIGH_LOW,
            }),
            is_displayed: contract_types.length > 1 && should_show_payout_details,
            label: payout_title,
            has_error: details.second_contract_payout > +details.max_payout && is_max_payout_exceeded,
            value: displayed_values.second_contract_payout,
        },
    ];

    return (
        <div className='stake-content__details'>
            {content.map(
                ({ contract_type, is_displayed, label, has_error, value }, idx) =>
                    is_displayed && (
                        <div
                            key={`${idx}_${value}`}
                            className={clsx('stake-content__details-row', has_error && 'error')}
                        >
                            <Text size='sm'>
                                {label}
                                {contract_type && ` (${contract_type})`}
                            </Text>
                            <Text size='sm'>
                                {value} {getCurrencyDisplayCode(currency)}
                            </Text>
                        </div>
                    )
            )}
        </div>
    );
};

export default StakeDetails;
