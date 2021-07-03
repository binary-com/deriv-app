import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import { toMoment } from '@deriv/shared';
import DatePicker from 'Components/date-picker';
import Theme from '../shared/theme';

const stories = storiesOf('Data Entry|Date/DatePicker', module);

const FlexWrapper = ({ children, justifyContent = 'center' }) => (
    <div
        style={{
            display: 'flex',
            padding: '36px',
            justifyContent,
        }}
    >
        {children}
    </div>
);

const DatePickerWrapper = ({ children }) => (
    <div
        style={{
            margin: '0 4px',
            width: '280px',
        }}
    >
        {children}
    </div>
);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories
    .add('basic', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('label', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} label='DatePicker Label' />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('alignment', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} label='Left align' alignment='left' />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('display format', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} label='Default' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} label='DD-MM-YYY' display_format='DD-MM-YYYY' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} label='DD/MM/YYYY' display_format='DD/MM/YYYY' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} label='DD MMM YYYY' display_format='DD MMM YYYY' />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('leading icon', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} show_leading_icon />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('is clearable', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} is_clearable />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('placeholder', () => {
        return (
            <Theme is_dark={boolean('Theme', false)}>
                <FlexWrapper>
                    <DatePickerWrapper>
                        <DatePicker value={toMoment()} placeholder='I am placeholder' />
                    </DatePickerWrapper>
                </FlexWrapper>
            </Theme>
        );
    })
    .add('footer', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} footer='Abracadabra!' has_today_btn />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('mode', () => {
        const [footer, setFooterText] = React.useState('');

        const onChange = e => {
            setFooterText(`Duration: ${e.duration} ${e.duration === 1 ? 'day' : 'days'}`);
        };

        return (
            <Theme is_dark={boolean('Theme', false)}>
                <FlexWrapper>
                    <DatePickerWrapper>
                        <DatePicker
                            value={toMoment()}
                            label='Default'
                            min_date={toMoment()}
                            onChange={onChange}
                            has_today_btn
                        />
                    </DatePickerWrapper>
                    <DatePickerWrapper>
                        <DatePicker
                            label='Range picker'
                            footer={footer}
                            mode='duration'
                            min_date={toMoment()}
                            onChange={onChange}
                            has_range_selection
                            value={toMoment()}
                        />
                    </DatePickerWrapper>
                </FlexWrapper>
            </Theme>
        );
    })
    .add('view', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} label='Default' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} label='Month' calendar_view='month' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} label='Year' calendar_view='year' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker value={toMoment()} label='Decade' calendar_view='decade' />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ));
