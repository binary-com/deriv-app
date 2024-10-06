export const addDynamicBlockToDOM = (
    name_block: string,
    strategy_value: string,
    trade_type_cat: string,
    strategy_dom: HTMLElement
) => {
    if (trade_type_cat === 'digits' || trade_type_cat === 'highlowticks') {
        const block = document.createElement('value');
        block.setAttribute('name', name_block);
        block.setAttribute('strategy_value', strategy_value);

        const shadow_block = document.createElement('shadow');
        shadow_block.setAttribute('type', 'math_number_positive');
        shadow_block.setAttribute('id', 'p0O]7-M{ZORlORxGuIEb');

        const field_block = document.createElement('field');
        field_block.setAttribute('name', 'NUM');
        field_block.textContent = '0';

        shadow_block.appendChild(field_block);
        block.appendChild(shadow_block);

        const amount_block = strategy_dom?.querySelector('value[name="AMOUNT"]');
        if (amount_block) {
            const parent_node = amount_block.parentNode;
            if (parent_node) {
                parent_node.insertBefore(block, amount_block.nextSibling);
            }
        }
    }
    if (name_block === 'PREDICTION' && strategy_dom) {
        const mutation_element = strategy_dom.querySelector('block[type="trade_definition_tradeoptions"] > mutation');
        if (mutation_element) {
            mutation_element.setAttribute('has_prediction', 'true');
        }
    }
};
