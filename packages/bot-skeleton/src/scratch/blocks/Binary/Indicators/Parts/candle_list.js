import { localize } from '@deriv/translations';

Blockly.Blocks.candle_list = {
    init() {
        this.jsonInit({
            message0: localize('Candle List %1'),
            args0: [
                {
                    type: 'input_value',
                    name: 'CANDLE_LIST',
                    check: 'Array',
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
    allowed_parents: [
        'atr_statement',
        'atra_statement',
        'fr_statement',
        'fra_statement',
        'pc_statement',
        'pca_statement',
        'psar_statement',
        'psara_statement',
        'so_statement',
        'soa_statement',
        'wr_statement',
        'wra_statement',
    ],
    getRequiredValueInputs() {
        return {
            CANDLE_LIST: null,
        };
    },
};

Blockly.JavaScript.candle_list = () => {};
