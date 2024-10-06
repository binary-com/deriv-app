import { addDynamicBlockToDOM } from 'Utils/xml-dom-quick-strategy';

describe('addDynamicBlockToDOM', () => {
    let strategyDom: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="strategy-dom">
                <value name="AMOUNT"></value>
                <block type="trade_definition_tradeoptions">
                    <mutation></mutation>
                </block>
            </div>
        `;
        strategyDom = document.getElementById('strategy-dom')!;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should add a block to the DOM when trade_type_cat is "digits"', () => {
        addDynamicBlockToDOM('testBlock', 'testValue', 'digits', strategyDom);

        const valueBlock = document.querySelector('value[name="testBlock"]') as HTMLElement;
        expect(valueBlock).not.toBeNull();
        expect(valueBlock).toHaveAttribute('strategy_value', 'testValue');

        const shadowBlock = valueBlock.querySelector('shadow') as HTMLElement;
        expect(shadowBlock).not.toBeNull();
        expect(shadowBlock).toHaveAttribute('type', 'math_number_positive');
        expect(shadowBlock).toHaveAttribute('id', 'p0O]7-M{ZORlORxGuIEb');

        const fieldBlock = shadowBlock.querySelector('field') as HTMLElement;
        expect(fieldBlock).not.toBeNull();
        expect(fieldBlock).toHaveAttribute('name', 'NUM');
        expect(fieldBlock).toHaveTextContent('0');

        const amountBlock = strategyDom.querySelector('value[name="AMOUNT"]');
        const insertedBlock = amountBlock?.nextSibling as HTMLElement;
        expect(insertedBlock).toBe(valueBlock);
    });

    it('should add a block to the DOM when trade_type_cat is "highlowticks"', () => {
        addDynamicBlockToDOM('testBlockHighLow', 'testValueHighLow', 'highlowticks', strategyDom);

        const valueBlock = document.querySelector('value[name="testBlockHighLow"]') as HTMLElement;
        expect(valueBlock).not.toBeNull();
        expect(valueBlock).toHaveAttribute('strategy_value', 'testValueHighLow');

        const shadowBlock = valueBlock.querySelector('shadow') as HTMLElement;
        expect(shadowBlock).not.toBeNull();
        expect(shadowBlock).toHaveAttribute('type', 'math_number_positive');
        expect(shadowBlock).toHaveAttribute('id', 'p0O]7-M{ZORlORxGuIEb');

        const fieldBlock = shadowBlock.querySelector('field') as HTMLElement;
        expect(fieldBlock).not.toBeNull();
        expect(fieldBlock).toHaveAttribute('name', 'NUM');
        expect(fieldBlock).toHaveTextContent('0');

        const amountBlock = strategyDom.querySelector('value[name="AMOUNT"]');
        const insertedBlock = amountBlock?.nextSibling as HTMLElement;
        expect(insertedBlock).toBe(valueBlock);
    });

    it('should set has_prediction attribute when name_block is "PREDICTION"', () => {
        addDynamicBlockToDOM('PREDICTION', 'testValue', '', strategyDom);

        const mutationElement = strategyDom.querySelector(
            'block[type="trade_definition_tradeoptions"] > mutation'
        ) as HTMLElement;
        expect(mutationElement).not.toBeNull();
        expect(mutationElement).toHaveAttribute('has_prediction', 'true');
    });

    it('should not modify DOM if strategy_dom is null', () => {
        const initialDOM = document.body.innerHTML;
        addDynamicBlockToDOM('testBlock', 'testValue', 'digits', null as unknown as HTMLElement);
        expect(document.body.innerHTML).toBe(initialDOM);
    });
});
