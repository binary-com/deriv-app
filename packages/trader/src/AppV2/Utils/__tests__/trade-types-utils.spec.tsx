import React from 'react';
import { screen, render } from '@testing-library/react';
import {
    getTermDefinition,
    parseContractDescription,
    CONTRACT_LIST,
    TERM,
    getDescriptionVideoId,
    DESCRIPTION_VIDEO_ID,
} from '../trade-types-utils';
import { Localize } from '@deriv/translations';

describe('getTermDefinition', () => {
    it('should return correct definition for passed term and contract type', () => {
        render(<div>{getTermDefinition({ contract_type: CONTRACT_LIST.ACCUMULATORS, term: TERM.GROWTH_RATE })}</div>);

        expect(
            screen.getByText('You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.')
        ).toBeInTheDocument();
    });

    it('should return specific for Vanillas definition for passed term "contract value"', () => {
        render(<div>{getTermDefinition({ contract_type: CONTRACT_LIST.VANILLAS, term: TERM.CONTRACT_VALUE })}</div>);

        expect(screen.getByText(/We’ll offer to buy your contract at this price/i)).toBeInTheDocument();
    });

    it('should return default definition for passed term "contract value" if contract type is not Vanillas', () => {
        render(<div>{getTermDefinition({ contract_type: CONTRACT_LIST.TURBOS, term: TERM.CONTRACT_VALUE })}</div>);

        expect(screen.getByText(/his is the resale value of your contract, based on/i)).toBeInTheDocument();
    });

    it('should return specific for Vanillas definition for passed term "payout"', () => {
        render(<div>{getTermDefinition({ contract_type: CONTRACT_LIST.VANILLAS, term: TERM.PAYOUT })}</div>);

        expect(screen.getByText(/Your payout is equal/i)).toBeInTheDocument();
    });

    it('should return specific for Turbos definition for passed term "payout"', () => {
        render(<div>{getTermDefinition({ contract_type: CONTRACT_LIST.TURBOS, term: TERM.PAYOUT })}</div>);

        expect(screen.getByText(/The payout at expiry is equal to/i)).toBeInTheDocument();
    });

    it('should return default definition for passed term "payout" if contract type is not Vanillas or Turbos', () => {
        render(<div>{getTermDefinition({ contract_type: CONTRACT_LIST.ACCUMULATORS, term: TERM.PAYOUT })}</div>);

        expect(screen.getByText(/Payout is the sum of your initial stake and profit/i)).toBeInTheDocument();
    });

    it('should return specific for Vanillas definition for passed term "payout per point"', () => {
        render(<div>{getTermDefinition({ contract_type: CONTRACT_LIST.VANILLAS, term: TERM.PAYOUT_PER_POINT })}</div>);

        expect(screen.getByText(/We calculate this based on/i)).toBeInTheDocument();
    });

    it('should return default definition for passed term "payout per point" if contract type is not Vanillas', () => {
        render(<div>{getTermDefinition({ contract_type: CONTRACT_LIST.TURBOS, term: TERM.PAYOUT_PER_POINT })}</div>);

        expect(screen.getByText(/The amount you choose to receive at expiry/i)).toBeInTheDocument();
    });

    it('should return specific for Accumulators definition for passed term "slippage risk"', () => {
        render(<div>{getTermDefinition({ contract_type: CONTRACT_LIST.ACCUMULATORS, term: TERM.SLIPPAGE_RISK })}</div>);

        expect(
            screen.getByText(/The spot price may change by the time your order reaches our servers/i)
        ).toBeInTheDocument();
    });

    it('should return default definition for passed term "slippage risk" if contract type is not Accumulators', () => {
        render(<div>{getTermDefinition({ contract_type: CONTRACT_LIST.TURBOS, term: TERM.SLIPPAGE_RISK })}</div>);

        expect(screen.getByText(/Slippage happens when the asset price changes by the time/i)).toBeInTheDocument();
    });

    it('should return empty string if there is no match with object keys', () => {
        expect(getTermDefinition({ contract_type: CONTRACT_LIST.ACCUMULATORS, term: 'mock' })).toBe('');
    });
});

