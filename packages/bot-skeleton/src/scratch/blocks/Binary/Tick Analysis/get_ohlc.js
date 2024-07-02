import { localize } from '@deriv/translations';
import { config } from '../../../../constants/config';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.get_ohlc = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('in candle list get # from end {{ input_number }}', { input_number: '%1' }),
            message1: localize('with interval: {{ candle_interval_type }}', { candle_interval_type: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'CANDLEINDEX',
                    check: 'Number',
                },
            ],
            args1: [
                {
                    type: 'field_dropdown',
                    name: 'CANDLEINTERVAL_LIST',
                    options: config.candleIntervals,
                },
            ],
            output: 'Candle',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block gives you a specific candle from within the selected time interval.'),
            category: Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            display_name: localize('Get candle'),
            description: localize('This block gives you a specific candle from within the selected time interval.'),
        };
    },
    getRequiredValueInputs() {
        return {
            CANDLEINDEX: null,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};
Blockly.JavaScript.javascriptGenerator.forBlock.get_ohlc = block => {
    const selectedGranularity = block.getFieldValue('CANDLEINTERVAL_LIST');
    const granularity = selectedGranularity === 'default' ? 'undefined' : selectedGranularity;
    const index =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'CANDLEINDEX',
            Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '1';

    const code = `Bot.getOhlcFromEnd({ index: ${index}, granularity: ${granularity} })`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
