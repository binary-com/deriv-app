import React from 'react';
import { render, screen } from '@testing-library/react';
import Collapsible from '../collapsible';

const className = 'dc-collapsible--has-collapsible-btn';
const testId = 'dt_collapsible';
const mockedDefaultProps: React.ComponentProps<typeof Collapsible> = {
    children: <div data-collapsible={true}>Children Component</div>,
    onClick: jest.fn(),
    switch_off_functionality: false,
};

describe('<Collapsible/>', () => {
    it('should render component with specific className if passed children have data-collapsible = true', () => {
        render(<Collapsible {...mockedDefaultProps} />);

        expect(screen.getByTestId(testId)).toHaveClass(className);
    });

    it('should render component without specific className if passed children have no data-collapsible = true', () => {
        render(
            <Collapsible {...mockedDefaultProps}>
                <div>Child component</div>
            </Collapsible>
        );

        expect(screen.getByTestId(testId)).not.toHaveClass(className);
    });

    it('should render component with specific className if passed children have no data-collapsible = true, but switch_off_functionality is true', () => {
        render(
            <Collapsible {...mockedDefaultProps} switch_off_functionality>
                <div>Child component</div>
            </Collapsible>
        );

        expect(screen.getByTestId(testId)).toHaveClass(className);
    });
});
