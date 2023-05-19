import React from 'react';
import { Icon, Money, Text, Popover } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { observer, useStore } from '@deriv/stores';
import { getContractSubtype, isVanillaContract } from '@deriv/shared';

const PayoutPerPointMobile = observer(() => {
    const {
        modules: { trade },
    } = useStore();
    const { currency, proposal_info, contract_type, vanilla_trade_type } = trade;
    const contract_key = isVanillaContract(contract_type) ? vanilla_trade_type : contract_type?.toUpperCase();
    const { has_error, has_increased, id, message, obj_contract_basis } = proposal_info?.[contract_key] || {};
    const { text: label, value: payout_per_point } = obj_contract_basis || {};
    const has_error_or_not_loaded = has_error || !id;
    const tooltip_text = isVanillaContract(contract_type) ? (
        <Localize
            i18n_default_text='<0>For {{title}}:</0> Your payout will grow by this amount for every point {{trade_type}} your strike price. You will start making a profit when the payout is higher than your stake.'
            components={[<strong key={0} />]}
            values={{
                trade_type: contract_key === 'VANILLALONGCALL' ? localize('above') : localize('below'),
                title: contract_key === 'VANILLALONGCALL' ? localize('Call') : localize('Put'),
            }}
        />
    ) : (
        <Localize
            i18n_default_text='<0>{{title}}</0> {{message}}'
            components={[<Text key={0} weight='bold' size='xxs' />]}
            values={{
                title: getContractSubtype(contract_key) === 'Long' ? localize('For Long:') : localize('For Short:'),
                message,
            }}
        />
    );

    return (
        <Fieldset className='payout-per-point'>
            {isNaN(payout_per_point) ? null : (
                <React.Fragment>
                    <div className='payout-per-point__label-wrapper'>
                        <Text size='xs' color='less-prominent' className='payout-per-point__label'>
                            {label}
                        </Text>
                        <Popover
                            alignment='top'
                            icon='info'
                            is_bubble_hover_enabled
                            margin={0}
                            zIndex='9999'
                            message={message ? tooltip_text : ''}
                        />
                    </div>
                    <Text size='xs' weight='bold' className='payout-per-point__value'>
                        <Money amount={payout_per_point} currency={currency} show_currency should_format={false} />
                        <span className='trade-container__price-info-movement'>
                            {!has_error_or_not_loaded && has_increased !== null && has_increased ? (
                                <Icon icon='IcProfit' />
                            ) : (
                                <Icon icon='IcLoss' />
                            )}
                        </span>
                    </Text>
                </React.Fragment>
            )}
        </Fieldset>
    );
});

export default PayoutPerPointMobile;
