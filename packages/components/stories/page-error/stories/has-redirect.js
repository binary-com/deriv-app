import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import PageError from 'Components/page-error';
import Wrapper from '../../shared/wrapper';

const Basic = () => (
    <Router>
        <Wrapper is_block is_full_width is_dark={boolean('Dark Theme', false)}>
            <PageError
                header='We couldn’t find that page'
                messages={[
                    'You may have followed a broken link, or the page has moved to a new address.',
                    'Error code: 404 page not found',
                ]}
                redirect_label='Return to trade'
                buttonOnClick={action('buttonOnClick')}
                redirect_url={routes.trade}
            />
        </Wrapper>
    </Router>
);

export default Basic;
