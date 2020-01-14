import { localize } from '@deriv/translations';

Blockly.Blocks.math_random_float = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0       : localize('random fraction'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : localize('This block gives you a random fraction between 0.0 to 1.0'),
            category       : Blockly.Categories.Mathematical,
        };
    },
    meta(){
        return {
            'display_name': localize('Random fraction number'),
            'description' : localize('This block gives you a random fraction between 0.0 to 1.0.'),
        };
    },
};

Blockly.JavaScript.math_random_float = () => ['Math.random()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
