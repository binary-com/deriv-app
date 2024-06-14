import React from 'react';
import { getDisplayStatus, getCardLabels, isCryptocurrency, CONTRACT_TYPES } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import ContractCardItem from './contract-card-item';
import MobileOrTabletWrapper from '../../mobile-wrapper';
import Money from '../../money';
import Text from '../../text';
import ArrowIndicator from '../../arrow-indicator';
import { ResultStatusIcon } from '../result-overlay/result-overlay';
import { TGeneralContractCardBodyProps } from './contract-update-form';

type TLookBacksCardBody = Pick<TGeneralContractCardBodyProps, 'contract_info' | 'currency' | 'is_sold'> & {
    progress_slider_mobile_el: React.ReactNode;
    indicative?: number | null;
};

const LookBacksCardBody = ({
    contract_info,
    currency,
    is_sold,
    indicative,
    progress_slider_mobile_el,
}: TLookBacksCardBody) => {
    const { buy_price, contract_type, sell_price, profit, multiplier } = contract_info;
    const { INDICATIVE_PRICE, MULTIPLIER, PROFIT_LOSS, POTENTIAL_PROFIT_LOSS, PAYOUT, PURCHASE_PRICE } =
        getCardLabels();

    const getPayoutLimit = (contract_type?: string, multiplier?: number) => {
        let formula_base: string | React.ReactNode = '';
        if (contract_type === CONTRACT_TYPES.LB_PUT) {
            formula_base = <Localize i18n_default_text='(High - Close)' />;
        } else if (contract_type === CONTRACT_TYPES.LB_CALL) {
            formula_base = <Localize i18n_default_text='(Close - Low)' />;
        } else if (contract_type === CONTRACT_TYPES.LB_HIGH_LOW) {
            formula_base = <Localize i18n_default_text='(High - Low)' />;
        }

        return (
            <React.Fragment>
                <Localize
                    i18n_default_text='Payout limit: {{multiplier}} x '
                    values={{
                        multiplier,
                    }}
                />
                {formula_base}
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <div className='dc-contract-card-items-wrapper dc-contract-card--lookbacks'>
                <ContractCardItem
                    header={is_sold ? PROFIT_LOSS : POTENTIAL_PROFIT_LOSS}
                    is_crypto={isCryptocurrency(currency)}
                    is_loss={Number(profit) < 0}
                    is_won={Number(profit) > 0}
                >
                    <Money amount={profit} currency={currency} />
                    {!is_sold && <ArrowIndicator className='dc-contract-card__indicative--movement' value={profit} />}
                </ContractCardItem>
                <ContractCardItem header={is_sold ? PAYOUT : INDICATIVE_PRICE}>
                    <Money currency={currency} amount={Number(sell_price || indicative)} />
                    {!is_sold && (
                        <ArrowIndicator
                            className='dc-contract-card__indicative--movement'
                            value={Number(sell_price || indicative)}
                        />
                    )}
                </ContractCardItem>
                <ContractCardItem header={PURCHASE_PRICE}>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={MULTIPLIER}>{`x${multiplier}`}</ContractCardItem>
                <MobileOrTabletWrapper>
                    <div className='dc-contract-card__status'>
                        {is_sold ? (
                            <ResultStatusIcon
                                getCardLabels={getCardLabels}
                                is_contract_won={getDisplayStatus(contract_info) === 'won'}
                            />
                        ) : (
                            progress_slider_mobile_el
                        )}
                    </div>
                </MobileOrTabletWrapper>
            </div>
            <ContractCardItem className='dc-contract-card-item__payout-limit'>
                <Text align='center' line_height='l' size='xxs'>
                    {getPayoutLimit(contract_type, multiplier)}
                </Text>
            </ContractCardItem>
        </React.Fragment>
    );
};

export default React.memo(LookBacksCardBody);
