import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../../utils';

Blockly.Blocks.timeout = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('{{ dummy }} {{ stack_input }} Run after {{ number }} second(s)', {
                dummy: '%1',
                stack_input: '%2',
                number: '%3',
            }),
            args0: [
                {
                    type: 'input_dummy',
                },
                {
                    type: 'input_statement',
                    name: 'TIMEOUTSTACK',
                },
                {
                    type: 'input_value',
                    name: 'SECONDS',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Run the blocks inside after a given number of seconds'),
            category: Blockly.Categories.Time,
        };
    },
    meta() {
        return {
            display_name: localize('Delayed run'),
            description: localize(
                'This block delays execution for a given number of seconds. You can place any blocks within this block. The execution of other blocks in your strategy will be paused until the instructions in this block are carried out.'
            ),
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    getRequiredValueInputs() {
        return {
            SECONDS: null,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.timeout = block => {
    const stack = Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'TIMEOUTSTACK');
    const seconds =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'SECONDS',
            Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '1';

    const code = `sleep(${seconds});\n${stack}\n`;
    return code;
};
