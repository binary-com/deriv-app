import { localize } from '@deriv/translations';
import { config } from '../../../../../constants/config';
import { modifyContextMenu } from '../../../../utils';

Blockly.Blocks.read_ohlc_obj = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Read {{ candle_property }} value in candle {{ input_candle }}', {
                candle_property: '%1',
                input_candle: '%2',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'OHLCFIELD_LIST',
                    options: config.ohlcFields,
                },
                {
                    type: 'input_value',
                    name: 'OHLCOBJ',
                },
            ],
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block gives you the selected candle value.'),
            category: Blockly.Categories.Candle,
        };
    },
    meta() {
        return {
            display_name: localize('Read candle value (2)'),
            description: localize('This block gives you the selected candle value.'),
        };
    },
    getRequiredValueInputs() {
        return {
            OHLCOBJ: null,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.read_ohlc_obj = block => {
    const ohlcField = block.getFieldValue('OHLCFIELD_LIST');
    const ohlcObj =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'OHLCOBJ',
            Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '{}';

    const code = `Bot.candleField(${ohlcObj}, '${ohlcField}')`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
