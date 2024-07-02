import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../../utils';

Blockly.Blocks.std_dev_multiplier_down = {
    init() {
        this.jsonInit({
            message0: localize('Standard Deviation Down Multiplier {{ input_number }}', { input_number: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'DOWNMULTIPLIER',
                    check: null,
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
        });

        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange: Blockly.Blocks.input_list.onchange,
    allowed_parents: ['bb_statement', 'bba_statement'],
    getRequiredValueInputs() {
        return {
            DOWNMULTIPLIER: null,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.std_dev_multiplier_down = () => {};
