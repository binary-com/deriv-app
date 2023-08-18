import { localize } from '@deriv/translations';

const generateErrorMessage = (blockType, missing_space = 'workspace') => {
    return {
        missing: localize(`The ${blockType} block is missing from ${missing_space}.`),
        misplaced: localize(`The ${blockType} block is misplaced from ${missing_space}.`),
        default: localize(`The ${blockType} block is mandatory and cannot be deleted.`),
    };
};

export const error_message_map = {
    trade_definition: generateErrorMessage(localize('Trade parameters')),
    trade_parameters: generateErrorMessage(localize('Trade parameters')),
    before_purchase: generateErrorMessage(localize('Purchase conditions')),
    purchase_conditions: generateErrorMessage(localize('Purchase conditions')),
    purchase: generateErrorMessage(localize('Purchase'), localize('purchase conditions')),
    trade_definition_tradeoptions: generateErrorMessage(localize('Trade options'), localize('trade parameters')),
    trade_definition_multiplier: generateErrorMessage(
        localize('Trade options multipliers'),
        localize('trade parameters')
    ),
};
