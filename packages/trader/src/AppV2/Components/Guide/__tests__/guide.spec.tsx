import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Loadable from 'react-loadable';
import { CONTRACT_LIST, TERM, AVAILABLE_CONTRACTS } from 'AppV2/Utils/trade-types-utils';
import Guide from '../guide';
import { StoreProvider, mockStore } from '@deriv/stores';

const mediaQueryList = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);
Loadable.preloadAll();

describe('Guide', () => {
    const renderGuide = (mockProps?: React.ComponentProps<typeof Guide>) => {
        render(
            <StoreProvider store={mockStore({})}>
                <Guide {...mockProps} />
            </StoreProvider>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render component', () => {
        renderGuide();

        expect(screen.getByText('Guide')).toBeInTheDocument();
        expect(screen.getByText('Trade types')).toBeInTheDocument();
        AVAILABLE_CONTRACTS.forEach(({ id }) => expect(screen.getByText(id)).toBeInTheDocument());
    });

    it('should render minimalistic component if is_minimalistic_look === true', () => {
        renderGuide({ is_minimalistic_look: true });

        expect(screen.queryByText('Guide')).not.toBeInTheDocument();
        expect(screen.getByText('Trade types')).toBeInTheDocument();
        AVAILABLE_CONTRACTS.forEach(({ id }) => expect(screen.getByText(id)).toBeInTheDocument());
    });

    it('should set correct contract type if user clicked on chip', () => {
        const mockSelectedContractType = jest.fn();
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [false, jest.fn()])
            .mockImplementationOnce(() => [CONTRACT_LIST['RISE/FALL'], mockSelectedContractType])
            .mockImplementationOnce(() => ['', jest.fn()]);

        renderGuide();

        userEvent.click(screen.getByText('Guide'));

        userEvent.click(screen.getByText(CONTRACT_LIST.ACCUMULATORS));
        expect(mockSelectedContractType).toHaveBeenCalledWith(CONTRACT_LIST.ACCUMULATORS);
    });

    it('should render term definition if user clicked on it', () => {
        renderGuide();

        const term_definition = 'You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.';
        expect(screen.queryByText(term_definition)).not.toBeInTheDocument();

        userEvent.click(screen.getByText('Guide'));
        userEvent.click(screen.getByText(CONTRACT_LIST.ACCUMULATORS));
        userEvent.click(screen.getByRole('button', { name: TERM.GROWTH_RATE.toLowerCase() }));

        expect(screen.getByText(term_definition)).toBeInTheDocument();
    });
});
