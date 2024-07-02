import { localize } from '@deriv/translations';

Blockly.Blocks.trade_definition_restartbuysell = {
    init() {
        this.jsonInit({
            message0: localize('Restart buy/sell on error (disable for better performance): {{ checkbox }}', {
                checkbox: '%1',
            }),
            args0: [
                {
                    type: 'field_checkbox',
                    name: 'TIME_MACHINE_ENABLED',
                    checked: false,
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
        });

        this.setMovable(false);
        this.setDeletable(false);
        this.setOnChange(() => {
            const next_block = this?.getNextBlock();
            if (next_block?.type !== 'trade_definition_restartonerror') {
                next_block?.unplug(true);
            }
        });
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
    required_inputs: ['TIME_MACHINE_ENABLED'],
};
Blockly.JavaScript.javascriptGenerator.forBlock.trade_definition_restartbuysell = () => {};
