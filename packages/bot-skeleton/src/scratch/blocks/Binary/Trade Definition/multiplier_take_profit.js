import { localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { config } from '../../../../constants/config';

Blockly.Blocks.multiplier_take_profit = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Take Profit: {{ currency }} {{ take_profit }}', {
                currency: '%1',
                take_profit: '%2',
            }),
            args0: [
                {
                    type: 'field_label',
                    name: 'CURRENCY_LIST',
                    text: getCurrencyDisplayCode(config.lists.CURRENCY[0]),
                },
                {
                    type: 'input_value',
                    name: 'AMOUNT',
                    check: 'Number',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize(
                'Your contract is closed automatically when your profit is more than or equals to this amount.'
            ),
            category: Blockly.Categories.Trade_Definition,
        };
    },
    meta() {
        return {
            display_name: localize('Take Profit'),
            description: localize(
                'Your contract is closed automatically when your profit is more than or equals to this amount.'
            ),
        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }
        if (
            (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) ||
            event.type === Blockly.Events.END_DRAG
        ) {
            this.setCurrency();
        }
    },
    setCurrency: Blockly.Blocks.trade_definition_tradeoptions.setCurrency,
    getRequiredValueInputs() {
        const field_input = this.getInput('AMOUNT');
        if (field_input.connection.targetBlock()) {
            return {
                AMOUNT: input => {
                    const input_number = Number(input);
                    this.error_message = localize('Take profit must be a positive number.');
                    return !isNaN(input_number) && input_number <= 0;
                },
            };
        }
        return {};
    },
};

Blockly.JavaScript.multiplier_take_profit = () => {};
