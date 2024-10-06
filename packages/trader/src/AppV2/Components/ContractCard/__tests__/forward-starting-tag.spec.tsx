import React from 'react';
import { render, screen } from '@testing-library/react';
import ForwardStartingTag from '../forward-starting-tag';

const default_props = {
    formatted_date: '14 May, 2022',
    formatted_time: '14:00',
};

describe('ForwardStartingTag', () => {
    it('should not render component if formatted_date was not passed', () => {
        render(<ForwardStartingTag formatted_time={default_props.formatted_time} />);

        expect(screen.queryByText(default_props.formatted_time)).not.toBeInTheDocument();
    });

    it('should not render component if formatted_time was not passed', () => {
        render(<ForwardStartingTag formatted_date={default_props.formatted_date} />);

        expect(screen.queryByText(default_props.formatted_date)).not.toBeInTheDocument();
    });

    it('should render component', () => {
        render(<ForwardStartingTag {...default_props} />);

        expect(
            screen.getByText(`Starts on ${default_props.formatted_date}, ${default_props.formatted_time}`)
        ).toBeInTheDocument();
    });
});
