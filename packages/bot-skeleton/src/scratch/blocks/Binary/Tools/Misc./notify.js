import { localize } from '@deriv/translations';
import { emptyTextValidator } from '../../../../utils';
import { config } from '../../../../../constants/config';
import { message_types } from '../../../../../constants/messages';

Blockly.Blocks.notify = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Notify %1 with sound: %2 %3'),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'NOTIFICATION_TYPE',
                    options: config.lists.NOTIFICATION_TYPE,
                },
                {
                    type: 'field_dropdown',
                    name: 'NOTIFICATION_SOUND',
                    options: config.lists.NOTIFICATION_SOUND,
                },
                {
                    type: 'input_value',
                    name: 'MESSAGE',
                    check: null,
                },
            ],
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Displays a notification and optionally play selected sound'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Notify'),
            description: localize(
                'This block displays a message. You can specify the color of the message and choose from 6 different sound options.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            MESSAGE: emptyTextValidator,
        };
    },
};

Blockly.JavaScript.notify = block => {
    const notificationType = block.getFieldValue('NOTIFICATION_TYPE');
    const sound = block.getFieldValue('NOTIFICATION_SOUND');
    const message_block = block.getInputTargetBlock('MESSAGE');
    let variable_name = null;

    if (message_block.type === 'variables_get') {
        const variable_id = message_block.getFieldValue('VAR');
        variable_name = Blockly.derivWorkspace.getVariableById(variable_id).name;
    }

    const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE') || `"${localize('<empty message>')}"`;
    const code = `Bot.notify({ 
        className: 'journal__text--${notificationType}', 
        message: ${message}, 
        sound: '${sound}', 
        block_id: '${block.id}', 
        variable_name: '${variable_name}',
        message_type: '${message_types.NOTIFY}',
    });\n`;
    return code;
};
