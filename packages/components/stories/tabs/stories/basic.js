import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { boolean } from '@storybook/addon-knobs';
import Tabs from 'Components/tabs';
import Wrapper from '../../shared/wrapper';

const Basic = () => (
    <Wrapper is_block is_dark={boolean('Dark Theme', false)}>
        <Router>
            <Tabs>
                <div header_content={<h3>Tab one</h3>} label='Tab label'>
                    <div className='tab-content-storybook'>Content for tab 1</div>
                </div>
                <div header_content={<h3>Tab two</h3>} label='Tab label'>
                    <div className='tab-content-storybook'>Content for tab 2</div>
                </div>
                <div header_content={<h3>Tab three</h3>} label='Tab label'>
                    <div className='tab-content-storybook'>Content for tab 3</div>
                </div>
            </Tabs>
        </Router>
    </Wrapper>
);

export default Basic;
