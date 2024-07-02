import { localize } from '@deriv/translations';

/**
 * Construct the blocks required by the flyout for the procedure category.
 * @param {!Blockly.Workspace} workspace The workspace containing procedures.
 * @return {!Array.<!Element>} Array of XML block elements.
 */

Blockly.Procedures.flyoutCategory = function (workspace) {
    let xmlList = [];

    if (Blockly.Blocks.procedures_defnoreturn) {
        // <block type="procedures_defnoreturn" gap="16">
        //     <field name="NAME">do something</field>
        // </block>
        const block = document.createElement('block');
        block.setAttribute('type', 'procedures_defnoreturn');
        block.setAttribute('gap', 16);

        // TEMP
        const nameField = document.createElement('field');
        nameField.setAttribute('name', 'NAME');
        nameField.appendChild(document.createTextNode(localize('do something')));

        block.appendChild(nameField);
        xmlList.push(block);
    }

    if (Blockly.Blocks.procedures_defreturn) {
        // <block type="procedures_defreturn" gap="16">
        //     <field name="NAME">do something</field>
        // </block>
        const block = document.createElement('block');
        block.setAttribute('type', 'procedures_defreturn');
        block.setAttribute('gap', 16);

        const nameField = document.createElement('field');
        nameField.setAttribute('name', 'NAME');
        nameField.appendChild(document.createTextNode(localize('do something')));

        block.appendChild(nameField);
        xmlList.push(block);
    }

    if (Blockly.Blocks.procedures_ifreturn) {
        // <block type="procedures_ifreturn" gap="16"></block>
        const block = document.createElement('block');
        block.setAttribute('type', 'procedures_ifreturn');
        block.setAttribute('gap', 16);
        xmlList.push(block);
    }

    if (xmlList.length) {
        // Add slightly larger gap between system blocks and user calls.
        xmlList[xmlList.length - 1].setAttribute('gap', 24);
    }

    const tuple = Blockly.Procedures.allProcedures(workspace);
    xmlList = xmlList.concat(Blockly.Procedures.populateDynamicProcedures(tuple));
    return xmlList;
};

Blockly.Procedures.populateDynamicProcedures = function (tuple) {
    let xmlList = [];

    const populateProcedures = (procedureList, templateName) => {
        const xml = [];

        if (!procedureList) {
            return xml;
        }

        for (let i = 0; i < procedureList.length; i++) {
            const name = procedureList[i][0];
            const args = procedureList[i][1];

            // <block type="procedures_callnoreturn" gap="16">
            //   <mutation name="do something">
            //     <arg name="x"></arg>
            //   </mutation>
            // </block>
            const block = document.createElement('block');
            block.setAttribute('type', templateName);
            block.setAttribute('gap', 16);

            const mutation = document.createElement('mutation');
            mutation.setAttribute('name', name);
            block.appendChild(mutation);

            args.forEach(argumentName => {
                const arg = document.createElement('arg');
                arg.setAttribute('name', argumentName);
                mutation.appendChild(arg);
            });

            xml.push(block);
        }

        return xml;
    };

    xmlList = xmlList.concat(populateProcedures(tuple[0], 'procedures_callnoreturn'));
    xmlList = xmlList.concat(populateProcedures(tuple[1], 'procedures_callreturn'));

    return xmlList;
};

/**
 * Find the definition block for the named procedure.
 * @param {string} name Name of procedure.
 * @param {!Blockly.Workspace} workspace The workspace to search.
 * @return {Blockly.Block} The procedure definition block, or null not found.
 */
Blockly.Procedures.getDefinition = function (name, workspace) {
    // Assume that a procedure definition is a top block.
    const blocks = workspace.getTopBlocks(false);
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].getProcedureDef) {
            const tuple = blocks[i].getProcedureDef();
            if (tuple && Blockly.Names.equals(tuple[0], name)) {
                return blocks[i];
            }
        }
    }
    return null;
};

// Scratch has a broken version where they return `false` if Blockly.Names.equals(procName[0], name).
// https://github.com/LLK/scratch-blocks/pull/1930
Blockly.Procedures.isNameUsed = function (name, workspace, optExclude) {
    const blocks = workspace.getAllBlocks(false);
    // Iterate through every block and check the name.
    return blocks.some(block => {
        if (block !== optExclude && block.getProcedureDef) {
            const procName = block.getProcedureDef();
            return Blockly.Names.equals(procName[0], name);
        }
        return false;
    });
};

/**
 * Move the workspace based on the most recent mouse movements.
 * @param {!goog.math.Coordinate} currentDragDeltaXY How far the pointer has
 *     moved from the position at the start of the drag, in pixel coordinates.
 * @package
 */
