import { localize } from '@deriv/translations';
import { config } from '../../../../constants/config';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.contract_check_result = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Result is {{ win_or_loss }}', { win_or_loss: '%1' }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'CHECK_RESULT',
                    options: config.lists.CHECK_RESULT,
                },
            ],
            output: 'Boolean',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('True if the result of the last trade matches the selection'),
            category: Blockly.Categories.After_Purchase,
        };
    },
    meta() {
        return {
            display_name: localize('Last trade result'),
            description: localize('You can check the result of the last trade with this block.'),
        };
    },
    onchange(event) {
        if (!this.workspace || Blockly.derivWorkspace.isFlyout_ || this.workspace.isDragging()) {
            return;
        }

        if (
            event.type === Blockly.Events.BLOCK_CREATE ||
            (event.type === Blockly.Events.BLOCK_DRAG && !event.isStart)
        ) {
            const top_parent = this.getTopParent();

            if (top_parent) {
                const is_illegal_root_block = top_parent.isMainBlock() && top_parent.type !== 'after_purchase';

                if (is_illegal_root_block) {
                    this.setDisabled(true);
                }
            }
        }
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.contract_check_result = block => {
    const checkWith = block.getFieldValue('CHECK_RESULT');

    const code = `Bot.isResult('${checkWith}')`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
