import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../../utils';

Blockly.Blocks.todatetime = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('To date/time {{ input_timestamp }} {{ dummy }}', {
                input_timestamp: '%1',
                dummy: '%2',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'TIMESTAMP',
                    check: 'Number',
                },
                {
                    // Extra dummy for spacing.
                    type: 'input_dummy',
                },
            ],
            output: 'String',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize(
                'This block converts the number of seconds since the Unix Epoch (1 January 1970) into a string of text representing the date and time.'
            ),
            category: Blockly.Categories.Time,
        };
    },
    meta() {
        return {
            display_name: localize('Convert to date/time'),
            description: localize(
                'This block converts the number of seconds since the Unix Epoch (1 January 1970) into a string of text representing the date and time.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            TIMESTAMP: null,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.todatetime = block => {
    const timestamp = Blockly.JavaScript.javascriptGenerator.valueToCode(
        block,
        'TIMESTAMP',
        Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
    );
    const invalid_timestamp = `${localize('Invalid timestamp')}:`;

    // eslint-disable-next-line no-underscore-dangle
    const function_name = Blockly.JavaScript.javascriptGenerator.provideFunction_('timestampToDateString', [
        // eslint-disable-next-line no-underscore-dangle
        `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(timestamp) {
            var datetime = new Date(timestamp * 1000);

            if (!datetime.getTime()) {
                return "${invalid_timestamp} " + timestamp;
            }

            var getTwoDigitValue = function(input) {
                return input < 10 ? '0' + input : input;
            }

            var year    = datetime.getFullYear();
            var month   = getTwoDigitValue(datetime.getMonth() + 1);
            var day     = getTwoDigitValue(datetime.getDate());
            var hours   = getTwoDigitValue(datetime.getHours());
            var minutes = getTwoDigitValue(datetime.getMinutes());
            var seconds = getTwoDigitValue(datetime.getSeconds());

            var formatGmtOffset = function() {
                var gmt_offset_raw = datetime.getTimezoneOffset();
                var sign           = gmt_offset_raw > 0 ? '-' : '+';
                var gmt_offset     = Math.abs(gmt_offset_raw);
                var hour           = Math.floor(gmt_offset / 60);
                var minute         = gmt_offset - hour * 60;

                return 'GMT' + sign + getTwoDigitValue(hour) + getTwoDigitValue(minute);
            }

            var date_string = year + '-' + month + '-' + day;
            var time_string = hours + ':' + minutes + ':' + seconds;

            return date_string + ' ' + time_string + ' ' + formatGmtOffset();
        }`,
    ]);

    const code = `${function_name}(${timestamp})`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
