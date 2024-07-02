import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.math_change = {
    /**
     * Initializes the block, in most cases this calls the jsonInit function, in some
     * cases it may add extra properties to the block object.
     * https://developers.google.com/blockly/reference/js/Blockly.Block#jsonInit
     */
    init() {
        this.jsonInit(this.definition());
    },
    /**
     * Block definitions describe how a block looks and behaves, including the text,
     * the colour, the shape, and what other blocks it can connect to. We've separated
     * the block definition from the init function so we can search through it.
     * https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
     */
    definition() {
        return {
            message0: localize('change {{ variable }} by {{ number }}', {
                variable: '%1',
                number: '%2',
            }),
            args0: [
                {
                    type: 'field_variable',
                    name: 'VAR',
                    variable: localize('item'),
                },
                {
                    type: 'input_value',
                    name: 'DELTA',
                    check: 'Number',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('This block adds the given number to the selected variable'),
            category: Blockly.Categories.Mathematical,
        };
    },
    /**
     * Meta returns an object with with properties that contain human readable strings,
     * these strings are used in the flyout help content, as well as used for searching
     * for specific blocks.
     */
    meta() {
        return {
            display_name: localize('Change variable'),
            description: localize('This block adds the given number to the selected variable.'),
        };
    },
    getRequiredValueInputs() {
        return {
            DELTA: null,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.math_change = block => {
    const variable = block.getFieldValue('VAR');
    // eslint-disable-next-line no-underscore-dangle
    const argument0 = Blockly.JavaScript.variableDB_.getName(variable, Blockly.Variables.CATEGORY_NAME);
    const argument1 =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'DELTA',
            Blockly.JavaScript.javascriptGenerator.ORDER_ADDITION
        ) || '0';
    const code = `${argument0} = (typeof ${argument0} === 'number' ? ${argument0} : 0) + ${argument1};`;

    return code;
};
