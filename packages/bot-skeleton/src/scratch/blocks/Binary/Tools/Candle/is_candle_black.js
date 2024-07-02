import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../../utils';

Blockly.Blocks.is_candle_black = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Is candle {{ input_candle }} black?', { input_candle: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'OHLCOBJ',
                    check: 'Candle',
                },
            ],
            output: 'Boolean',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns "True" if the given candle is black'),
            category: Blockly.Categories.Candle,
        };
    },
    meta() {
        return {
            display_name: localize('Is candle black?'),
            description: localize(
                'This block returns “True” if the last candle is black. It can be placed anywhere on the canvas except within the Trade parameters root block.'
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
            OHLCOBJ: null,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.is_candle_black = block => {
    const ohlcObj =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'OHLCOBJ',
            Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '{}';

    const code = `Bot.isCandleBlack(${ohlcObj})`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
