import { localize } from '@deriv/translations';
import { plusIconDark } from '../../images';
import { isDarkRgbColour } from '../../../utils';

Blockly.Blocks.procedures_defreturn = {
    init() {
        this.arguments = [];
        this.argument_var_models = [];

        this.jsonInit(this.definition());

        // Enforce unique procedure names
        const nameField = this.getField('NAME');
        nameField.setValidator(Blockly.Procedures.rename);

        // Render a ➕-icon for adding parameters
        const fieldImage = new Blockly.FieldImage(plusIconDark, 24, 24, '+', () => this.onAddClick());

        const dropdown_path =
            this.workspace.options.pathToMedia +
            (isDarkRgbColour(this.getColour()) ? 'dropdown-arrow.svg' : 'dropdown-arrow-dark.svg');
        // Render a v-icon for adding parameters
        const fieldImageCollapse = new Blockly.FieldImage(
            dropdown_path,
            16,
            16,
            'v',
            () => this.setCollapsed(true),
            false,
            true
        );

        this.appendDummyInput('ADD_ICON').appendField(fieldImage);
        this.moveInputBefore('ADD_ICON', 'RETURN');
        this.appendDummyInput('COLLAPSED_INPUT').appendField(fieldImageCollapse);
        this.moveInputBefore('COLLAPSED_INPUT', 'RETURN');

        this.setStatements(true);
    },
    definition() {
        return {
            message0: localize('function {{ function_name }} {{ function_params }} {{ dummy }}', {
                function_name: '%1',
                function_params: '%2',
                dummy: '%3',
            }),
            message1: 'return %1',
            args0: [
                {
                    type: 'field_input',
                    name: 'NAME',
                    text: '',
                },
                {
                    type: 'field_label',
                    name: 'PARAMS',
                    text: '',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type: 'input_value',
                    name: 'RETURN',
                    check: null,
                    align: Blockly.ALIGN_RIGHT,
                },
            ],
            colour: Blockly.Colours.Special2.colour,
            colourSecondary: Blockly.Colours.Special2.colourSecondary,
            colourTertiary: Blockly.Colours.Special2.colourTertiary,
            tooltip: localize('Function that returns a value'),
            category: Blockly.Categories.Functions,
        };
    },
    meta() {
        return {
            display_name: localize('Function that returns a value'),
            description: localize(
                'This block is similar to the one above, except that this returns a value. The returned value can be assigned to a variable of your choice.'
            ),
        };
    },
    onAddClick: Blockly.Blocks.procedures_defnoreturn.onAddClick,
    onchange: Blockly.Blocks.procedures_defnoreturn.onchange,
    setStatements: Blockly.Blocks.procedures_defnoreturn.setStatements,
    updateParams: Blockly.Blocks.procedures_defnoreturn.updateParams,
    mutationToDom: Blockly.Blocks.procedures_defnoreturn.mutationToDom,
    domToMutation: Blockly.Blocks.procedures_defnoreturn.domToMutation,
    /**
     * Return the signature of this procedure definition.
     * @return {!Array} Tuple containing three elements:
     *     - the name of the defined procedure,
     *     - a list of all its arguments,
     *     - that it DOES have a return value.
     * @this Blockly.Block
     */
    getProcedureDef() {
        return [this.getFieldValue('NAME'), this.arguments, true];
    },
    getProcedureCallers: Blockly.Blocks.procedures_defnoreturn.getProcedureCallers,
    getVars: Blockly.Blocks.procedures_defnoreturn.getVars,
    getVarModels: Blockly.Blocks.procedures_defnoreturn.getVarModels,
    renameVarById: Blockly.Blocks.procedures_defnoreturn.renameVarById,
    displayRenamedVar: Blockly.Blocks.procedures_defnoreturn.displayRenamedVar,
    customContextMenu: Blockly.Blocks.procedures_defnoreturn.customContextMenu,
    callType: 'procedures_callreturn',
    registerWorkspaceListener: Blockly.Blocks.procedures_defnoreturn.registerWorkspaceListener,
};

Blockly.JavaScript.procedures_defreturn = Blockly.JavaScript.procedures_defnoreturn;
