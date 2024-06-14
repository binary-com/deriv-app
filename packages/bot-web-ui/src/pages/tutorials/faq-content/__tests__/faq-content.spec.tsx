import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import FAQContent from '..';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mockedFaqContent = [
    {
        title: 'Mocked FAQ Title 1',
        description: [
            {
                type: 'text',
                content: 'Mocked FAQ Content 1',
            },
        ],
    },
    {
        title: 'Mocked FAQ Title 2',
        description: [
            {
                type: 'text',
                content: 'Mocked FAQ Content 2',
            },
        ],
    },
];

describe('<FAQContent />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({
        ui: {
            is_mobile_or_tablet: true,
        },
    });
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
        render(<FAQContent faq_list={mockedFaqContent} />, {
            wrapper,
        });
    });

    it('should render FAQContent', () => {
        expect(screen.getByTestId('id-faq__wrapper')).toBeInTheDocument();
    });

    it('should show content', () => {
        const acc = screen.getByTestId('id-accordion-test');
        userEvent.click(acc);
        expect(acc).toHaveTextContent('Mocked FAQ Title 1');
    });
});
