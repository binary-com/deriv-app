import { localize } from '@deriv/translations';
import { emptyTextValidator } from '../../../utils';

Blockly.Blocks.lists_repeat = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('create list with item {{ input_item }} repeated {{ number }} times', {
                input_item: '%1',
                number: '%2',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'ITEM',
                },
                {
                    type: 'input_value',
                    name: 'NUM',
                },
            ],
            inputsInline: true,
            output: null,
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Creates a list by repeating a given item'),
            category: Blockly.Categories.List,
        };
    },
    meta() {
        return {
            display_name: localize('Repeat an item'),
            description: localize('Creates a list with a given item repeated for a specific number of times.'),
        };
    },
    getRequiredValueInputs() {
        return {
            ITEM: emptyTextValidator,
            NUM: emptyTextValidator,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.lists_repeat = block => {
    // eslint-disable-next-line no-underscore-dangle
    const function_name = Blockly.JavaScript.javascriptGenerator.provideFunction_('listsRepeat', [
        // eslint-disable-next-line no-underscore-dangle
        `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(value, n) {
            var array = [];
            for (var i = 0; i < n; i++) {
                array[i] = value;
            }
            return array;
        }`,
    ]);

    const element =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'ITEM',
            Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || 'null';
    const repeat_count =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'NUM',
            Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || '0';
    const code = `${function_name}(${element}, ${repeat_count})`;

    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
