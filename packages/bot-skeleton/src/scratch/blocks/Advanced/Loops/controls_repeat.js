import { localize } from '@deriv/translations';

Blockly.Blocks.controls_repeat = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            type: 'controls_repeat',
            message0: localize('repeat {{ number }} times', { number: '%1' }),
            args0: [
                {
                    type: 'field_number',
                    name: 'TIMES',
                    value: 10,
                    min: 0,
                    precision: 1,
                },
            ],
            message1: localize('do %1'),
            args1: [
                {
                    type: 'input_statement',
                    name: 'DO',
                },
            ],
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            inputsInline: true,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Repeats inside instructions specified number of times'),
            category: Blockly.Categories.Loop,
        };
    },
    meta() {
        return {
            display_name: localize('Repeat (1)'),
            description: localize(
                'This block repeats the instructions contained within for a specific number of times.'
            ),
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.controls_repeat =
    Blockly.JavaScript.javascriptGenerator.forBlock.controls_repeat_ext;
