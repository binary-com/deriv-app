import { storiesOf } from '@storybook/react';
import Icon from 'Components/icon';
import MobileDrawer from 'Components/mobile-drawer';
import Div100vhContainer from 'Components/div100vh-container';
import React from 'react';
import notes from './README.md';
import './mobile-deawer.stories.scss';

storiesOf('Data Display|Mobile Drawer', module).add(
    'Main function',
    () => {
        const [is_open, set_is_open] = React.useState(true);
        const [is_submenu_expanded, set_is_submenu_expanded] = React.useState(false);

        const toggleDrawer = () => {
            set_is_open(!is_open);
        };
        const toggleSubMenu = () => {
            set_is_submenu_expanded(!is_submenu_expanded);
        };

        return (
            <React.Fragment>
                {!is_open && (
                    <a onClick={toggleDrawer}>
                        <Icon icon='IcHamburger' width='32px' height='32px' />
                    </a>
                )}
                <MobileDrawer
                    alignment='left'
                    is_open={is_open}
                    toggle={toggleDrawer}
                    id='dt_mobile_drawer'
                    title={'Menu'}
                    height='100vh'
                    width='295px'
                >
                    <Div100vhContainer height_offset='40px'>
                        <div className='header__menu-mobile-body-wrapper'>
                            <MobileDrawer.SubHeader>
                                <p>Sub Header</p>
                            </MobileDrawer.SubHeader>

                            <MobileDrawer.Body>
                                {Array.from(new Array(3)).map((item, index) => (
                                    <MobileDrawer.Item key={index}>
                                        <p>{`Menu item ${index}`}</p>
                                    </MobileDrawer.Item>
                                ))}

                                <MobileDrawer.SubMenu
                                    has_subheader
                                    submenu_icon='IcStage1'
                                    submenu_title={'SubMenu Title'}
                                    submenu_suffix_icon='IcChevronRight'
                                    onToggle={toggleSubMenu}
                                >
                                    {Array.from(new Array(2)).map((lang, idx) => (
                                        <MobileDrawer.Item key={idx}>
                                            <p>{`SubMenu item ${idx}`}</p>
                                        </MobileDrawer.Item>
                                    ))}
                                    <MobileDrawer.SubMenuSection
                                        section_icon={'IcStage2'}
                                        section_title={'SubMenu Section'}
                                    >
                                        {Array.from(new Array(2)).map((lang, idx) => (
                                            <MobileDrawer.Item key={idx}>
                                                <p>{`Section Item ${idx}`}</p>
                                            </MobileDrawer.Item>
                                        ))}
                                    </MobileDrawer.SubMenuSection>

                                    <MobileDrawer.Item>
                                        <p>{`SubMenu item 2`}</p>
                                    </MobileDrawer.Item>
                                </MobileDrawer.SubMenu>

                                {Array.from(new Array(2)).map((item, index) => (
                                    <MobileDrawer.Item key={index}>
                                        <p>{`Menu item ${index + 2}`}</p>
                                    </MobileDrawer.Item>
                                ))}
                            </MobileDrawer.Body>
                        </div>
                        <MobileDrawer.Footer>
                            <p>Footer</p>
                        </MobileDrawer.Footer>
                    </Div100vhContainer>
                </MobileDrawer>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
