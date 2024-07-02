import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserGuide from '../user-guide';

jest.mock('@deriv/bot-skeleton/src/scratch/xml/main.xml', () => '<xml>sample</xml>');
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

const mocked_props = {
    active_tab: '3',
    is_tour_dialog_visible: true,
    dialog_options: {
        title: 'string',
        message: 'string',
        ok_button_text: 'string',
        cancel_button_text: 'string',
    },
    Blockly: jest.fn(),
    faq_search_value: '',
    is_dialog_open: true,
    onOkButtonClick: jest.fn(),
    setActiveTab: jest.fn(() => 3),
    setOnBoardTourRunState: jest.fn(),
    setTourActiv: jest.fn(),
    setTourDialogVisibility: jest.fn(),
    showVideoDialog: jest.fn(),
    performSelfExclusionCheck: jest.fn(),
    setActiveTabTutorial: jest.fn(),
};

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Cards: jest.fn(() => 'Cards'),
        messageWithButton: jest.fn(() => 'messageWithButton'),
        arrayAsMessage: jest.fn(() => 'messageWithButton'),
        Text: jest.fn(() => 'Text'),
    };
});
describe('<UserGuide />', () => {
    const handleChange = jest.fn();
    it('renders user guide button', () => {
        render(<UserGuide {...mocked_props} handleTabChange={handleChange} />);
        const use_guide_button = screen.getByTestId('btn-user-guide');
        userEvent.click(use_guide_button);
        expect(screen.getByTestId('btn-user-guide')).toBeInTheDocument();
    });
});
