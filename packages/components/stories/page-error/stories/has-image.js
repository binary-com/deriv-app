import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import PageError from 'Components/page-error';
import Wrapper from '../../shared/wrapper';
import image_404 from '../page-not-found.png';

const HasImage = () => (
    <Wrapper className='page-error-storybook' is_block is_full_width is_dark={boolean('Dark Theme', false)}>
        <PageError
            header='We couldn’t find that page'
            classNameImage='page-error-storybook-image'
            image_url={image_404}
            messages={[
                'You may have followed a broken link, or the page has moved to a new address.',
                'Error code: 404 page not found',
            ]}
        />
    </Wrapper>
);

export default HasImage;
