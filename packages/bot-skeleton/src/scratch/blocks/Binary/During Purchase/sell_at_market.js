import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.sell_at_market = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Sell at market price'),
            colour: Blockly.Colours.Special1.colour,
            colourSecondary: Blockly.Colours.Special1.colourSecondary,
            colourTertiary: Blockly.Colours.Special1.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Use this block to sell your contract at the market price.'),
            category: Blockly.Categories.During_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Sell at market price'),
            description: localize('Use this block to sell your contract at the market price.'),
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    restricted_parents: ['during_purchase'],
};

Blockly.JavaScript.javascriptGenerator.forBlock.sell_at_market = () => 'Bot.sellAtMarket();\n';
