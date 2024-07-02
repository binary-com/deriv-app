import { localize } from '@deriv/translations';
import { plusIconDark, minusIconDark } from '../images';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.controls_if = {
    init() {
        this.value_connections = [null];
        this.statement_connections = [null];
        this.else_statement_connection = null;
        this.else_if_count = 0;
        this.else_count = 0;
        this.jsonInit(this.definition());
        this.updateShape();
    },
    definition() {
        return {
            message0: localize('if {{ condition }} then', { condition: '%1' }),
            message1: '%1',
            message2: '%1',
            args0: [
                {
                    type: 'input_value',
                    name: 'IF0',
                    check: 'Boolean',
                },
            ],
            args1: [
                {
                    type: 'field_image',
                    src: ' ', // this is here to add extra padding
                    width: 150,
                    height: 1,
                },
            ],
            args2: [
                {
                    type: 'input_statement',
                    name: 'DO0',
                },
            ],
            inputsInline: true,
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Conditional block'),
            category: Blockly.Categories.Logic,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    meta() {
        return {
            display_name: localize('Conditional block'),
            description: localize(
                'This block evaluates a statement and will perform an action only when the statement is true.'
            ),
        };
    },
    /**
     * Create XML to represent the number of else-if and else inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom() {
        const container = document.createElement('mutation');

        if (this.else_if_count) {
            container.setAttribute('elseif', this.else_if_count);
        }

        if (this.else_count) {
            container.setAttribute('else', 1);
        }

        return container;
    },
    /**
     * Parse XML to restore the else-if and else inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation(xmlElement) {
        this.else_if_count = parseInt(xmlElement.getAttribute('elseif')) || 0;
        this.else_count = parseInt(xmlElement.getAttribute('else')) || 0;
        this.rebuildShape();
    },
    rebuildShape() {
        const value_connections = [null];
        const statement_connections = [null];
        const else_statement_connection = this.getInput('ELSE')?.connection?.targetConnection || null;

        let i = 1;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const input_names = this.getIfInputNames(i);
            const if_input = this.getInput(input_names.IF);

            if (!if_input) {
                break;
            }

            const do_input = this.getInput(input_names.DO);
            value_connections.push(if_input.connection.targetConnection);
            statement_connections.push(do_input.connection.targetConnection);
            i++;
        }

        this.updateShape();
        this.reconnectChildBlocks(value_connections, statement_connections, else_statement_connection);
    },
    update(updateFn) {
        Blockly.Events.setGroup(true);

        const old_mutation_dom = this.mutationToDom();
        const old_mutation = old_mutation_dom && Blockly.Xml.domToText(old_mutation_dom);
        const is_rendered = this.rendered;

        this.rendered = false;

        if (updateFn) {
            updateFn.call(this);
        }

        this.updateShape();
        this.rendered = is_rendered;
        this.initSvg();

        const group = Blockly.Events.getGroup();
        const new_mutation_dom = this.mutationToDom();
        const new_mutation = new_mutation_dom && Blockly.Xml.domToText(new_mutation_dom);

        if (old_mutation !== new_mutation) {
            const change_event = new Blockly.Events.BlockChange(this, 'mutation', null, old_mutation, new_mutation);
            Blockly.Events.fire(change_event);

            setTimeout(() => {
                Blockly.Events.setGroup(group);
                this.bumpNeighbours();
                Blockly.Events.setGroup(false);
            }, Blockly.BUMP_DELAY);
        }

        if (this.rendered) {
            this.renderEfficiently();
        }

        Blockly.Events.setGroup(false);
    },
    updateShape() {
        if (this.getInput('ELSE')) {
            this.removeInput('ELSE');
            this.removeInput('ELSE_LABEL');
            this.removeInput('DELETE_ELSE');
        }

        let i = 1;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const input_names = this.getIfInputNames(i);

            if (!this.getInput(input_names.IF)) {
                break;
            }

            this.removeInput(input_names.IF_LABEL);
            this.removeInput(input_names.IF);
            this.removeInput(input_names.THEN_LABEL);
            this.removeInput(input_names.DELETE_ICON);
            this.removeInput(input_names.DO);

            i++;
        }

        if (this.getInput('MUTATOR')) {
            this.removeInput('MUTATOR'); // "+" icon.
        }

        // Rebuild else if statements
        for (let j = 1; j <= this.else_if_count; j++) {
            const input_names = this.getIfInputNames(j);
            const removeElseIf = () => this.modifyElseIf(false, j);

            this.appendDummyInput(input_names.IF_LABEL).appendField(localize('else if'));
            this.appendValueInput(input_names.IF).setCheck('Boolean');
            this.appendDummyInput(input_names.THEN_LABEL).appendField(localize('then'));
            this.appendDummyInput(input_names.DELETE_ICON).appendField(
                new Blockly.FieldImage(minusIconDark, 24, 24, '-', removeElseIf)
            );
            this.appendStatementInput(input_names.DO);
        }

        // Rebuild else statement
        if (this.else_count > 0) {
            const removeElse = () => this.modifyElse(false);
            this.appendDummyInput('ELSE_LABEL').appendField(localize('else'));
            this.appendDummyInput('DELETE_ELSE').appendField(
                new Blockly.FieldImage(minusIconDark, 24, 24, '-', removeElse, false)
            );
            this.appendStatementInput('ELSE');
        }

        const addElseIf = () => {
            if (this.else_count === 0) {
                this.modifyElse(true);
            } else {
                if (!this.else_if_count) {
                    this.else_if_count = 0;
                }

                this.modifyElseIf(true);
            }
        };

        // Re-add the "+" icon
        this.appendDummyInput('MUTATOR').appendField(
            new Blockly.FieldImage(plusIconDark, 24, 24, '+', addElseIf, false)
        );

        this.initSvg();
        // kept this commented to fix backward compatibility issue
        // need to fix this for mutliplier block
        this.queueRender();
    },
    storeConnections(arg = 0) {
        this.value_connections = [null];
        this.statement_connections = [null];
        this.else_statement_connection = null;

        for (let i = 1; i <= this.else_if_count; i++) {
            if (arg !== i) {
                const input_names = this.getIfInputNames(i);

                this.value_connections.push(this.getInput(input_names.IF).connection.targetConnection);
                this.statement_connections.push(this.getInput(input_names.DO).connection.targetConnection);
            }
        }

        const else_input = this.getInput('ELSE');

        if (else_input) {
            this.else_statement_connection = else_input.connection.targetConnection;
        }
    },
    reconnectChildBlocks(opt_value_conns, opt_statement_conns, opt_else_statement_conns) {
        const value_connections = opt_value_conns ?? this.value_connections;
        const statement_connections = opt_statement_conns ?? this.statement_connections;
        const else_statement_connection = opt_else_statement_conns ?? this.else_statement_connection;

        for (let i = 1; i <= this.else_if_count; i++) {
            const input_names = this.getIfInputNames(i);
            const value_connection = value_connections[i];
            const statement_connection = statement_connections[i];

            if (value_connection && this.getInput(input_names.IF)) {
                Blockly.Mutator.reconnect(value_connection, this, input_names.IF);
            }
            if (statement_connection && this.getInput(input_names.DO)) {
                Blockly.Mutator.reconnect(statement_connection, this, input_names.DO);
            }
        }

        if (else_statement_connection && this.getInput('ELSE')) {
            Blockly.Mutator.reconnect(else_statement_connection, this, 'ELSE');
        }
    },
    modifyElse(is_add) {
        const update = () => {
            this.else_count += is_add ? 1 : -1;
        };

        this.storeConnections();
        this.update(update);
        this.reconnectChildBlocks();
    },
    modifyElseIf(is_add, opt_idx) {
        this.storeConnections(opt_idx);

        const update = () => {
            this.else_if_count += is_add ? 1 : -1;
        };

        this.update(update);
        this.reconnectChildBlocks();
    },
    getRequiredValueInputs() {
        const required_inputs = {};
        this.inputList
            .filter(input => /^IF[0-9]*?$/.test(input.name))
            .forEach(input => (required_inputs[input.name] = null));

        return required_inputs;
    },
    getIfInputNames: idx => {
        return {
            IF_LABEL: `IF_LABEL${idx}`,
            IF: `IF${idx}`,
            THEN_LABEL: `THEN_LABEL${idx}`,
            DELETE_ICON: `DELETE_ICON${idx}`,
            DO: `DO${idx}`,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.controls_if = block => {
    // If/elseif/else condition.
    let n = 0;
    let code = '';

    do {
        const condition =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                `IF${n}`,
                Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            ) || 'false';

        // i.e. (else)? if { // code }
        const keyword = n > 0 ? 'else if' : 'if';
        code += `
        ${keyword} (${condition}) {
            ${Blockly.JavaScript.javascriptGenerator.statementToCode(block, `DO${n}`)}
        }`;
        n++;
    } while (block.getInput(`IF${n}`));

    if (block.getInput('ELSE')) {
        code += `
        else {
            ${Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'ELSE')}
        }`;
    }

    return `${code}\n`;
};
