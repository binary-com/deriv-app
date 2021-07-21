import { localize } from '@deriv/translations';

Blockly.Blocks.d_period = {
    init() {
        this.jsonInit({
            message0: localize('D Period %1'),
            args0: [
                {
                    type: 'input_value',
                    name: 'D_PERIOD',
                    check: null,
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
    },
    onchange: Blockly.Blocks.input_list.onchange,
    allowed_parents: ['so_statement', 'soa_statement'],
    getRequiredValueInputs() {
        return {
            D_PERIOD: null,
        };
    },
};

Blockly.JavaScript.d_period = () => {};
