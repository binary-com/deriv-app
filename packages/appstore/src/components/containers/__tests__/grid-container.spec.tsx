import GridContainer from '../grid-container';
import { render, screen } from '@testing-library/react';

describe('GridContainer', () => {
    it('should render children', () => {
        const traders_hub_label = 'Traders Hub';
        render(
            <GridContainer>
                <div>
                    <h1>{traders_hub_label}</h1>
                </div>
            </GridContainer>
        );
        expect(screen.getByText(traders_hub_label)).toBeInTheDocument();
    });
});
