import React from 'react';
import { render, screen } from '@testing-library/react';
import RadioGroupWithInfoMobile from '../radio-group-with-info-mobile';

describe('RadioGroupWithInfoMobile', () => {
    const props: React.ComponentProps<typeof RadioGroupWithInfoMobile> = {
        items_list: [
            { text: 'test name 1', value: 1 },
            { text: 'test name 2', value: 2 },
            { text: 'test name 3', value: 3 },
        ],
        contract_name: 'test_contract',
        current_value_object: { name: 'test name 2', value: 2 },
        onChange: jest.fn(),
        info: 'test info message',
        toggleModal: jest.fn(),
    };

    it('should render AccumulatorsProfitLossText', () => {
        render(<RadioGroupWithInfoMobile {...props} />);

        const radio_options_arr_1 = screen.getAllByRole('radio');
        expect(radio_options_arr_1.length).toBe(3);
        // expect(radio_options_arr_1[1].closest('label')).toHaveClass('dc-radio-group__item--selected');
        // expect(radio_options_arr_1[0].closest('label')).not.toHaveClass('dc-radio-group__item--selected');
        // expect(radio_options_arr_1[2].closest('label')).not.toHaveClass('dc-radio-group__item--selected');
        // expect(radio_options_arr_1[1].value).toBe('test value 2');
    });
});
