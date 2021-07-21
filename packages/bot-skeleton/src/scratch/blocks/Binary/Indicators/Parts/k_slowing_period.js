import { localize } from '@deriv/translations';

Blockly.Blocks.k_slowing_period = {
    init() {
        this.jsonInit({
            message0: localize('K Slowing Period %1'),
            args0: [
                {
                    type: 'input_value',
                    name: 'K_SLOWING_PERIOD',
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
            K_SLOWING_PERIOD: null,
        };
    },
};

Blockly.JavaScript.k_slowing_period = () => {};
