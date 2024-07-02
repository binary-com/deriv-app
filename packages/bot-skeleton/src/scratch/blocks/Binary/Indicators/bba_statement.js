import { localize } from '@deriv/translations';
import { config } from '../../../../constants/config';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.bba_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['input_list', 'period', 'std_dev_multiplier_up', 'std_dev_multiplier_down'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Bollinger Bands Array {{ band_type }} {{ dummy }}', {
                variable: '%1',
                band_type: '%2',
                dummy: '%3',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'bba',
                },
                {
                    type: 'field_dropdown',
                    name: 'BBRESULT_LIST',
                    options: config.bbResult,
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'STATEMENT',
                    check: null,
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Calculates Bollinger Bands (BB) list from a list with a period'),
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Bollinger Bands Array (BBA)'),
            description: localize(
                'Similar to BB. This block gives you a choice of returning the values of either the lower band, higher band, or the SMA line in the middle.'
            ),
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    onchange: Blockly.Blocks.bb_statement.onchange,
};

Blockly.JavaScript.javascriptGenerator.forBlock.bba_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.CATEGORY_NAME
    );
    const bb_result = block.getFieldValue('BBRESULT_LIST');
    const input = block.childValueToCode('input_list', 'INPUT_LIST');
    const period = block.childValueToCode('period', 'PERIOD');
    const std_dev_up = block.childValueToCode('std_dev_multiplier_up', 'UPMULTIPLIER');
    const std_dev_down = block.childValueToCode('std_dev_multiplier_down', 'DOWNMULTIPLIER');
    const code = `${var_name} = Bot.bba(${input}, { 
        periods: ${period}, 
        stdDevUp: ${std_dev_up}, 
        stdDevDown: ${std_dev_down} 
    }, ${bb_result});\n`;

    return code;
};
