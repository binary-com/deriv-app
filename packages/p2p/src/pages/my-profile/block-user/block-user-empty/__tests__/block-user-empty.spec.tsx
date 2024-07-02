import React from 'react';
import { screen, render } from '@testing-library/react';
import BlockUserEmpty from '..';

describe('<BlockUserEmpty />', () => {
    it('should render <BlockUserEmpty/> component in desktop view', () => {
        render(<BlockUserEmpty />);
        expect(screen.getByTestId('dt_desktop_content')).toBeInTheDocument();
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
    it('should render <BlockUserEmpty /> component in mobile view', () => {
        render(<BlockUserEmpty />);
        expect(screen.queryByTestId('dt_desktop_content')).not.toBeInTheDocument();
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
});
