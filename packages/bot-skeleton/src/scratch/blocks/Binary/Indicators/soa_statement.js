import { localize } from '@deriv/translations';
import { config } from '../../../../constants/config';

Blockly.Blocks.soa_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['candle_list', 'k_period', 'k_slowing_period', 'd_period'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Stochastic Oscillator Array {{ list }} {{ dummy }}', {
                variable: '%1',
                list: '%2',
                dummy: '%3',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'soa',
                },
                {
                    type: 'field_dropdown',
                    name: 'STOCHASTIC_OSCILLATOR_PERIOD',
                    options: config.stochasticOscillatorPeriod,
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
            tooltip: localize('Stochastic Oscillator Array'),
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Stochastic Oscillator Array'),
            description: localize('Stochastic Oscillator Array indicator description text'),
        };
    },
    onchange: Blockly.Blocks.bb_statement.onchange,
};

Blockly.JavaScript.soa_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );
    const so_result = block.getFieldValue('STOCHASTIC_OSCILLATOR_PERIOD');
    const candle = block.childValueToCode('candle_list', 'CANDLE_LIST');
    const k_period = block.childValueToCode('k_period', 'K_PERIOD');
    const k_slowing_period = block.childValueToCode('k_slowing_period', 'K_SLOWING_PERIOD');
    const d_period = block.childValueToCode('d_period', 'D_PERIOD');
    const code = `${var_name} = Bot.soa(${candle}, {k_period: ${k_period}, k_slowing_period: ${k_slowing_period}, d_period: ${d_period}, type: ${so_result}});\n`;

    return code;
};
