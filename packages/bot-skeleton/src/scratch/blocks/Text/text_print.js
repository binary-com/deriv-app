import { localize } from '@deriv/translations';
import { emptyTextValidator, modifyContextMenu } from '../../utils';

Blockly.Blocks.text_print = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('print {{ input_text }}', { input_text: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Displays a dialog window with a message'),
            category: Blockly.Categories.Text,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    meta() {
        return {
            display_name: localize('Print'),
            description: localize(
                'This block displays a dialog box with a customised message. When the dialog box is displayed, your strategy is paused and will only resume after you click "OK".'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            TEXT: emptyTextValidator,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.text_print = block => {
    const msg =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TEXT',
            Blockly.JavaScript.javascriptGenerator.ORDER_NONE
        ) || "''";
    const code = `window.alert(${msg});\n`;
    return code;
};
