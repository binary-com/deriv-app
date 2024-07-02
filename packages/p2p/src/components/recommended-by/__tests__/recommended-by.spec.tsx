import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import RecommendedBy from '../recommended-by';

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn().mockReturnValue({
        showModal: jest.fn(),
    }),
}));

describe('<RecommendedBy />', () => {
    it('it should show `No one has recommended this trader yet` and `recommended_average` equals to 0% if there is no props passed', () => {
        render(<RecommendedBy />);
        userEvent.click(screen.getByTestId('dt_popover_wrapper'));
        expect(screen.getByText('No one has recommended this trader yet')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('it should show `Recommended by 1 trader` and `recommended_average` equals to 100%', () => {
        render(<RecommendedBy recommended_count={1} recommended_average={100} />);
        userEvent.click(screen.getByTestId('dt_popover_wrapper'));
        expect(screen.getByText('Recommended by 1 trader')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('it should show `Recommended by 2 traders` and `recommended_average` equals to 50%', () => {
        render(<RecommendedBy recommended_count={2} recommended_average={50} />);
        userEvent.click(screen.getByTestId('dt_popover_wrapper'));
        expect(screen.getByText('Recommended by 2 traders')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should call showModal function in mobile view', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const { showModal } = useModalManagerContext();

        render(<RecommendedBy recommended_count={2} recommended_average={50} />);
        userEvent.click(screen.getByTestId('dt_popover_wrapper'));
        expect(showModal).toHaveBeenCalled();
    });
});
