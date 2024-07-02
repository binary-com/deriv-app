import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../../utils';

Blockly.Blocks.useless_block = {
    init() {
        this.jsonInit({
            message0: '%1',
            args0: [
                {
                    type: 'field_label',
                    text: localize('Conversion Helper Block'),
                    class: 'blocklyTextRootBlockHeader',
                },
            ],
            colour: Blockly.Colours.RootBlock.colour,
            colourSecondary: Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary: Blockly.Colours.RootBlock.colourTertiary,
            tooltip: localize('This block was required to correctly convert your old strategy.'),
            category: Blockly.Categories.Miscellaneous,
            nextStatement: null,
            previousStatement: null,
        });
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.useless_block = () => {};
