import { localize } from '@deriv/translations';
import { config } from '../../../../constants/config';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.read_details = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Contract Details: {{ contract_detail }}', { contract_detail: '%1' }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'DETAIL_INDEX',
                    options: config.lists.DETAILS,
                },
            ],
            output: null,
            outputShape: Blockly.OUTPUT_SHAPE_ROUND, // TODO: Investigate why block glitches in square shape.
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Reads a selected property from contract details list'),
            category: Blockly.Categories.After_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Contract details'),
            description: localize('This block gives you information about your last contract.'),
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    restricted_parents: ['after_purchase'],
};

Blockly.JavaScript.javascriptGenerator.forBlock.read_details = block => {
    const detailIndex = block.getFieldValue('DETAIL_INDEX');

    const code = `Bot.readDetails(${detailIndex})`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
