import React from 'react';
import { screen, render } from '@testing-library/react';
import { Icon } from '@deriv/components';
import IconMessageContent from '../icon-message-content';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div data-testid='mockedIcon' />),
    };
});

describe('<IconMessageContent />', () => {
    const props = {
        icon: <Icon icon='sampleIcon' />,
        message: 'sampleMessage',
        text: 'sampleText',
    };

    it('should render the IconWithMessage component', () => {
        render(<IconMessageContent {...props} />);

        expect(screen.getByTestId('mockedIcon')).toBeInTheDocument();
        expect(screen.getByText('sampleMessage')).toBeInTheDocument();
        expect(screen.getByText('sampleText')).toBeInTheDocument();
    });

    it('renders the children', () => {
        render(
            <IconMessageContent {...props}>
                <div>test</div>
            </IconMessageContent>
        );
        expect(screen.getByText('test')).toBeInTheDocument();
    });
});
