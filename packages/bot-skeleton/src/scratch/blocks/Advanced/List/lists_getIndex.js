import { localize } from '@deriv/translations';

Blockly.Blocks.lists_getIndex = {
    init() {
        this.MODE_OPTIONS = [
            [localize('get'), 'GET'],
            [localize('get and remove'), 'GET_REMOVE'],
            [localize('remove'), 'REMOVE'],
        ];
        this.WHERE_OPTIONS = [
            ['#', 'FROM_START'],
            [localize('# from end'), 'FROM_END'],
            [localize('first'), 'FIRST'],
            [localize('last'), 'LAST'],
            [localize('random'), 'RANDOM'],
        ];
        const modeMenu = new Blockly.FieldDropdown(this.MODE_OPTIONS, value => {
            const isStatement = value === 'REMOVE';
            this.updateStatement(isStatement);
        });

        this.appendValueInput('VALUE').setCheck('Array').appendField(localize('in list'));
        this.appendDummyInput().appendField(modeMenu, 'MODE');
        this.appendDummyInput('AT');
        const block_color =
            Blockly.Colours.Base.colour || Blockly.Colours.Base.colourSecondary || Blockly.Colours.Base.colourTertiary;
        this.setColour(block_color);
        this.setTooltip(
            'This block gives you the value of a specific item in a list, given the position of the item. It can also remove the item from the list.'
        );
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.updateAt(true);
    },
    meta() {
        return {
            display_name: localize('Get list item'),
            description: localize(
                'This block gives you the value of a specific item in a list, given the position of the item. It can also remove the item from the list.'
            ),
            category: Blockly.Categories.List,
        };
    },
    mutationToDom() {
        const container = document.createElement('mutation');
        const isStatement = !this.outputConnection;
        const isAt = this.getInput('AT').type === Blockly.INPUT_VALUE;

        container.setAttribute('statement', isStatement);
        container.setAttribute('at', isAt);

        return container;
    },
    domToMutation(xmlElement) {
        const isStatement = xmlElement.getAttribute('statement') === 'true';
        this.updateStatement(isStatement);

        const isAt = xmlElement.getAttribute('at') !== 'false';
        this.updateAt(isAt);
    },
    updateStatement(newStatement) {
        const oldStatement = !this.outputConnection;

        if (newStatement !== oldStatement) {
            this.unplug(true, true);

            this.setOutput(!newStatement);
            this.setPreviousStatement(newStatement);
            this.setNextStatement(newStatement);

            this.initSvg();
            // kept this commented to fix backward compatibility issue
            // this.render(false);
        }
    },
    updateAt(isAt) {
        this.removeInput('AT', true);

        if (isAt) {
            this.appendValueInput('AT').setCheck('Number');
        } else {
            this.appendDummyInput('AT');
        }

        const menu = new Blockly.FieldDropdown(this.WHERE_OPTIONS, value => {
            const newAt = ['FROM_START', 'FROM_END'].includes(value);
            if (newAt !== isAt) {
                this.updateAt(newAt);
                this.setFieldValue(value, 'WHERE');
                return null;
            }
            return undefined;
        });

        this.getInput('AT').appendField(menu, 'WHERE');

        this.initSvg();
        // kept this commented to fix backward compatibility issue
        //this.render(false);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.lists_getIndex = block => {
    const mode = block.getFieldValue('MODE') || 'GET';
    const where = block.getFieldValue('WHERE') || 'FIRST';
    const listOrder =
        where === 'RANDOM'
            ? Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
            : Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER;
    const list = Blockly.JavaScript.javascriptGenerator.valueToCode(block, 'VALUE', listOrder) || '[]';

    let code, order;

    if (where === 'FIRST') {
        if (mode === 'GET') {
            code = `${list}[0]`;
            order = Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER;
        } else if (mode === 'GET_REMOVE') {
            code = `${list}.shift()`;
            order = Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER;
        } else if (mode === 'REMOVE') {
            return `${list}.shift();\n`;
        }
    } else if (where === 'LAST') {
        if (mode === 'GET') {
            code = `${list}.slice(-1)[0]`;
            order = Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER;
        } else if (mode === 'GET_REMOVE') {
            code = `${list}.pop()`;
            order = Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER;
        } else if (mode === 'REMOVE') {
            return `${list}.pop();\n`;
        }
    } else if (where === 'FROM_START') {
        const at = Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT');
        if (mode === 'GET') {
            code = `${list}[${at}]`;
            order = Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER;
        } else if (mode === 'GET_REMOVE') {
            code = `${list}.splice(${at}, 1)[0]`;
            order = Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL;
        } else if (mode === 'REMOVE') {
            return `${list}.splice(${at}, 1);\n`;
        }
    } else if (where === 'FROM_END') {
        const at = Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT', 1, true);
        if (mode === 'GET') {
            code = `${list}.slice(${at})[0]`;
            order = Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL;
        } else if (mode === 'GET_REMOVE') {
            code = `${list}.splice(${at}, 1)[0]`;
            order = Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL;
        } else if (mode === 'REMOVE') {
            return `${list}.splice(${at}, 1);\n`;
        }
    } else if (where === 'RANDOM') {
        // eslint-disable-next-line no-underscore-dangle
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('listsGetRandomItem', [
            // eslint-disable-next-line no-underscore-dangle
            `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(list, remove) {
                var x = Math.floor(Math.random() * list.length);
                if (remove) {
                    return list.splice(x, 1)[0];
                } else {
                    return list[x];
                }
            }`,
        ]);

        code = `${functionName}(${list}, ${mode !== 'GET'})`;

        if (mode === 'GET' || mode === 'GET_REMOVE') {
            order = Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL;
        } else if (mode === 'REMOVE') {
            return `${code};\n`;
        }
    }

    return [code, order];
};
