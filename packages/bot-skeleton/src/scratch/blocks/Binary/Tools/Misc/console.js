import { localize } from '@deriv/translations';
import { emptyTextValidator , modifyContextMenu } from '../../../../utils';

Blockly.Blocks.console = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Console {{ message_type }} value: {{ input_message }}', {
                message_type: '%1',
                input_message: '%2',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'CONSOLE_TYPE',
                    options: [
                        [localize('Log'), 'log'],
                        [localize('Warn'), 'warn'],
                        [localize('Error'), 'error'],
                        [localize('Table'), 'table'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'MESSAGE',
                    check: null,
                },
            ],
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Display messages in the developer’s console.'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Console'),
            description: localize(
                "This block displays messages in the developer's console with an input that can be either a string of text, a number, boolean, or an array of data."
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            MESSAGE: emptyTextValidator,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.console = block => {
    const console_type = block.getFieldValue('CONSOLE_TYPE') || 'log';
    const message =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'MESSAGE',
            Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || `"${localize('<empty message>')}"`;

    const code = `Bot.console({ type: '${console_type}', message: ${message}});\n`;
    return code;
};
