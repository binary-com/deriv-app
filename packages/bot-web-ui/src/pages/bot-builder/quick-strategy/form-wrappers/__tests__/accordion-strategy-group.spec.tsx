import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import { quick_strategy_content } from '../../../../tutorials/constants';
import { TDescriptionItem, TStrategyDescription } from '../../types';
import AccordionStrategyGroup, { DescriptionContent } from '../accordion-strategy-group';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

jest.mock('../../descriptions/strategy-description.tsx', () => {
    const StrategyDescription = ({ item, font_size }: TStrategyDescription) => (
        <>
            {item?.content?.map((text: string) => (
                <div data-testid='strategy-description' key={text}>
                    {text} - {font_size}
                </div>
            ))}
        </>
    );
    StrategyDescription.displayName = 'StrategyDescription';
    return StrategyDescription;
});

const mockDataContent: TDescriptionItem = {
    type: 'type',
    src: '/path',
    alt: 'content',
    className: 'content',
    expanded: true,
    no_collapsible: true,
    font_size: '16px',
};

const mockData = [
    {
        id: 1,
        content: ['Item 1'],
        ...mockDataContent,
    },
    {
        id: 2,
        content: ['Item 2'],
        ...mockDataContent,
    },
    {
        id: 3,
        content: ['Item 3'],
        ...mockDataContent,
    },
];

const mock_props = {
    expanded_subtitles_storage: {},
    setExpandedSubtitlesStorage: jest.fn(),
};

describe('<DescriptionContent />', () => {
    it('should render DescriptionContent component', () => {
        const { container } = render(<DescriptionContent item={mockData} font_size='16px' />);
        const descriptions = screen.getAllByTestId('strategy-description');

        expect(descriptions).toHaveLength(3);

        expect(descriptions[0]).toHaveTextContent('Item 1 - 16px');
        expect(descriptions[1]).toHaveTextContent('Item 2 - 16px');
        expect(descriptions[2]).toHaveTextContent('Item 3 - 16px');
        expect(container).not.toBeEmptyDOMElement();
    });

    it('should render empty DescriptionContent component if the item is a string', () => {
        const { container } = render(<DescriptionContent item={'Strategy description'} font_size='16px' />);

        expect(container).toBeEmptyDOMElement();
    });
});

describe('<AccordionStrategyGroup />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render AccordionStrategyGroup component', () => {
        const { container } = render(<AccordionStrategyGroup {...mock_props} grouped_objects_by_title={[mockData]} />, {
            wrapper,
        });

        expect(container).not.toBeEmptyDOMElement();
    });

    it('should render AccordionStrategyGroup component with s fontsize if it is a desktop version and tutorial_selected_strategy provided', () => {
        mock_store.ui.is_desktop = true;
        const { container } = render(
            <AccordionStrategyGroup
                {...mock_props}
                tutorial_selected_strategy={quick_strategy_content[0].qs_name}
                grouped_objects_by_title={[mockData]}
            />,
            { wrapper }
        );

        const spanElement = screen.getByText('Item 1 - s');

        expect(container).not.toBeEmptyDOMElement();
        // eslint-disable-next-line testing-library/no-node-access
        expect(spanElement?.parentElement).toHaveStyle('--text-size: var(--text-size-s)');
    });

    it('should render AccordionStrategyGroup component with xs fontsize if it is a mobile version', () => {
        mock_store.ui.is_mobile = true;
        const { container } = render(<AccordionStrategyGroup {...mock_props} grouped_objects_by_title={[mockData]} />, {
            wrapper,
        });

        const spanElement = screen.getByText('Item 1 - xs');

        expect(container).not.toBeEmptyDOMElement();
        // eslint-disable-next-line testing-library/no-node-access
        expect(spanElement?.parentElement).toHaveStyle('--text-size: var(--text-size-xs)');
    });

    it('should render AccordionStrategyGroup component with empty content if the grouped_objects_by_title equal empty array', () => {
        const { container } = render(
            <AccordionStrategyGroup
                {...mock_props}
                tutorial_selected_strategy={quick_strategy_content[0].qs_name}
                grouped_objects_by_title={[[]]}
            />,
            { wrapper }
        );

        const accordionContent = screen.getByTestId('accordion-content');

        expect(container).not.toBeEmptyDOMElement();
        expect(accordionContent).not.toHaveTextContent(/.+/);
    });
});
