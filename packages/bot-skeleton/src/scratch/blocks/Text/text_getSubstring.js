import { localize } from '@deriv/translations';
import { emptyTextValidator, modifyContextMenu } from '../../utils';

Blockly.Blocks.text_getSubstring = {
    init() {
        this.WHERE_OPTIONS_1 = [
            [localize('letter #'), 'FROM_START'],
            [localize('letter # from end'), 'FROM_END'],
            [localize('first'), 'FIRST'],
        ];
        this.WHERE_OPTIONS_2 = [
            [localize('letter #'), 'FROM_START'],
            [localize('letter # from end'), 'FROM_END'],
            [localize('last'), 'LAST'],
        ];

        this.jsonInit(this.definition());
        this.updateAt(1, true);
        this.updateAt(2, true);
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    definition() {
        return {
            message0: localize(
                'in text {{ input_text }} get substring from {{ position1 }} {{ index1 }} to {{ position2 }} {{ index2 }}',
                {
                    input_text: '%1',
                    position1: '%2',
                    index1: '%3',
                    position2: '%4',
                    index2: '%5',
                }
            ),
            args0: [
                {
                    type: 'input_value',
                    name: 'STRING',
                },
                {
                    type: 'field_dropdown',
                    name: 'WHERE1',
                    options: this.WHERE_OPTIONS_1,
                },
                {
                    type: 'input_dummy',
                    name: 'AT1',
                },
                {
                    type: 'field_dropdown',
                    name: 'WHERE2',
                    options: this.WHERE_OPTIONS_2,
                },
                {
                    type: 'input_dummy',
                    name: 'AT2',
                },
            ],
            inputsInline: true,
            output: 'String',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns a specific portion of a given string of text.'),
            category: Blockly.Categories.Text,
        };
    },
    meta() {
        return {
            display_name: localize('Get substring'),
            description: localize('Returns a specific portion of a given string of text.'),
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
    updateAt(n, is_at) {
        const input = this.getInput(`AT${n}`);
        let old_label_text;

        // Keep track of initial FieldLabel, we'll restore this when
        // input types were changed.
        if (input) {
            input.fieldRow.some(field => {
                if (field instanceof Blockly.FieldLabel) {
                    old_label_text = field.text_; // eslint-disable-line no-underscore-dangle
                }
            });
            this.removeInput(`AT${n}`);
        }

        const new_input = is_at ? this.appendValueInput(`AT${n}`).setCheck('Number') : this.appendDummyInput(`AT${n}`);

        if (old_label_text) {
            new_input.insertFieldAt(0, new Blockly.FieldLabel(old_label_text));
        }

        const menu = new Blockly.FieldDropdown(this[`WHERE_OPTIONS_${n}`], value => {
            const new_at = ['FROM_START', 'FROM_END'].includes(value);

            if (new_at !== is_at) {
                this.updateAt(n, new_at);
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
    getRequiredValueInputs() {
        const hasInput = input_name => this.getInput(input_name)?.type === Blockly.INPUT_VALUE;
        return {
            STRING: emptyTextValidator,
            ...(hasInput('AT1') ? { AT1: emptyTextValidator } : {}),
            ...(hasInput('AT2') ? { AT2: emptyTextValidator } : {}),
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.text_getSubstring = block => {
    const text =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'STRING',
            Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL
        ) || "''";
    const where1 = block.getFieldValue('WHERE1');
    const where2 = block.getFieldValue('WHERE2');

    let at1, at2, code;

    if (where1 === 'FIRST' && where2 === 'LAST') {
        code = text;
    } else if (
        text.match(/^'?\w+'?$/) ||
        (where1 !== 'FROM_END' && where1 !== 'LAST' && where2 !== 'FROM_END' && where2 !== 'LAST')
    ) {
        switch (where1) {
            case 'FROM_START': {
                at1 = Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT1');
                break;
            }
            case 'FROM_END': {
                at1 = Blockly.JavaScript.javascriptGenerator.getAdjusted(
                    block,
                    'AT1',
                    1,
                    false,
                    Blockly.JavaScript.javascriptGenerator.ORDER_SUBTRACTION
                );
                at1 = `${text}.length - ${at1}`;
                break;
            }
            case 'FIRST': {
                at1 = '0';
                break;
            }
            default:
                break;
        }

        switch (where2) {
            case 'FROM_START': {
                at2 = Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT2', 1);
                break;
            }
            case 'FROM_END': {
                at2 = Blockly.JavaScript.javascriptGenerator.getAdjusted(
                    block,
                    'AT2',
                    0,
                    false,
                    Blockly.JavaScript.javascriptGenerator.ORDER_SUBTRACTION
                );
                at2 = `${text}.length - ${at2}`;
                break;
            }
            case 'LAST': {
                at2 = `${text}.length`;
                break;
            }
            default:
                break;
        }

        code = `${text}.slice(${at1}, ${at2})`;
    } else {
        at1 = Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT1');
        at2 = Blockly.JavaScript.javascriptGenerator.getAdjusted(block, 'AT2');

        const getIndex = (string_name, where, opt_at) => {
            if (where === 'FIRST') {
                return '0';
            } else if (where === 'FROM_END') {
                return `${string_name}.length - 1 - ${opt_at}`;
            } else if (where === 'LAST') {
                return `${string_name}.length - 1`;
            }
            return opt_at;
        };
        const where_pascal_case = {
            FIRST: 'First',
            LAST: 'Last',
            FROM_START: 'FromStart',
            FROM_END: 'FromEnd',
        };
        // eslint-disable-next-line no-underscore-dangle
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_(
            `subsequence${where_pascal_case[where1]}${where_pascal_case[where2]}`,
            [
                // eslint-disable-next-line no-underscore-dangle
                `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(
                    sequence
                    ${where1 === 'FROM_END' || where1 === 'FROM_START' ? ', at1' : ''}
                    ${where2 === 'FROM_END' || where2 === 'FROM_START' ? ', at2' : ''}
                ) {
                    var start = ${getIndex('sequence', where1, 'at1')};
                    var end   = ${getIndex('sequence', where2, 'at2')} + 1;
                    
                    return sequence.slice(start, end);
                }`,
            ]
        );

        code = `${functionName}(
            ${text}
            ${where1 === 'FROM_END' || where1 === 'FROM_START' ? `, ${at1}` : ''}
            ${where2 === 'FROM_END' || where2 === 'FROM_START' ? `, ${at2}` : ''}
        )`;
    }

    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
