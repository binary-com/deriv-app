import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../../utils';

Blockly.Blocks.total_profit = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Total profit/loss'),
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the total profit/loss'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Total profit/loss'),
            description: localize(
                'This block gives you the total profit/loss of your trading strategy since your bot started running. You can reset this by clicking “Clear stats” on the Transaction Stats window, or by refreshing this page in your browser.'
            ),
        };
    },
    onchange(event) {
        if (!this.workspace || Blockly.derivWorkspace.isFlyout_ || this.workspace.isDragging()) {
            return;
        }

        if (
            (event.type === Blockly.Events.BLOCK_DRAG && !event.isStart) ||
            (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id))
        ) {
            const input_statement = this.getRootInputTargetBlock();

            if (input_statement === 'INITIALIZATION') {
                this.unplug(true);
            }
        }
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.Blocks.total_profit_string = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Total Profit String'),
            output: 'String',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the total profit in string format'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Total Profit String'),
            description: localize('Total Profit String Description'),
        };
    },
    onchange: Blockly.Blocks.total_profit.onchange,
};

Blockly.JavaScript.javascriptGenerator.forBlock.total_profit = () => [
    'Bot.getTotalProfit(false)',
    Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC,
];
Blockly.JavaScript.javascriptGenerator.forBlock.total_profit_string = () => [
    'Bot.getTotalProfit(true)',
    Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC,
];
