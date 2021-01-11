import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import Theme from '../shared/theme';
import CompositeCheckbox from 'Components/composite-checkbox/composite-checkbox.jsx';
import notes from './README.md';
import 'Components/composite-checkbox/composite-checkbox.scss';
import 'Components/checkbox/checkbox.scss';

const stories = storiesOf('CompositeCheckbox', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

const Grid = ({ children, rows, cols }) => (
    <div
        style={{
            display: 'grid',
            gridTemplateRows: '1fr '.repeat(rows),
            gridTemplateColumns: '1fr '.repeat(cols),
            gridGap: '2rem',
            margin: '2rem',
        }}
    >
        {children}
    </div>
);

stories
    .add(
        'Simple',
        () => {
            const [value, setValue] = React.useState(false);
            return (
                <Theme is_dark={boolean('Theme', false)}>
                    <CompositeCheckbox
                        name='test'
                        label='Label'
                        description='Description'
                        value={value}
                        onChange={v => {
                            action(`Value is set to ${v.target.value}`);
                            setValue(v.target.value);
                        }}
                    />
                </Theme>
            );
        },
        { notes }
    )
    .add(
        'In a grid',
        () => {
            const [value, setValue] = React.useState(false);
            const [value2, setValue2] = React.useState(false);
            const [value3, setValue3] = React.useState(false);
            const [value4, setValue4] = React.useState(false);

            return (
                <Theme is_dark={boolean('Theme', false)}>
                    <Grid rows={2} cols={2}>
                        <CompositeCheckbox
                            name='test'
                            value={value}
                            label='Morty'
                            description='Mortimer "Morty" Smith Sr. is one of the two eponymous main protagonists in Rick and Morty. He is the grandson of Rick and is often forced to tag along on his various misadventures. Morty attends Harry Herpson High School along with his sister, Summer.'
                            onChange={v => setValue(v.target.value)}
                        />
                        <CompositeCheckbox
                            name='test2'
                            value={value2}
                            label='Evil Morty'
                            description='Evil Morty is one of the many versions of Morty in the multiverse. He is the main general antagonist for Rick and Morty. He currently serves as the first Morty to be democratically elected President of The Citadel. He first appeared in "Close Rick-Counters of the Rick Kind" as the true lead antagonist, and was seen being rounded up with the other Rickless Mortys.'
                            onChange={v => setValue2(v.target.value)}
                        />
                        <CompositeCheckbox
                            name='test3'
                            value={value3}
                            label='Rick'
                            description="Rick Sanchez is the titular anti-heroic main protagonist of the series. He is a genius scientist whose alcoholism and reckless, nihilistic behavior are a source of concern for his daughter's family, as well as the safety of their son, Morty. He is voiced by Justin Roiland. He is later revealed to be Morty's cousin in an interview with Roiland himself."
                            onChange={v => setValue3(v.target.value)}
                        />
                        <CompositeCheckbox
                            name='test4'
                            value={value4}
                            label='Jerry Smith'
                            description='Jerry Smith is the pentagonist of Rick and Morty. Jerry is the husband of Beth Smith, the father of Summer Smith and Morty Smith, and the son-in-law of Rick Sanchez.'
                            onChange={v => setValue4(v.target.value)}
                        />
                    </Grid>
                </Theme>
            );
        },
        { notes }
    );
