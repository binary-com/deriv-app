import { localize } from '@deriv/translations';
import { config } from '../../../../../constants/config';
import { modifyContextMenu } from '../../../../utils';

// This block is a remnant of a very old Binary Bot version.
// needs to be here for backward compatibility.
Blockly.Blocks.barrier_offset = {
    init() {
        this.jsonInit({
            message0: '%1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'BARRIEROFFSET_IN',
                    options: config.BARRIER_TYPES,
                },
            ],
            output: null,
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Adds a sign to a number to create a barrier offset. (deprecated)'),
            category: Blockly.Categories.Miscellaneous,
        });
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.barrier_offset = () => {};
