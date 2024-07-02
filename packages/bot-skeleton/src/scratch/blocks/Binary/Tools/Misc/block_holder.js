import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../../utils';

Blockly.Blocks.block_holder = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1 %2 %3',
            args0: [
                {
                    type: 'field_label',
                    text: 'Ignore',
                    class: 'blocklyTextRootBlockHeader',
                },
                {
                    type: 'input_dummy',
                },
                {
                    type: 'input_statement',
                    name: 'USELESS_STACK',
                    check: null,
                },
            ],
            colour: Blockly.Colours.RootBlock.colour,
            colourSecondary: Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary: Blockly.Colours.RootBlock.colourTertiary,
            tooltip: localize('Put your blocks in here to prevent them from being removed'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    meta() {
        return {
            display_name: localize('Ignore'),
            description: localize(
                'Use this block if you want some instructions to be ignored when your bot runs. Instructions within this block won’t be executed.'
            ),
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.block_holder = () => '';
