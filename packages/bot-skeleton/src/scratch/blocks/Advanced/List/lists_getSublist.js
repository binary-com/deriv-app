import { localize } from '@deriv/translations';

Blockly.Blocks.lists_getSublist = {
    init() {
        this.WHERE_OPTIONS_1 = [
            [localize('get sub-list from #'), 'FROM_START'],
            [localize('get sub-list from # from end'), 'FROM_END'],
            [localize('get sub-list from first'), 'FIRST'],
        ];
        this.WHERE_OPTIONS_2 = [
            [localize('#'), 'FROM_START'],
            [localize('# from end'), 'FROM_END'],
            [localize('last'), 'LAST'],
        ];

        this.appendValueInput('LIST').appendField(localize('in list'));
        this.appendDummyInput('AT1');
        this.appendDummyInput('AT2');

        // eslint-disable-next-line no-underscore-dangle
        const block_color =
            Blockly.Colours.Base.colour || Blockly.Colours.Base.colourSecondary || Blockly.Colours.Base.colourTertiary;
        this.setColour(block_color);

        this.setOutput(true, null);
        this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
        this.setInputsInline(true);
        this.setTooltip(
            localize('This block creates a list of items from an existing list, using specific item positions.')
        );
        this.updateAt(1, true);
        this.updateAt(2, true);
    },
    meta() {
        return {
            display_name: localize('Get sub-list'),
            description: localize(
                'This block creates a list of items from an existing list, using specific item positions.'
            ),
            category: Blockly.Categories.List,
        };
    },
    mutationToDom() {
        const container = document.createElement('mutation');
        const isAt1 = this.getInput('AT1').type === Blockly.INPUT_VALUE;
        const isAt2 = this.getInput('AT2').type === Blockly.INPUT_VALUE;

        container.setAttribute('at1', isAt1);
        container.setAttribute('at2', isAt2);

        return container;
    },
    domToMutation(xmlElement) {
        const isAt1 = xmlElement.getAttribute('at1') === 'true';
        const isAt2 = xmlElement.getAttribute('at2') === 'true';
        this.updateAt(1, isAt1);
        this.updateAt(2, isAt2);
    },
    updateAt(n, isAt) {
        this.removeInput(`AT${n}`);

        if (isAt) {
            this.appendValueInput(`AT${n}`).setCheck('Number');
        } else {
            this.appendDummyInput(`AT${n}`);
        }

        const menu = new Blockly.FieldDropdown(this[`WHERE_OPTIONS_${n}`], value => {
            const newAt = ['FROM_START', 'FROM_END'].includes(value);
            if (newAt !== isAt) {
                this.updateAt(n, newAt);
                this.setFieldValue(value, `WHERE${n}`);
                return null;
            }
            return undefined;
        });

        this.getInput(`AT${n}`).appendField(menu, `WHERE${n}`);

        if (n === 1) {
            this.moveInputBefore('AT1', 'AT2');
        }

        this.initSvg();
        //commented this line breaks the backward compatibility
        //this.render(false);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.lists_getSublist = block => {
    const list =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'LIST',
            Blockly.JavaScript.javascriptGenerator.ORDER_MEMBER
        ) || '[]';
    const where1 = block.getFieldValue('WHERE1');
    const where2 = block.getFieldValue('WHERE2');

    let at1, at2, code;

    if (where1 === 'FIRST' && where2 === 'LAST') {
        code = `${list}.slice(0)`;
    } else if (list.match(/^\w+$/) || (where1 !== 'FROM_END' && where2 === 'FROM_START')) {
        if (where1 === 'FROM_START') {
            at1 = Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT1');
        } else if (where1 === 'FROM_END') {
            at1 = Blockly.JavaScript.javascriptGenerator.getAdjusted(
                block,
                'AT1',
                1,
                false,
                Blockly.JavaScript.javascriptGenerator.ORDER_SUBTRACTION
            );
            at1 = `${list}.length - ${at1}`;
        } else if (where1 === 'FIRST') {
            at1 = '0';
        }

        if (where2 === 'FROM_START') {
            at2 = Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT2', 1);
        } else if (where2 === 'FROM_END') {
            at2 = Blockly.JavaScript.javascriptGenerator.getAdjusted(
                block,
                'AT2',
                0,
                false,
                Blockly.JavaScript.javascriptGenerator.ORDER_SUBTRACTION
            );
            at2 = `${list}.length - ${at2}`;
        } else if (where2 === 'LAST') {
            at2 = `${list}.length`;
        }

        code = `${list}.slice(${at1}, ${at2})`;
    } else {
        at1 = Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT1');
        at2 = Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT2');
        const where_pascal_case = {
            FROM_START: 'FromStart',
            FROM_END: 'FromEnd',
            FIRST: 'First',
            LAST: 'Last',
        };

        const getIndex = (list_name, where, opt_at) => {
            if (where === 'FIRST') {
                return '0';
            } else if (where === 'FROM_END') {
                return `${list_name}.length - 1 - ${opt_at}`;
            } else if (where === 'LAST') {
                return `${list_name}.length - 1`;
            }
            return `${opt_at}`;
        };

        const has_at1 = where1 === 'FROM_END' || where1 === 'FROM_START';
        const has_at2 = where2 === 'FROM_END' || where2 === 'FROM_START';

        // eslint-disable-next-line no-underscore-dangle
        const function_name = Blockly.JavaScript.javascriptGenerator.provideFunction_(
            `subsequence${where_pascal_case[where1]}${where_pascal_case[where2]}`,
            [
                // eslint-disable-next-line no-underscore-dangle
                `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(
                    sequence${has_at1 ? ', at1' : ''}${has_at2 ? ', at2' : ''}
                ) {
                    var start = ${getIndex('sequence', where1, 'at1')};
                    var end = ${getIndex('sequence', where2, 'at2')} + 1;

                    return sequence.slice(start, end);
                }`,
            ]
        );

        code = `${function_name}(${list}${has_at1 ? `, ${at1}` : ''}${has_at2 ? `, ${at2}` : ''})`;
    }

    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
