import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs';
import Popup from 'Components/popup';
import Wrapper from '../shared/wrapper';
import Button from 'Components/button';
import notes from './README.md';
import './styles.scss';

const tabs_detail = [
    {
        id: 1,
        title: 'Tab1',
        icon: 'IcAdd',
        renderBody: () => <div className='popup-storybook__tabs-detail-body'>Tab1</div>,
        has_footer_separator: true,
        renderFooter: () => <div className='popup-storybook__tabs-detail-footer'>Footer</div>,
    },
    {
        id: 2,
        title: 'Tab2',
        icon: 'IcMinus',
        renderBody: () => <div className='popup-storybook__tabs-detail-body'>Tab2</div>,
        has_footer_separator: false,
        renderFooter: () => <div className='popup-storybook__tabs-detail-footer'>Footer</div>,
    },
    {
        id: 3,
        title: 'Tab3',
        icon: 'IcGear',
        renderBody: () => <div className='popup-storybook__tabs-detail-body'>Tab3</div>,
    },
];

storiesOf('Popup', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Basic usage',
        () => {
            const [visibility, setVisibility] = React.useState(false);
            const toggleVisibility = () => setVisibility(!visibility);
            return (
                <Wrapper>
                    {!visibility && <Button onClick={toggleVisibility} text={'Click Me!'} primary medium />}
                    <div id='modal_root' />
                    <Popup
                        close_icon_color={text('close_icon_color', 'active')}
                        header_backgound_color={text('header_backgound_color', 'var(--wallet-credit)')}
                        header_contents_color={text('header_contents_color', 'var(--general-main-1)')}
                        tab_icon_color={text('tab_icon_color', 'var(--general-main-1)')}
                        active_tab_icon_color={text('active_tab_icon_color', 'var(--wallet-credit)')}
                        should_show_popup={visibility}
                        header_icon={text('header_icon', 'IcWalletCredit')}
                        tabs_detail={tabs_detail}
                        title={text('title', 'Skrill USD Wallet')}
                        balance={text('balance', '0.00 USD')}
                        togglePopupModal={toggleVisibility}
                        header_banner_text={text('header_banner_text', '')}
                        header_button_text={text('header_button_text', '')}
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
