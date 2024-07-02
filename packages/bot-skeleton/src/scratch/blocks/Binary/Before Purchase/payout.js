import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.payout = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Payout {{ contract_type }}', { contract_type: '%1' }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'PURCHASE_LIST',
                    options: [['', '']],
                },
            ],
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block returns the potential payout for the selected trade type'),
            category: Blockly.Categories.Before_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Potential payout'),
            description: localize(
                'This block returns the potential payout for the selected trade type. This block can be used only in the "Purchase conditions" root block.'
            ),
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    onchange: Blockly.Blocks.purchase.onchange,
    populatePurchaseList: Blockly.Blocks.purchase.populatePurchaseList,
    enforceLimitations: Blockly.Blocks.purchase.enforceLimitations,
};

Blockly.JavaScript.javascriptGenerator.forBlock.payout = block => {
    const purchaseList = block.getFieldValue('PURCHASE_LIST');

    const code = `Bot.getPayout('${purchaseList}')`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
