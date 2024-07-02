import { localize } from '@deriv/translations';

Blockly.Blocks.controls_for = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'count with {{ variable }} from {{ start_number }} to {{ end_number }} by {{ step_size }}',
                {
                    variable: '%1',
                    start_number: '%2',
                    end_number: '%3',
                    step_size: '%4',
                }
            ),
            args0: [
                {
                    type: 'field_variable',
                    name: 'VAR',
                    variable: null,
                },
                {
                    type: 'input_value',
                    name: 'FROM',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'TO',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'BY',
                    check: 'Number',
                },
            ],
            message1: localize('do %1'),
            args1: [
                {
                    type: 'input_statement',
                    name: 'DO',
                },
            ],
            inputsInline: true,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize(
                'This block uses the variable “i” to control the iterations. With each iteration, the value of “i” is determined by the items in a given list.'
            ),
            category: Blockly.Categories.Loop,
        };
    },
    meta() {
        return {
            display_name: localize('Iterate (1)'),
            description: localize(
                'This block uses the variable “i” to control the iterations. With each iteration, the value of “i” is determined by the items in a given list.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            FROM: null,
            TO: null,
            BY: null,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.controls_for = block => {
    // eslint-disable-next-line no-underscore-dangle
    const variable0 = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'),
        Blockly.Variables.CATEGORY_NAME
    );
    const argument0 =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'FROM',
            Blockly.JavaScript.javascriptGenerator.ORDER_ASSIGNMENT
        ) || '0';
    const argument1 =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TO',
            Blockly.JavaScript.javascriptGenerator.ORDER_ASSIGNMENT
        ) || '0';
    const increment =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'BY',
            Blockly.JavaScript.javascriptGenerator.ORDER_ASSIGNMENT
        ) || '1';

    let branch = Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.javascriptGenerator.addLoopTrap(branch, block.id);

    let code = '';

    if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) && Blockly.isNumber(increment)) {
        const up = parseFloat(argument0) <= parseFloat(argument1);
        const operator = up ? '<=' : '>=';
        const step = Math.abs(parseFloat(increment));

        const assignment = `${variable0} = ${argument0}`;
        const condition = `${variable0} ${operator} ${argument1}`;
        const statement = `${variable0} ${up ? '+=' : '-='} ${step}`;

        code = `
        for (${assignment}; ${condition}; ${statement}) {
            ${branch}
        }\n`;
    } else {
        // Cache non-trivial values to variables to prevent repeated look-ups.
        let startVar = argument0;
        if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
            // eslint-disable-next-line no-underscore-dangle
            startVar = Blockly.JavaScript.variableDB_.getDistinctName(
                `${variable0}_start`,
                Blockly.Variables.CATEGORY_NAME
            );
            code = `var ${startVar} = ${argument0};\n`;
        }

        let endVar = argument1;
        if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
            // eslint-disable-next-line no-underscore-dangle
            endVar = Blockly.JavaScript.variableDB_.getDistinctName(
                `${variable0}_end`,
                Blockly.Variables.CATEGORY_NAME
            );
            code += `var ${endVar} = ${argument1};\n`;
        }

        // Determine loop direction at start, in case one of the bounds changes during loop execution.
        // eslint-disable-next-line no-underscore-dangle
        const incVar = Blockly.JavaScript.variableDB_.getDistinctName(
            `${variable0}_inc`,
            Blockly.Variables.CATEGORY_NAME
        );
        const incVal = Blockly.isNumber(increment) ? Math.abs(increment) : `Math.abs(${increment})`;

        code += `
        var ${incVar} = ${incVal};
        if (${startVar} > ${endVar}) {
            ${incVar} = -${incVar};
        }
        for (
           ${variable0} = ${startVar}; 
           ${incVar} >= 0 ? ${variable0} <= ${endVar} : ${variable0} >= ${endVar};
           ${variable0} += ${incVar}
        ) {
            ${branch};
        }\n`;
    }

    return code;
};
