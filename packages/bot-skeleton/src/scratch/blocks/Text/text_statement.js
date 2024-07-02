import { localize } from '@deriv/translations';
import { minusIconDark } from '../images';
import { runIrreversibleEvents, modifyContextMenu } from '../../utils';

Blockly.Blocks.text_statement = {
    required_parent_type: 'text_join',
    init() {
        this.required_parent_id = '';
        const field_image = new Blockly.FieldImage(minusIconDark, 25, 25, '', this.onIconClick.bind(this));
        this.jsonInit(this.definition());
        this.appendDummyInput('REMOVE_ICON').appendField(field_image);
    },
    definition() {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Text,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    meta() {
        return {
            display_name: localize('Text Statement'),
            description: '',
        };
    },
    onchange(event) {
        if (!this.workspace || Blockly.derivWorkspace.isFlyout_ || this.workspace.isDragging()) {
            return;
        }

        const surround_parent = this.getSurroundParent();

        if (event.type === Blockly.Events.BLOCK_CREATE) {
            this.setMovable(true);
            if (!this.required_parent_id && surround_parent?.type === this.required_parent_type) {
                this.required_parent_id = surround_parent.id;
            }
        }

        if (event.type === Blockly.Events.BLOCK_DRAG && !event.isStart) {
            const stack_blocks = Blockly.getMainWorkspace().getBlockById(event.blockId);

            if (this.required_parent_id && (!surround_parent || surround_parent.id !== this.required_parent_id)) {
                const original_parent = Blockly.getMainWorkspace().getBlockById(this.required_parent_id);

                if (original_parent) {
                    const first_block_in_stack = original_parent.getInputTargetBlock('STACK');

                    if (first_block_in_stack) {
                        const last_connection = original_parent.getLastConnectionInStatement('STACK');
                        runIrreversibleEvents(() => {
                            last_connection.connect(this.previousConnection);
                        });
                    } else {
                        runIrreversibleEvents(() => {
                            original_parent.getInput('STACK').connection.connect(stack_blocks.previousConnection);
                        });
                    }
                }
            }
        }
    },
    onIconClick: Blockly.Blocks.lists_statement.onIconClick,
};

Blockly.JavaScript.javascriptGenerator.forBlock.text_statement = block => {
    const code = `String(${Blockly.JavaScript.javascriptGenerator.valueToCode(
        block,
        'TEXT',
        Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
    )})`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
