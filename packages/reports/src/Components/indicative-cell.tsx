import React from 'react';
import classNames from 'classnames';
import { ArrowIndicator, Money, DesktopWrapper, ContractCard } from '@deriv/components';
import { getCardLabels, TContractInfo } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

type TIndicativeCell = {
    amount: number;
    contract_info: TContractInfo;
    currency: string;
    is_footer: boolean;
    is_sell_requested: boolean;
    profit: string;
    status?: string;
};

const IndicativeCell = observer((props: TIndicativeCell) => {
    const { amount, contract_info, currency, is_footer, is_sell_requested, profit } = props;
    const { portfolio } = useStore();
    const { onClickSell } = portfolio;

    return (
        <div className='open-positions__indicative'>
            <div className='open-positions__indicative--amount'>
                <div
                    className={classNames({
                        'dc-contract-card--profit': Number(profit) > 0,
                        'dc-contract-card--loss': Number(profit) < 0,
                    })}
                    data-testid='dt_amount_container'
                >
                    <Money amount={Math.abs(amount)} currency={currency} />
                </div>
                <ArrowIndicator value={amount} data-testid='dt_arrow_indicator' />
            </div>
            <DesktopWrapper>
                {!is_footer && (
                    <ContractCard.Sell
                        contract_info={contract_info}
                        is_sell_requested={is_sell_requested}
                        getCardLabels={getCardLabels}
                        onClickSell={contract_id => {
                            if (contract_id) onClickSell(contract_id);
                        }}
                    />
                )}
            </DesktopWrapper>
        </div>
    );
});

export default IndicativeCell;
