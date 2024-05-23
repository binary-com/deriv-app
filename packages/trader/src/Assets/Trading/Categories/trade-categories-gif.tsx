import React from 'react';
import ImageAsianUpDown from 'Assets/SvgComponents/trade_explanations/img-asian.svg';
import ImageCloseToLow from 'Assets/SvgComponents/trade_explanations/img-close-to-low.svg';
import ImageEndsInOut from 'Assets/SvgComponents/trade_explanations/img-ends-in-out.svg';
import ImageHighToClose from 'Assets/SvgComponents/trade_explanations/img-high-to-close.svg';
import ImageHighToLow from 'Assets/SvgComponents/trade_explanations/img-high-to-low.svg';
import ImageReset from 'Assets/SvgComponents/trade_explanations/img-reset.svg';
import ImageRunHighLow from 'Assets/SvgComponents/trade_explanations/img-run-high-low.svg';
import ImageSpread from 'Assets/SvgComponents/trade_explanations/img-spread.svg';
import ImageTickHighLow from 'Assets/SvgComponents/trade_explanations/img-tick-high-low.svg';
import ImageTurbos from 'Assets/SvgComponents/trade_explanations/img-turbos.svg';
import ContractTypeDescriptionVideo from './contract-type-description-video';
import { TRADE_TYPES } from '@deriv/shared';

const TradeCategoriesGIF = ({
    category,
    selected_contract_type,
}: {
    category?: string;
    selected_contract_type?: string;
}) => {
    if (category !== selected_contract_type) return null;
    switch (category) {
        case TRADE_TYPES.ASIAN:
            return <ImageAsianUpDown />;
        case TRADE_TYPES.CALL_PUT_SPREAD:
            return <ImageSpread />;
        case TRADE_TYPES.END:
            return <ImageEndsInOut />;
        case TRADE_TYPES.EVEN_ODD:
            return <ContractTypeDescriptionVideo selected_contract_type={selected_contract_type} />;
        case TRADE_TYPES.HIGH_LOW:
            return <ContractTypeDescriptionVideo selected_contract_type={selected_contract_type} />;
        case TRADE_TYPES.LB_CALL:
            return <ImageCloseToLow />;
        case TRADE_TYPES.LB_PUT:
            return <ImageHighToClose />;
        case TRADE_TYPES.LB_HIGH_LOW:
            return <ImageHighToLow />;
        case TRADE_TYPES.RISE_FALL:
        case TRADE_TYPES.RISE_FALL_EQUAL:
            return <ContractTypeDescriptionVideo selected_contract_type='rise_fall' />;
        case TRADE_TYPES.MATCH_DIFF:
            return <ContractTypeDescriptionVideo selected_contract_type={selected_contract_type} />;
        case TRADE_TYPES.MULTIPLIER:
            return <ContractTypeDescriptionVideo selected_contract_type={selected_contract_type} />;
        case TRADE_TYPES.OVER_UNDER:
            return <ContractTypeDescriptionVideo selected_contract_type={selected_contract_type} />;
        case TRADE_TYPES.RESET:
            return <ImageReset />;
        case TRADE_TYPES.RUN_HIGH_LOW:
            return <ImageRunHighLow />;
        case TRADE_TYPES.ACCUMULATOR:
            return <ContractTypeDescriptionVideo selected_contract_type={selected_contract_type} />;
        case TRADE_TYPES.TICK_HIGH_LOW:
            return <ImageTickHighLow />;
        case TRADE_TYPES.TOUCH:
            return <ContractTypeDescriptionVideo selected_contract_type={selected_contract_type} />;
        case TRADE_TYPES.TURBOS.LONG:
        case TRADE_TYPES.TURBOS.SHORT:
            return <ImageTurbos />;
        case TRADE_TYPES.VANILLA.CALL:
        case TRADE_TYPES.VANILLA.PUT:
            return <ContractTypeDescriptionVideo selected_contract_type='vanilla' />;
        default:
            return null;
    }
};

export default TradeCategoriesGIF;
