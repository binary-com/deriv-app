import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChartModal from '../chart-modal';

jest.mock('../../../chart/chart.tsx', () => jest.fn(() => <div>SmartChart chart</div>));

describe('ChartModal', () => {
    const mockSetChartModalVisibility = jest.fn();

    it('Should render the ChartModal component', () => {
        render(<ChartModal setChartModalVisibility={mockSetChartModalVisibility} />);

        expect(screen.getByText('SmartChart chart')).toBeInTheDocument();
    });

    it('should call setChartModalVisibility when close button is clicked', () => {
        const { container } = render(<ChartModal setChartModalVisibility={mockSetChartModalVisibility} />);

        //<ToolbarIcon> is a wrapper around other components and the data-testid is not passed to the final DOM element
        // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
        const button = container.querySelector('#db-toolbar__close-button');

        if (button) {
            userEvent.click(button);
            expect(mockSetChartModalVisibility).toHaveBeenCalledTimes(1);
        } else {
            throw new Error('Button <ToolbarIcon> with id "db-toolbar__close-button" -  not found');
        }
    });
});
