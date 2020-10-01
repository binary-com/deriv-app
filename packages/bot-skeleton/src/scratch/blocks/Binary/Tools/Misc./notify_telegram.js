import { localize } from '@deriv/translations';
import { emptyTextValidator } from '../../../../utils';

Blockly.Blocks.notify_telegram = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'Notify Telegram {{ dummy }} Access Token: {{ input_access_token }} Chat ID: {{ input_chat_id }} Message: {{ input_message }}',
                {
                    dummy: '%1',
                    input_access_token: '%2',
                    input_chat_id: '%3',
                    input_message: '%4',
                }
            ),
            args0: [
                {
                    type: 'input_dummy',
                },
                {
                    type: 'input_value',
                    name: 'TELEGRAM_ACCESS_TOKEN',
                },
                {
                    type: 'input_value',
                    name: 'TELEGRAM_CHAT_ID',
                },
                {
                    type: 'input_value',
                    name: 'TELEGRAM_MESSAGE',
                },
            ],
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Sends a message to Telegram'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Notify Telegram'),
            description: localize('This block sends a message to a Telegram channel.'),
        };
    },
    getRequiredValueInputs() {
        return {
            TELEGRAM_ACCESS_TOKEN: emptyTextValidator,
            TELEGRAM_CHAT_ID: emptyTextValidator,
            TELEGRAM_MESSAGE: emptyTextValidator,
        };
    },
};

Blockly.JavaScript.notify_telegram = (block) => {
    const access_token =
        Blockly.JavaScript.valueToCode(block, 'TELEGRAM_ACCESS_TOKEN', Blockly.JavaScript.ORDER_ATOMIC) || '';
    const chat_id = Blockly.JavaScript.valueToCode(block, 'TELEGRAM_CHAT_ID', Blockly.JavaScript.ORDER_ATOMIC) || '';
    const message = Blockly.JavaScript.valueToCode(block, 'TELEGRAM_MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || '';

    if (!access_token || !chat_id || !message) {
        return '';
    }

    const code = `Bot.notifyTelegram(${access_token}, ${chat_id}, ${message});\n`;
    return code;
};
