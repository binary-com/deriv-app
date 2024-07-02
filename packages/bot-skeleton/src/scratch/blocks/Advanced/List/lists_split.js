import { localize } from '@deriv/translations';

Blockly.Blocks.lists_split = {
    init() {
        const dropdown = new Blockly.FieldDropdown(
            [
                [localize('make list from text'), 'SPLIT'],
                [localize('make text from list'), 'JOIN'],
            ],
            newMode => this.updateType(newMode)
        );

        this.appendValueInput('INPUT').setCheck('String').appendField(dropdown, 'MODE');
        this.appendValueInput('DELIM')
            .setCheck('String')
            .appendField('', 'SPACE1')
            .appendField(localize('with delimiter'), 'DELIM_LABEL');
        this.appendDummyInput().appendField('', 'SPACE2');

        this.setOutput(true, 'Array');
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);

        this.setColour(Blockly.Colours.Base.colour);
        // eslint-disable-next-line no-underscore-dangle

        this.setTooltip(
            localize(
                'This block creates a list from a given string of text, splitting it with the given delimiter. It can also join items in a list into a string of text.'
            )
        );
    },
    meta() {
        return {
            display_name: localize('Create list from text'),
            description: localize(
                'This block creates a list from a given string of text, splitting it with the given delimiter. It can also join items in a list into a string of text.'
            ),
            category: Blockly.Categories.List,
        };
    },
    mutationToDom() {
        const container = document.createElement('mutation');
        container.setAttribute('mode', this.getFieldValue('MODE'));
        return container;
    },
    domToMutation(xmlElement) {
        this.updateType(xmlElement.getAttribute('mode'));
    },
    updateType(newMode) {
        const delimInput = this.getInput('DELIM');
        const spaceField = this.getField('SPACE1');

        if (newMode === 'SPLIT') {
            this.outputConnection.setCheck('Array');
            this.getInput('INPUT').setCheck('String');

            // Create extra spacing for OUTPUT_SHAPE_SQUARE (i.e. string shapes)
            if (!spaceField) {
                delimInput.insertFieldAt(0, '', 'SPACE1');
            }
        } else {
            this.outputConnection.setCheck('String');
            this.getInput('INPUT').setCheck(null);

            if (spaceField) {
                delimInput.removeField('SPACE1');
            }
        }

        this.initSvg();
        // kept this commented to fix backward compatibility issue
        //this.render(false);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.lists_split = block => {
    const input = Blockly.JavaScript.javascriptGenerator.valueToCode(
        block,
        'INPUT',
        Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER
    );
    const delimiter =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'DELIM',
            Blockly.JavaScript.javascriptGenerator.ORDER_NONE
        ) || "''";
    const mode = block.getFieldValue('MODE');

    let code;

    if (mode === 'SPLIT') {
        code = `${input || "''"}.split(${delimiter})`;
    } else if (mode === 'JOIN') {
        code = `${input || '[]'}.join(${delimiter})`;
    }

    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
