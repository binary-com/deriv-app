import { localize } from '@deriv/translations';
import { emptyTextValidator, modifyContextMenu } from '../../../../utils';

Blockly.Blocks.totimestamp = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('To timestamp {{ input_datetime }} {{ dummy }}', { input_datetime: '%1', dummy: '%2' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'DATETIME',
                },
                {
                    // Extra dummy for spacing.
                    type: 'input_dummy',
                },
            ],
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize(
                'Converts a string representing a date/time string into seconds since Epoch. Example: 2019-01-01 21:03:45 GMT+0800 will be converted to 1546347825. Time and time zone offset are optional.'
            ),
            category: Blockly.Categories.Time,
        };
    },
    meta() {
        return {
            display_name: localize('Convert to timestamp'),
            description: localize(
                'This block converts a string of text that represents the date and time into seconds since the Unix Epoch (1 January 1970). The time and time zone offset are optional. Example: 2019-01-01 21:03:45 GMT+0800 will be converted to 1546347825.'
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
            DATETIME: emptyTextValidator,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.totimestamp = block => {
    const datetime_string = Blockly.JavaScript.javascriptGenerator.valueToCode(
        block,
        'DATETIME',
        Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
    );
    const code = `Bot.dateTimeStringToTimestamp(${datetime_string})`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
