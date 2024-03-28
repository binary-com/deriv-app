import React from 'react';
import { screen, render } from '@testing-library/react';
import PasskeysStatus from '../passkeys-status';

describe('PasskeysStatus', () => {
    const title = 'Test Title';
    const description = 'Test Description';
    const child = 'Test Child';

    it('renders the title and description correctly', () => {
        render(
            <PasskeysStatus title={<span>{title}</span>} description={<span>{description}</span>} icon='IcPasskey' />
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(description)).toBeInTheDocument();
    });

    it('does not render the description if it is not provided', () => {
        render(<PasskeysStatus title={<span>{title}</span>} icon='IcPasskey' />);

        expect(screen.queryByText(description)).not.toBeInTheDocument();
    });

    it('renders the children correctly', () => {
        render(
            <PasskeysStatus title={<span>{title}</span>} icon='IcPasskey'>
                <span>{child}</span>
            </PasskeysStatus>
        );

        expect(screen.getByText(child)).toBeInTheDocument();
    });
});
