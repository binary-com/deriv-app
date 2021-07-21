import { localize } from '@deriv/translations';
import { config } from '../../../../constants/config';

Blockly.Blocks.pca_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['candle_list', 'period'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Price Channel Array {{ list }} {{ dummy }}', {
                variable: '%1',
                list: '%2',
                dummy: '%3',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'pca',
                },
                {
                    type: 'field_dropdown',
                    name: 'PRICECHANNEL_RESULT',
                    options: config.priceChannelResult,
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
            tooltip: localize('Price Channel array from a list with a period'),
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Price Channel Array (%PCA)'),
            description: localize('Return maximal and minimal prices for selected period'),
        };
    },
    onchange: Blockly.Blocks.bb_statement.onchange,
};

Blockly.JavaScript.pca_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );
    const pc_result = block.getFieldValue('PRICECHANNEL_RESULT');
    const input = block.childValueToCode('candle_list', 'CANDLE_LIST');
    const period = block.childValueToCode('period', 'PERIOD');
    const code = `${var_name} = Bot.pca(${input}, ${period}, ${pc_result});\n`;

    return code;
};
