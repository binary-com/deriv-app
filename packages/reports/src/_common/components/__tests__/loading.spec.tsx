import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../loading';

const dataTestID = 'dt_loading';
const className = 'mockedClassName';
const defaultClassName = 'barspinner barspinner--dark';
const mockedDefaultProps: React.ComponentProps<typeof Loading> = {
    id: 'mockedId',
    data_testid: dataTestID,
};

describe('<Loading />', () => {
    it('should render component with default props', () => {
        render(<Loading {...mockedDefaultProps} />);

        const loader = screen.getByTestId(dataTestID);
        expect(loader).toBeInTheDocument();
        expect(loader).toHaveClass(defaultClassName);
    });

    it('should apply passed className to the component', () => {
        render(<Loading {...mockedDefaultProps} className={className} />);

        expect(screen.getByTestId(dataTestID)).toHaveClass(`${defaultClassName} ${className}`);
    });
    it('should apply invisible className if is_invisible is true', () => {
        render(<Loading {...mockedDefaultProps} is_invisible />);

        expect(screen.getByTestId(dataTestID)).toHaveClass(`${defaultClassName} invisible`);
    });
    it('should apply theme className if theme was passed', () => {
        render(<Loading {...mockedDefaultProps} theme='light' />);

        expect(screen.getByTestId(dataTestID)).toHaveClass(`barspinner barspinner--light`);
    });
});
