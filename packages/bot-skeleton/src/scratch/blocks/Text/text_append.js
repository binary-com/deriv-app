import { localize } from '@deriv/translations';
import { emptyTextValidator, modifyContextMenu } from '../../utils';

Blockly.Blocks.text_append = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('to {{ variable }} append text {{ input_text }}', {
                variable: '%1',
                input_text: '%2',
            }),
            args0: [
                {
                    type: 'field_variable',
                    name: 'VAR',
                    variable: localize('text'),
                },
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Appends a given text to a variable'),
            category: Blockly.Categories.Text,
        };
    },
    meta() {
        return {
            display_name: localize('Text Append'),
            description: localize('Appends a given text to a variable.'),
        };
    },
    getRequiredValueInputs() {
        return {
            TEXT: emptyTextValidator,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.text_append = block => {
    const forceString = value => {
        const strRegExp = /^\s*'([^']|\\')*'\s*$/;
        if (strRegExp.test(value)) {
            return value;
        }
        return `String(${value})`;
    };

    // eslint-disable-next-line no-underscore-dangle
    const varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.CATEGORY_NAME);
    const value =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TEXT',
            Blockly.JavaScript.javascriptGenerator.ORDER_NONE
        ) || "''";

    const code = `${varName} += ${forceString(value)};\n`;
    return code;
};
