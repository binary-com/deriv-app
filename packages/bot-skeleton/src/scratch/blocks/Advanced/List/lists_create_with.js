import { localize } from '@deriv/translations';
import { plusIconDark } from '../../images';
import { runIrreversibleEvents, runGroupedEvents } from '../../../utils';

Blockly.Blocks.lists_create_with = {
    protected_statements: ['STACK'],
    allowed_children: ['lists_statement'],
    init() {
        const field_image = new Blockly.FieldImage(plusIconDark, 25, 25, '', this.onIconClick.bind(this));
        this.jsonInit(this.definition());
        this.appendDummyInput('ADD_ICON').appendField(field_image);
        this.moveInputBefore('ADD_ICON', 'STACK');
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to create list with', { variable: '%1' }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: localize('list'),
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'STACK',
                },
            ],
            inputsInline: true,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('This block creates a list with strings and numbers.'),
            category: Blockly.Categories.List,
        };
    },
    meta() {
        return {
            display_name: localize('Create list'),
            description: localize('This block creates a list with strings and numbers.'),
        };
    },
    onIconClick() {
        if (this.workspace.options.readOnly || Blockly.derivWorkspace.isFlyout_) {
            return;
        }

        runGroupedEvents(false, () => {
            const statement_block = this.workspace.newBlock('lists_statement');
            statement_block.required_parent_id = this.id;
            statement_block.setMovable(false);
            statement_block.initSvg();
            statement_block.renderEfficiently();

            const connection = this.getLastConnectionInStatement('STACK');
            connection.connect(statement_block.previousConnection);
        });
    },
    onchange(event) {
        if (!this.workspace || Blockly.derivWorkspace.isFlyout_ || this.workspace.isDragging()) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_DRAG && !event.isStart) {
            // Only allow "text_statement" type blocks
            const blocks_in_stack = this.getBlocksInStatement('STACK');
            blocks_in_stack.forEach(block => {
                if (!this.allowed_children.includes(block.type)) {
                    runIrreversibleEvents(() => {
                        block.unplug(/* healStack */ false);
                    });
                }
            });
        }
    },
};

// Head's up! This is also the code generation for the "text_join" block.
Blockly.JavaScript.javascriptGenerator.forBlock.lists_create_with = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.CATEGORY_NAME
    );
    const blocks_in_stack = block.getBlocksInStatement('STACK');
    const elements = blocks_in_stack.map(b => {
        const value = Blockly.JavaScript.javascriptGenerator.forBlock[b.type](b);
        return Array.isArray(value) ? value[0] : value;
    });

    const code = `${var_name} = [${elements.join(', ')}];\n`;
    return code;
};
