import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { boolean } from '@storybook/addon-knobs';
import Tabs from 'Components/tabs';
import Wrapper from '../../shared/wrapper';

const SingleTabNoLable = () => (
    <Wrapper is_full_width is_dark={boolean('Dark Theme', false)}>
        <Router>
            <Tabs single_tab_has_no_label>
                <div header_content='Tab one' label='Tab label'>
                    <div className='tab-content-storybook'>Content for tab 1</div>
                </div>
                <div />
            </Tabs>
        </Router>
    </Wrapper>
);

export default SingleTabNoLable;
