import { localize } from '@deriv/translations';
import { emptyTextValidator, modifyContextMenu } from '../../utils';

Blockly.Blocks.text_prompt_ext = {
    init() {
        this.jsonInit(this.definition());
        const typeField = this.getField('TYPE');
        typeField.setValidator(value => {
            if (value === 'TEXT') {
                this.setOutput(true, 'String');
            } else if (value === 'NUMBER') {
                this.setOutput(true, 'Number');
            }
            this.initSvg();
            //commented this line breaks the backward compatibility
            //this.render(false);
            return undefined;
        });
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    definition() {
        return {
            message0: localize('prompt for {{ string_or_number }} with message {{ input_text }}', {
                string_or_number: '%1',
                input_text: '%2',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'TYPE',
                    options: [
                        [localize('string'), 'TEXT'],
                        [localize('number'), 'NUMBER'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            output:
                typeof this.getFieldValue === 'function' && this.getFieldValue('TYPE') === 'TEXT' ? 'String' : 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            tooltip: localize('Request an input'),
            category: Blockly.Categories.Text,
        };
    },
    meta() {
        return {
            display_name: localize('Request an input'),
            description: localize(
                'This block displays a dialog box that uses a customised message to prompt for an input. The input can be either a string of text or a number and can be assigned to a variable. When the dialog box is displayed, your strategy is paused and will only resume after you enter a response and click "OK".'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            TEXT: emptyTextValidator,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.text_prompt_ext = block => {
    let msg, code;

    if (block.getField('TEXT')) {
        // Internal message
        // eslint-disable-next-line no-underscore-dangle
        msg = Blockly.JavaScript.javascriptGenerator.quote_(block.getFieldValue('TEXT'));
    } else {
        // External message
        msg =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'TEXT',
                Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            ) || "''";
    }

    if (block.getFieldValue('TYPE') === 'NUMBER') {
        code = `parseFloat(window.prompt(${msg}))`;
    } else {
        code = `window.prompt(${msg})`;
    }

    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
