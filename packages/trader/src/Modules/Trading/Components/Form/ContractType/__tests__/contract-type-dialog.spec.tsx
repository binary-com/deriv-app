// TODO refactor old tests in this component
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import ContractTypeDialog from '../contract-type-dialog.jsx';

const list = [
    { contract_types: [{ value: 'first-value' }], label: 'first-item' },
    { contract_types: [{ value: 'second-value' }], label: 'second-item' },
];

const MockChildren = () => <div data-testid='child-test-id' />;

describe('ContractTypeDialog Component', () => {
    it('should render "children" when passed in', () => {
        render(<ContractTypeDialog list={list} />);
        // const child = screen.getByTestId('child-test-id');
        // const lala = within(child).getByTestId('child-test-id');
        // // expect(pElement).toBeInTheDocument();
    });
});
