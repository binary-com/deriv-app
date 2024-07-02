import { localize } from '@deriv/translations';
import { config } from '../../../../constants/config';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.macda_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['input_list', 'fast_ema_period', 'slow_ema_period', 'signal_ema_period'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to MACD Array {{ dropdown }} {{ dummy }}', {
                variable: '%1',
                dropdown: '%2',
                dummy: '%3',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'macda',
                },
                {
                    type: 'field_dropdown',
                    name: 'MACDFIELDS_LIST',
                    options: config.macdFields,
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
            tooltip: localize('Calculates Moving Average Convergence Divergence (MACD) from a list'),
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Indicators,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    meta() {
        return {
            display_name: localize('Moving Average Convergence Divergence'),
            description: localize(
                'MACD is calculated by subtracting the long-term EMA (26 periods) from the short-term EMA (12 periods). If the short-term EMA is greater or lower than the long-term EMA than there’s a possibility of a trend reversal.'
            ),
        };
    },

    onchange: Blockly.Blocks.bb_statement.onchange,
};

Blockly.JavaScript.javascriptGenerator.forBlock.macda_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.CATEGORY_NAME
    );
    const macd_field = block.getFieldValue('MACDFIELDS_LIST');
    const input = block.childValueToCode('input_list', 'INPUT_LIST');
    const fast_ema_period = block.childValueToCode('fast_ema_period', 'FAST_EMA_PERIOD');
    const slow_ema_period = block.childValueToCode('slow_ema_period', 'SLOW_EMA_PERIOD');
    const signal_ema_period = block.childValueToCode('signal_ema_period', 'SIGNAL_EMA_PERIOD');
    const code = `${var_name} = Bot.macda(${input}, { 
        fastEmaPeriod: ${fast_ema_period},
        slowEmaPeriod: ${slow_ema_period},
        signalEmaPeriod: ${signal_ema_period},
    }, ${macd_field});\n`;

    return code;
};
