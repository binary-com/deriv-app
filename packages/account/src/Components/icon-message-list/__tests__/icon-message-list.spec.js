import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Icon } from '@deriv/components';
import IconMessageList from '../icon-message-list';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div data-testid='mocked_icon'></div>),
    };
});
describe('<IconMessageList/>', () => {
    const messages_list = ['Sample Text1', 'Sample Text2', 'Sample Text3', 'Sample Text4'];
    it('should render IconMessageList component', () => {
        render(<IconMessageList />);
        expect(screen.getByTestId('icon_message_list')).toBeInTheDocument();
    });

    it('should render icon passed to the component', () => {
        render(<IconMessageList icon={<Icon icon='sampleIcon' />} />);
        expect(screen.getByTestId('mocked_icon')).toBeInTheDocument();
    });
    it('should show message passed to the component', () => {
        render(<IconMessageList message={'Lorem Epsom'} />);
        expect(screen.getByText(/lorem epsom/i)).toBeInTheDocument();
    });
    it('when the length of message_list is less than 3, it should show messages with icon ', () => {
        render(<IconMessageList message_list={['Sample Text1', 'Sample Text2']} />);
        expect(screen.getByText(/Sample Text1/i)).toBeInTheDocument();
        expect(screen.getByText(/Sample Text2/i)).toBeInTheDocument();
    });

    it('should show show_more_btn and first 3 msgs when the message_list is more than 3', () => {
        render(<IconMessageList message_list={messages_list} />);
        expect(screen.getByText(/sample text1/i)).toBeInTheDocument();
        expect(screen.getByText(/sample text2/i)).toBeInTheDocument();
        expect(screen.getByText(/sample text3/i)).toBeInTheDocument();
        expect(screen.queryByText(/sample text4/i)).not.toBeInTheDocument();
        expect(
            screen.getByRole('button', {
                name: /show more/i,
            })
        ).toBeInTheDocument();
    });

    it('should call setShowMore when show_more btn is clicked', () => {
        const setShowMore = jest.fn();
        jest.spyOn(React, 'useState').mockImplementation(show_more => [show_more, setShowMore]);
        render(<IconMessageList message_list={messages_list} />);
        fireEvent.click(screen.getByRole('button', { name: /show more/i }));
        expect(setShowMore).toHaveBeenCalledWith(true);
    });

    it('should show all messages and show_less_btn when show_more btn is clicked', () => {
        render(<IconMessageList message_list={messages_list} />);

        const show_more_btn = screen.getByRole('button', {
            name: /show more/i,
        });

        fireEvent.click(show_more_btn);
        expect(screen.getByText(/sample text1/i)).toBeInTheDocument();
        expect(screen.getByText(/sample text2/i)).toBeInTheDocument();
        expect(screen.getByText(/sample text3/i)).toBeInTheDocument();
        expect(screen.getByText(/sample text4/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /show less/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /show more/i })).not.toBeInTheDocument();
    });

    it('should show continue_btn if OnContinue is passed', () => {
        const onContinuefn = jest.fn();
        render(<IconMessageList message_list={['Sample Text1']} onContinue={onContinuefn} />);
        const upload_btn = screen.queryByRole('button', { name: /upload document/i });
        expect(upload_btn).toBeInTheDocument();
        fireEvent.click(upload_btn);
        expect(onContinuefn).toHaveBeenCalled();
    });
});
