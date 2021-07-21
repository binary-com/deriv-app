import { localize } from '@deriv/translations';

Blockly.Blocks.atra_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['candle_list', 'period'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Average True Range Array {{ dummy }}', {
                variable: '%1',
                dummy: '%2',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'atra',
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
            tooltip: localize('Average True Range Array indicator'),
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Average True Range Array (ATRA)'),
            description: localize('Average True Range Array indicator description text'),
        };
    },
    onchange: Blockly.Blocks.bb_statement.onchange,
};

Blockly.JavaScript.atra_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );
    const candle = block.childValueToCode('candle_list', 'CANDLE_LIST');
    const period = block.childValueToCode('period', 'PERIOD');
    const code = `${var_name} = Bot.atra(${candle}, ${period});\n`;

    return code;
};
