import React from 'react';
import { storiesOf } from '@storybook/react';
import ContentExpander from 'Components/content-expander';
import Icon from 'Components/icon';
import Text from 'Components/text';
import notes from './README.md';

const dummy_el_title = (
    <React.Fragment>
        <Icon icon='IcUser' />
        <Text>Element Title</Text>
    </React.Fragment>
);
const dummy_string_title = 'String Title';
const dummy_text = (
    <React.Fragment>
        <Text as='p'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel lectus non leo sodales ultrices eget et
            urna. Fusce a condimentum mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque sodales
            magna mi, et lacinia elit molestie quis. Nulla at sem quis ipsum sodales sodales. Pellentesque pretium diam
            dui, eget tristique metus blandit sit amet. Nam et convallis urna, fringilla pretium urna. Quisque quis
            pulvinar urna, vel fermentum massa. Sed eu tortor vel mauris egestas ultrices sit amet non neque. Proin
            commodo diam eu tellus pellentesque sollicitudin. Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas. Phasellus feugiat mi sem, eget varius augue dapibus sit amet. Aliquam
            nisi nulla, iaculis sit amet ultrices quis, posuere ornare dolor. Suspendisse ut rutrum tortor, quis sodales
            orci. Interdum et malesuada fames ac ante ipsum primis in faucibus.
        </Text>
        <Text as='p'>
            Cras bibendum eu ligula eu sagittis. Donec in lacus tortor. Sed pharetra in metus in scelerisque. Donec
            commodo laoreet ligula a volutpat. Nulla facilisi. Nullam convallis tellus et sagittis facilisis. Proin sed
            congue nulla, eu egestas lacus. Pellentesque pharetra convallis massa, at finibus arcu dictum ut. Vivamus
            vel massa scelerisque, bibendum justo ac, maximus nulla. Pellentesque a tempus velit, ut euismod mauris.
            Suspendisse potenti.
        </Text>
    </React.Fragment>
);

storiesOf('Data Display|ContentExpander', module)
    .add(
        'Title is string',
        () => (
            <ContentExpander is_visible={true} title={dummy_string_title}>
                {dummy_text}
            </ContentExpander>
        ),
        {
            notes,
        }
    )
    .add(
        'Title is string, title is spaced',
        () => (
            <ContentExpander is_visible={true} title={dummy_string_title} is_title_spaced>
                {dummy_text}
            </ContentExpander>
        ),
        {
            notes,
        }
    )
    .add(
        'Title is string, title is red',
        () => (
            <ContentExpander is_visible={true} title={dummy_string_title} title_color='loss-danger'>
                {dummy_text}
            </ContentExpander>
        ),
        {
            notes,
        }
    )
    .add(
        'Title is string, arrow is inverted',
        () => (
            <ContentExpander is_visible={true} title={dummy_string_title} is_arrow_inverted>
                {dummy_text}
            </ContentExpander>
        ),
        {
            notes,
        }
    )
    .add(
        'Title is element',
        () => (
            <ContentExpander is_visible={true} title={dummy_el_title}>
                {dummy_text}
            </ContentExpander>
        ),
        {
            notes,
        }
    )
    .add(
        'Title is element, arrow is inverted',
        () => (
            <ContentExpander is_visible={true} title={dummy_el_title} is_arrow_inverted>
                {dummy_text}
            </ContentExpander>
        ),
        {
            notes,
        }
    );
