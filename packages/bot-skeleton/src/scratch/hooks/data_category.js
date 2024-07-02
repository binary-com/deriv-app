import { localize } from '@deriv/translations';
import DBotStore from '../dbot-store';

/**
 * Construct the blocks required by the flyout for the variable category.
 * @param {!Blockly.Workspace} workspace The workspace containing variables.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blockly.DataCategory = function (workspace) {
    const variableModelList = workspace.getVariablesOfType('');
    let xmlList = [];

    // `Create Variable`-Section
    Blockly.DataCategory.addCreateVariable(xmlList, workspace);

    const block_types = ['variables_set', 'variables_get', 'math_change'];
    xmlList = xmlList.concat(Blockly.DataCategory.search(variableModelList, block_types));

    return xmlList;
};

Blockly.DataCategory.search = function (variableModelList) {
    const xmlList = [];
    if (variableModelList.length > 0) {
        const generateVariableFieldXmlString = variableModel => {
            // The variable name may be user input, so it may contain characters that
            // need to be escaped to create valid XML.
            const escapedText = `<field name="VAR" id="${variableModel.getId()}" variabletype="${encodeURIComponent(
                variableModel.type
            )}">${encodeURIComponent(variableModel.name)}</field>`;
            return escapedText;
        };

        const firstVariable = variableModelList[0];

        // Create 'Set `var` to'-block
        if (Blockly.Blocks.variables_set) {
            const gap = Blockly.Blocks.math_change ? 8 : 24;
            const setBlockText = `<xml><block type="variables_set" gap="${gap}">${generateVariableFieldXmlString(
                firstVariable
            )}</block></xml>`;
            const setBlock = Blockly.utils.xml.textToDom(setBlockText).firstChild;
            xmlList.push(setBlock);
        }

        // Create 'Change `var` by `1`'-block
        // if (Blockly.Blocks.math_change) {
        //     const gap = Blockly.Blocks.variables_get ? 20 : 8;
        //     const changeBlockText = `<xml><block type="math_change" gap="${gap}">${generateVariableFieldXmlString(
        //         firstVariable
        //     )}<value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></xml>`;
        //     const changeBlock = Blockly.Xml.textToDom(changeBlockText).firstChild;
        //     xmlList.push(changeBlock);
        // }

        // Create `variable_get` block for each variable
        if (Blockly.Blocks.variables_get) {
            // For adding sort base on the creation date
            variableModelList.sort(
                (first_variable, second_variable) =>
                    variableModelList.indexOf(second_variable) - variableModelList.indexOf(first_variable)
            );

            variableModelList.forEach(variable => {
                const getBlockText = `<xml><block type="variables_get">${generateVariableFieldXmlString(
                    variable
                )}</block></xml>`;
                const getBlock = Blockly.utils.xml.textToDom(getBlockText).firstChild;
                xmlList.push(getBlock);
            });
        }
    }

    return xmlList;
};

/**
 * Construct a create variable section and push it to the xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {Blockly.Workspace} workspace Workspace to register callback to.
 * @deriv/bot: We only use a single type of variable, so `type` arg was removed.
 */
Blockly.DataCategory.addCreateVariable = function (xmlList, workspace) {
    const el_button_xml = document.createElement('button');
    const el_input_xml = document.createElement('input');

    // Set default msg, callbackKey, and callback values for type 'VARIABLE'
    const button_text = localize('Create');
    const callback_key = 'CREATE_VARIABLE';
    const input_placeholder = localize('New variable name');

    // Set attributes for the button
    el_button_xml.setAttribute('text', button_text);
    el_button_xml.setAttribute('className', 'flyout__button-new');
    el_button_xml.setAttribute('callbackKey', callback_key);

    // Set attributes for the input field
    el_input_xml.setAttribute('className', 'flyout__input');
    el_input_xml.setAttribute('name', 'variable');
    el_input_xml.setAttribute('type', 'text');
    el_input_xml.setAttribute('placeholder', input_placeholder);

    const callback = function (button) {
        const el_input_container = document.querySelector('.flyout__input > .dc-input__container');
        const el_input = el_input_container.firstChild;

        const buttonWorkspace = button.getTargetWorkspace();
        buttonWorkspace.createVariable(el_input.value, '');
        el_input.value = '';

        const { flyout } = DBotStore.instance;
        flyout.refreshCategory();
    };

    workspace.registerButtonCallback(callback_key, callback);

    xmlList.push(el_input_xml);
    xmlList.push(el_button_xml);
};
