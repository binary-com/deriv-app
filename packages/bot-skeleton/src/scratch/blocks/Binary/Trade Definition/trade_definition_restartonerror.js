import { localize } from '@deriv/translations';

Blockly.Blocks.trade_definition_restartonerror = {
    init() {
        this.jsonInit({
            message0: localize('Restart last trade on error (bot ignores the unsuccessful trade): {{ checkbox }}', {
                checkbox: '%1',
            }),
            args0: [
                {
                    type: 'field_checkbox',
                    name: 'RESTARTONERROR',
                    checked: true,
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
        });

        this.setNextStatement(false);
        this.setMovable(false);
        this.setDeletable(false);
        this.inputList.forEach(input_list => {
            input_list.fieldRow.forEach(fieldRow => {
                setTimeout(() => {
                    if (fieldRow?.borderRect_) {
                        Blockly.utils.dom.addClass(fieldRow?.borderRect_, 'blocklyCheckbox');
                    }
                }, 0);
            });
        });
    },
    onchange(/* event */) {
        if (!this.workspace || Blockly.derivWorkspace.isFlyout_ || this.workspace.isDragging()) {
            return;
        }

        this.enforceLimitations();
    },
    enforceLimitations: Blockly.Blocks.trade_definition_market.enforceLimitations,
    required_inputs: ['RESTARTONERROR'],
};

Blockly.JavaScript.javascriptGenerator.forBlock.trade_definition_restartonerror = () => {};
