import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.math_number_positive = {
    init: Blockly.Blocks.math_number.init,
    definition: Blockly.Blocks.math_number.definition,
    meta() {
        return {
            display_name: localize('Math Number Positive'),
            description: localize('Math Number Description'),
        };
    },
    numberValidator(input) {
        if (/^([0][.]|[0-9]+[.])?([0]|[1-9]){1,}$/.test(input) && input < Number.MAX_SAFE_INTEGER) {
            return undefined;
        }
        return null;
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.math_number_positive = block => {
    return Blockly.JavaScript.javascriptGenerator.forBlock.math_number(block);
};
