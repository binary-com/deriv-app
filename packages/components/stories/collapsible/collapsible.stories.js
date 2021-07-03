import React from 'react';
import { storiesOf } from '@storybook/react';
import Collapsible from 'Components/collapsible';
// import 'Components/dropdown/dropdown.scss';
import notes from './README.md';

storiesOf('Data Display|Collapsible', module)
    .add(
        'Top',
        () => (
            <Collapsible as='div'>
                <div collapsible>Will be collapsed</div>
                <div>Item 2</div>
                <div collapsible>Will be collapsed</div>
                <div>Item 4</div>
                <div>Item 5</div>
                <div>Item 1</div>
            </Collapsible>
        ),
        {
            notes,
        }
    )
    .add(
        'Bottom',
        () => (
            <Collapsible position='bottom' is_collapsed>
                <li collapsible>Will be collapsed</li>
                <li>Item 2</li>
                <li collapsible>Will be collapsed</li>
                <li>Item 4</li>
                <li>Item 5</li>
                <li>Item 1</li>
            </Collapsible>
        ),
        {
            notes,
        }
    )
    .add(
        'Static',
        () => (
            <Collapsible position='top' is_collapsed>
                <li>Item 2</li>
                <li>Item 4</li>
                <li>Item 5</li>
                <li>Item 1</li>
            </Collapsible>
        ),
        {
            notes,
        }
    )
    .add(
        'with Title',
        () => (
            <Collapsible position='top' is_collapsed title='Title'>
                <li collapsible='true'>Content</li>
            </Collapsible>
        ),
        {
            notes,
        }
    );
