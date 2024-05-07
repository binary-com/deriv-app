import React from 'react';
import { render, screen } from '@testing-library/react';
import { contract_stages } from 'Constants/contract-stage';
import ContractStageText from '../contract-stage-text';

const stageTextMapping = Object.freeze({
    NOT_RUNNING: 'Bot is not running',
    STARTING: 'Bot is starting',
    STARTED: 'Seeking for contract',
    PURCHASE_SENT: 'Buying contract',
    PURCHASE_RECEIVED: 'Contract bought',
    IS_STOPPING: 'Bot is stopping',
    CONTRACT_CLOSED: 'Contract closed',
});

describe('ContractStageText', () => {
    const stages = Object.keys(contract_stages);
    stages.forEach(stage => {
        it(`should render <ContractStageText /> correct text for ${stage} stage`, () => {
            render(<ContractStageText contract_stage={contract_stages[stage as keyof typeof contract_stages]} />);
            expect(screen.getByText(stageTextMapping[stage as keyof typeof contract_stages])).toBeInTheDocument();
        });
    });
});
