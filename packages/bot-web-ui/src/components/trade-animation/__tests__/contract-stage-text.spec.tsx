import React from 'react';
import { render, screen } from '@testing-library/react';
import { contract_stages } from 'Constants/contract-stage';
import ContractStageText, { text_contract_stages } from '../contract-stage-text';

describe('ContractStageText', () => {
    const stages = Object.keys(contract_stages);
    stages.forEach(stage => {
        it(`should render <ContractStageText /> correct text for ${stage} stage`, () => {
            render(<ContractStageText contract_stage={contract_stages[stage as keyof typeof contract_stages]} />);
            expect(screen.getByText(text_contract_stages[stage as keyof typeof contract_stages])).toBeInTheDocument();
        });
    });
});