describe('parseContractDescription', () => {
    const mock_content = [
        { type: 'heading', text: <Localize i18n_default_text='Even' /> },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='If you select “Even”, you will win the payout if the last digit of the last tick is an even number (i.e. 2, 4, 6, 8, or 0).' />
            ),
        },
        { type: 'general', text: <Localize i18n_default_text='Some general text' /> },
        {
            type: 'video',
            text: CONTRACT_LIST.ACCUMULATORS,
        },
    ];

    it('should parse passed content', () => {
        render(<div>{parseContractDescription(mock_content)}</div>);

        expect(screen.getByText(/If you select “Even”/i)).toBeInTheDocument();
        expect(screen.getByText(/Some general text/i)).toBeInTheDocument();
    });
});

describe('getDescriptionVideoId', () => {
    it('should return an id for Vanillas description video in light theme', () => {
        expect(getDescriptionVideoId(CONTRACT_LIST.VANILLAS, false)).toEqual(
            DESCRIPTION_VIDEO_ID[CONTRACT_LIST.VANILLAS].light
        );
    });
    it('should return an id for Accumulator description video in light theme', () => {
        expect(getDescriptionVideoId(CONTRACT_LIST.ACCUMULATORS, false)).toEqual(
            DESCRIPTION_VIDEO_ID[CONTRACT_LIST.ACCUMULATORS].light
        );
    });
    it('should return an id for High/Low description video in light theme', () => {
        expect(getDescriptionVideoId(CONTRACT_LIST['HIGHER/LOWER'], false)).toEqual(
            DESCRIPTION_VIDEO_ID[CONTRACT_LIST['HIGHER/LOWER']].light
        );
    });
    it('should return an id for Matches/Differs description video in light theme', () => {
        expect(getDescriptionVideoId(CONTRACT_LIST['MATCHES/DIFFERS'], false)).toEqual(
            DESCRIPTION_VIDEO_ID[CONTRACT_LIST['MATCHES/DIFFERS']].light
        );
    });
    it('should return an id for Over/Under description video in light theme', () => {
        expect(getDescriptionVideoId(CONTRACT_LIST['OVER/UNDER'], false)).toEqual(
            DESCRIPTION_VIDEO_ID[CONTRACT_LIST['OVER/UNDER']].light
        );
    });
    it('should return an id for Rise/Fall description video in light theme', () => {
        expect(getDescriptionVideoId(CONTRACT_LIST['RISE/FALL'], false)).toEqual(
            DESCRIPTION_VIDEO_ID[CONTRACT_LIST['RISE/FALL']].light
        );
    });
    it('should return an id for Multipliers description video in dark theme', () => {
        expect(getDescriptionVideoId(CONTRACT_LIST.MULTIPLIERS, true)).toEqual(
            DESCRIPTION_VIDEO_ID[CONTRACT_LIST.MULTIPLIERS].dark
        );
    });
    it('should return an id for Touch/No Touch description video in light theme', () => {
        expect(getDescriptionVideoId(CONTRACT_LIST['TOUCH/NO TOUCH'], false)).toEqual(
            DESCRIPTION_VIDEO_ID[CONTRACT_LIST['TOUCH/NO TOUCH']].light
        );
    });
    it('should return an id for Even/Odd description video in dark theme', () => {
        expect(getDescriptionVideoId(CONTRACT_LIST['EVEN/ODD'], true)).toEqual(
            DESCRIPTION_VIDEO_ID[CONTRACT_LIST['EVEN/ODD']].dark
        );
    });
    it('should return undefined when called with empty arguments', () => {
        expect(getDescriptionVideoId()).toEqual(undefined);
    });
});
