import { localize } from '@deriv/translations';
import { config } from '../../../../constants/config';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.bb_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['input_list', 'period', 'std_dev_multiplier_up', 'std_dev_multiplier_down'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Bollinger Bands {{ band_type }} {{ dummy }}', {
                variable: '%1',
                band_type: '%2',
                dummy: '%3',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'bb',
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
            tooltip: localize('Calculates Bollinger Bands (BB) from a list with a period'),
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Bollinger Bands (BB)'),
            description: localize(
                'BB is a technical analysis indicator that’s commonly used by traders. The idea behind BB is that the market price stays within the upper and lower bands for 95% of the time. The bands are the standard deviations of the market price, while the line in the middle is a simple moving average line. If the price reaches either the upper or lower band, there’s a possibility of a trend reversal.'
            ),
        };
    },
    onchange(event) {
        if (!this.workspace || Blockly.derivWorkspace.isFlyout_ || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_DRAG && !event.isStart) {
            const blocksInStatement = this.getBlocksInStatement('STATEMENT');
            blocksInStatement.forEach(block => {
                if (!this.required_child_blocks.includes(block.type)) {
                    Blockly.Events.disable();
                    block.unplug(false);
                    Blockly.Events.enable();
                }
            });
        }
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.bb_statement = block => {
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
    const code = `${var_name} = Bot.bb(${input}, { 
        periods: ${period}, 
        stdDevUp: ${std_dev_up}, 
        stdDevDown: ${std_dev_down} 
    }, ${bb_result});\n`;

    return code;
};
