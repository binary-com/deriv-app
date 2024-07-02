import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../../utils';

Blockly.Blocks.fast_ema_period = {
    init() {
        this.jsonInit({
            message0: localize('Fast EMA Period {{ input_number }}', { input_number: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'FAST_EMA_PERIOD',
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
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    onchange: Blockly.Blocks.input_list.onchange,
    allowed_parents: ['macda_statement'],
    getRequiredValueInputs() {
        return {
            FAST_EMA_PERIOD: null,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.fast_ema_period = () => {};
