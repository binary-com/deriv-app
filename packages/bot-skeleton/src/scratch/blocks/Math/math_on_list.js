import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.math_on_list = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('{{ calculation }} of list {{ input_list }}', {
                calculation: '%1',
                input_list: '%2',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'OP',
                    options: [
                        [localize('sum'), 'SUM'],
                        [localize('min'), 'MIN'],
                        [localize('max'), 'MAX'],
                        [localize('average'), 'AVERAGE'],
                        [localize('median'), 'MEDIAN'],
                        [localize('mode'), 'MODE'],
                        [localize('antimode'), 'ANTIMODE'],
                        [localize('standard deviation'), 'STD_DEV'],
                        [localize('random item'), 'RANDOM'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'LIST',
                },
            ],
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Aggregate operations'),
            category: Blockly.Categories.Mathematical,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    meta() {
        return {
            display_name: localize('Aggregate operations'),
            description: localize(
                'This block performs the following operations on a given list: sum, minimum, maximum, average, median, mode, antimode, standard deviation, random item.'
            ),
        };
    },
    getRequiredValueInputs() {
        const type_list = [
            'variables_get',
            'lists_getSublist',
            'ohlc_values',
            'lists_split',
            'ohlc',
            'ticks',
            'lists_repeat',
            'lastDigitList',
            'ohlc_values_in_list',
            'procedures_callreturn',
        ];
        return {
            LIST: () => {
                return !type_list.includes(this.childBlocks_[0]?.type);
            },
        };
    },
};

/* eslint-disable no-underscore-dangle */
Blockly.JavaScript.javascriptGenerator.forBlock.math_on_list = block => {
    const operation = block.getFieldValue('OP');

    let code, list;

    if (operation === 'SUM') {
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('mathMean', [
            `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(myList) {
                var final_list = [];
                return recursiveList(myList, final_list).reduce(function(x, y) {
                    return x + y;
                },0);
            }`,
        ]);
        list =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'LIST',
                Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            ) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'MIN') {
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('mathMean', [
            `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(myList) {
                var final_list = [];
                return Math.min.apply(null, (recursiveList(myList, final_list) || [0]));
            }`,
        ]);
        list =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'LIST',
                Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
            ) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'MAX') {
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('mathMean', [
            `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(myList) {
                var final_list = [];
                return Math.max.apply(null, (recursiveList(myList, final_list) || [0]));
            }`,
        ]);
        list =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'LIST',
                Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
            ) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'AVERAGE') {
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('mathMean', [
            `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(myList) {
                var final_list = [];
                return recursiveList(myList, final_list).reduce(function(x, y) {
                    return x + y;
                }, 0) / myList.length;
            }`,
        ]);

        list =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'LIST',
                Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            ) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'MEDIAN') {
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('mathMedian', [
            `
            Array.prototype.swap = function (x,y) {
                var b = this[x];
                this[x] = this[y];
                this[y] = b;
                return this;
            }

            function partition(arr, start, end){
                var pivotValue = arr[end];
                var pivotIndex = start;
                for (var i = start; i < end; i++) {
                    if (arr[i] < pivotValue) {
                    arr.swap(pivotIndex, i);
                    pivotIndex++;
                    }
                }
                arr.swap(end, pivotIndex);
                return pivotIndex;
            };

            function quickSort(arr) {
                var stack = [];
                stack.push(0);
                stack.push(arr.length - 1);

                while(stack[stack.length - 1] >= 0){
                    end = stack.pop();
                    start = stack.pop();
                    pivotIndex = partition(arr, start, end);
                    if (pivotIndex - 1 > start){
                        stack.push(start);
                        stack.push(pivotIndex - 1);
                    }
                    if (pivotIndex + 1 < end){
                        stack.push(pivotIndex + 1);
                        stack.push(end);
                    }
                }

            }

            function calculateMedian(final_list){
                quickSort(final_list);

                if (final_list.length % 2 == 0) {
                    return (final_list[final_list.length / 2 - 1] + final_list[final_list.length / 2]) / 2;
                }
                return final_list[(final_list.length - 1) / 2];
            }

            function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(myList) {
                var final_list = [];
                return calculateMedian(recursiveList(myList, final_list));
            }`,
        ]);

        list =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'LIST',
                Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            ) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'MODE') {
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('mathModes', [
            `
            function calculateMathMode(values){
                var modes = [];
                var counts = [];
                var maxCount = 0;

                for (var i = 0; i < values.length; i++) {
                    var value = values[i];
                    var found = false;
                    var thisCount;

                    for (var j = 0; j < counts.length; j++) {
                        if (counts[j][0] === value) {
                            thisCount = ++counts[j][1];
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        counts.push([value, 1]);
                        thisCount = 1;
                    }
                    maxCount = Math.max(thisCount, maxCount);
                }

                for (var j = 0; j < counts.length; j++) {
                    if (counts[j][1] == maxCount) {
                        modes.push(counts[j][0]);
                    }
                }

                return modes;
            }

            function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(list) {
                var final_list = [];
                return calculateMathMode(recursiveList(list, final_list));
            }`,
        ]);

        list =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'LIST',
                Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            ) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'ANTIMODE') {
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('mathAntiMode', [
            `
            function calculateMathAntiMode(values){
                var antiMode = [];
                var counts = [];
                var minCount = 1;
                var countArray = [];

                for (var i = 0; i < values.length; i++) {
                    var value = values[i];
                    var found = false;
                    var thisCount;

                    for (var j = 0; j < counts.length; j++) {
                        if (counts[j][0] === value) {
                            thisCount = ++counts[j][1];
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        counts.push([value, 1]);
                        thisCount = 1;
                    }
                }

                 minCount = Math.min.apply(null, counts.map(function(element) {
                     return element[1];
                 }));

                 for (var j = 0; j < counts.length; j++) {
                    if (counts[j][1] == minCount) {
                        antiMode.push(counts[j][0]);
                    }
                }

                return antiMode;
            }

            function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(list) {
                var final_list = [];
                return calculateMathAntiMode(recursiveList(list, final_list));
            }`,
        ]);

        list =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'LIST',
                Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            ) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'STD_DEV') {
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('mathStandardDeviation', [
            `
            function calculateMathStandardDeviation(numbers){
                var n = numbers.length;
                if (!n) {
                    return null;
                }

                var mean = numbers.reduce(function(x, y) {
                    return x + y;
                }, 0) / n;

                var variance = 0;
                for (var j = 0; j < n; j++) {
                    variance += Math.pow(numbers[j] - mean, 2);
                }
                variance = variance / n;
                return Math.sqrt(variance);
            }

            function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(list) {
                var final_list = [];
                return calculateMathStandardDeviation(recursiveList(list, final_list));
            }`,
        ]);

        list =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'LIST',
                Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            ) || '[]';
        code = `${functionName}((${list} || [0]))`;
    } else if (operation === 'RANDOM') {
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('mathRandomList', [
            `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(list) {
                var final_list = [];
                var final_list = recursiveList(list, final_list);
                var x = Math.floor(Math.random() * final_list.length);
                return final_list[x];
            }`,
        ]);

        list =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'LIST',
                Blockly.JavaScript.javascriptGenerator.ORDER_NONE
            ) || '[]';
        code = `${functionName}((${list} || [0]))`;
    }

    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
