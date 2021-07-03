import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import notes from './README.md';
import Wrapper from '../shared/wrapper';
import IconTradeTypes from 'Components/icon-trade-types';
import TradeTypes from './tradeTypes';
import './icon-trade-types.stories.scss';

storiesOf('Assets|IconTradeTypes', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper inner_styles={{}} is_dark={boolean('Dark Theme', false)}>
                    <div className='grid-container'>
                        {TradeTypes.map((tradeName, index) => {
                            return (
                                <div className='box' key={index}>
                                    <p className='box__title'>{tradeName}</p>
                                    <IconTradeTypes className={'box__icon'} type={tradeName} size={16} />
                                </div>
                            );
                        })}
                    </div>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
